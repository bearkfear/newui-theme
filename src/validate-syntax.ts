import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { Registry, parseRawGrammar, INITIAL, type IRawGrammar } from 'vscode-textmate';
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma';
import { variants, tokens } from './tokens.js';
import { createTheme } from './theme.js';

async function findExtensions() {
  const candidates = [process.env.VSCODE_EXTENSIONS_PATH,
    '/Applications/Visual Studio Code.app/Contents/Resources/app/extensions',
    '/usr/share/code/resources/app/extensions', '/usr/lib/code/resources/app/extensions',
    '/opt/visual-studio-code/resources/app/extensions',
    join(process.env.LOCALAPPDATA ?? '', 'Programs/Microsoft VS Code/resources/app/extensions'),
    join(process.env.ProgramFiles ?? '', 'Microsoft VS Code/resources/app/extensions')];
  const server = join(homedir(), '.vscode-server', 'bin');
  try { for (const version of await readdir(server)) candidates.push(join(server, version, 'extensions')); } catch { /* desktop candidates remain */ }
  for (const path of candidates) if (path) { try { await access(join(path, 'typescript-basics', 'package.json')); return path; } catch { /* try next */ } }
  throw new Error('VS Code grammars not found. Set VSCODE_EXTENSIONS_PATH to <VS Code>/resources/app/extensions.');
}

async function validateSyntax() {
  const root = await findExtensions();
  const grammars = new Map<string, string>();
  const injections = new Map<string, string[]>();
  for (const extension of await readdir(root)) {
    try {
      const pkg = JSON.parse(await readFile(join(root, extension, 'package.json'), 'utf8'));
      for (const grammar of pkg.contributes?.grammars ?? []) {
        grammars.set(grammar.scopeName, join(root, extension, grammar.path));
        for (const target of grammar.injectTo ?? []) injections.set(target, [...(injections.get(target) ?? []), grammar.scopeName]);
      }
    } catch { /* Non-extension directories are expected. */ }
  }
  await loadWASM(await readFile(require.resolve('vscode-oniguruma/release/onig.wasm')));
  const registry = new Registry({
    onigLib: Promise.resolve({ createOnigScanner: patterns => new OnigScanner(patterns), createOnigString: text => new OnigString(text) }),
    loadGrammar: async scope => {
      const path = grammars.get(scope);
      return path ? parseRawGrammar(await readFile(path, 'utf8'), path) : null;
    },
    getInjections: scope => injections.get(scope) ?? [],
  });
  type Check = { text: string; role: keyof ReturnType<typeof tokens>['syntax']; occurrence?: number };
  const cases: { file: string; path?: string; scope: string; checks: Check[] }[] = [
    { file: 'ts', scope: 'source.ts', checks: [{ text: 'export', role: 'modifier' }, { text: 'displayName', role: 'functionDeclaration' }, { text: 'Guest', role: 'string' }, { text: '42', role: 'constant' }, { text: 'true', role: 'boolean' }, ...['?.', '??', '&&', '||', '=', '=>', '+'].map(text => ({ text, role: 'operator' as const }))] },
    { file: 'tsx', scope: 'source.tsx', checks: [{ text: 'article', role: 'tag' }, { text: 'className', role: 'markupAttribute' }, { text: 'card', role: 'markupString' }, { text: '??', role: 'operator' }] },
    { file: 'js', scope: 'source.js', checks: [{ text: 'const', role: 'declaration' }, { text: 'function', role: 'declaration' }, { text: 'param', role: 'documentation' }, { text: 'string', role: 'documentation' }, { text: 'return', role: 'keyword' }, { text: 'World', role: 'string' }, { text: '=>', role: 'operator' }] },
    { file: 'rs', scope: 'source.rust', checks: [{ text: 'struct', role: 'declaration' }, { text: 'Entry', role: 'type', occurrence: 0 }, { text: 'Radix', role: 'string' }, { text: '&&', role: 'operator' }] },
    { file: 'go', scope: 'source.go', checks: [{ text: 'User', role: 'type', occurrence: 1 }, { text: 'Hello, ', role: 'string' }, { text: '42', role: 'constant' }, { text: '&&', role: 'operator' }] },
    { file: 'php', scope: 'text.html.php', checks: [{ text: 'Guest', role: 'string' }, { text: '42', role: 'constant' }, { text: '&&', role: 'operator' }, { text: '??', role: 'operator' }] },
    { file: 'html', scope: 'text.html.basic', checks: [{ text: 'article', role: 'tag' }, { text: '<article', role: 'punctuation' }, { text: '=', role: 'operator' }, { text: 'class', role: 'markupAttribute' }, { text: 'card', role: 'markupString', occurrence: 1 }] },
    { file: 'css', scope: 'source.css', checks: [{ text: 'display', role: 'attribute' }, { text: '0.95', role: 'constant' }, { text: 'Inter', role: 'string' }] },
    { file: 'json', scope: 'source.json', checks: [{ text: 'name', role: 'attribute' }, { text: 'New UI Theme', role: 'string' }, { text: 'true', role: 'boolean' }, { text: '42', role: 'constant' }, { text: 'null', role: 'boolean' }] },
    { file: 'markup-details.tsx', path: 'fixtures/markup-details.tsx', scope: 'source.tsx', checks: [{ text: 'Card', role: 'tag' }, { text: 'title', role: 'markupAttribute' }, { text: 'hello', role: 'markupString' }, { text: 'code', role: 'string' }, { text: '<', role: 'punctuation' }, { text: '/>', role: 'punctuation' }, { text: '=', role: 'operator' }, { text: 'data-id', role: 'markupAttribute' }] },
  ];
  let assertions = 0;
  const seenScopes = new Set<string>();
  for (const variant of variants) {
    const theme = createTheme(variant);
    registry.setTheme({ settings: [{ settings: { foreground: theme.colors['editor.foreground'], background: theme.colors['editor.background'] } }, ...theme.tokenColors] });
    for (const test of cases) {
      const grammar = await registry.loadGrammar(test.scope);
      assert(grammar, `Missing grammar ${test.scope}`);
      const source = await readFile(test.path ?? `fixtures/showcase.${test.file}`, 'utf8');
      const lines = source.split('\n');
      let state = INITIAL;
      const colored: { line: string; offset: number; start: number; end: number; color: string; scopes: string[] }[] = [];
      let offset = 0;
      for (const line of lines) {
        const plain = grammar.tokenizeLine(line, state);
        const binary = grammar.tokenizeLine2(line, state);
        for (const token of plain.tokens) token.scopes.forEach(scope => seenScopes.add(scope));
        for (let i = 0; i < binary.tokens.length; i += 2) {
          const start = binary.tokens[i]!;
          const end = binary.tokens[i + 2] ?? line.length;
          const colorIndex = (binary.tokens[i + 1]! >>> 15) & 0x1ff;
          colored.push({ line, offset, start, end, color: registry.getColorMap()[colorIndex]!.toLowerCase(), scopes: plain.tokens.find(t => t.startIndex <= start && t.endIndex > start)?.scopes ?? [] });
        }
        state = plain.ruleStack;
        offset += line.length + 1;
      }
      for (const check of test.checks) {
        let index = -1;
        for (let n = 0; n <= (check.occurrence ?? 0); n++) index = source.indexOf(check.text, index + 1);
        assert(index >= 0, `${test.file}: absent test token ${check.text}`);
        const token = colored.find(t => index >= t.offset + t.start && index < t.offset + t.end);
        const expected = tokens(variant.id).syntax[check.role];
        assert.equal(token?.color, expected, `${variant.name}/${test.file}: ${check.text} expected ${check.role}; scopes: ${token?.scopes.join(' ')}`);
        assertions++;
      }
    }
  }
  registry.dispose();
  console.log(`PASS: ${assertions} TextMate color assertions, ${new Set(cases.map(test => test.scope)).size} languages × ${variants.length} variants; ${seenScopes.size} real scopes observed.\nGrammars: ${root}`);
}
validateSyntax().catch(error => { console.error(error); process.exitCode = 1; });
