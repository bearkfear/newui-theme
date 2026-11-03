import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { officialDarkColors } from './palette.js';
import { contrast } from './contrast.js';
import { tokens, variants } from './tokens.js';
import { createTheme } from './theme.js';

async function validate() {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  const registry = JSON.parse(await readFile('validation/workbench-colors.json', 'utf8')) as { keys: string[] };
  const allowedKeys = new Set(registry.keys);
  assert.equal(manifest.contributes.themes.length, variants.length);
  const results: string[] = [];
  for (const variant of variants) {
    const path = `themes/${variant.file}-color-theme.json`;
    const raw = await readFile(path, 'utf8');
    const theme = JSON.parse(raw) as ReturnType<typeof createTheme>;
    assert.equal(raw, JSON.stringify(createTheme(variant), null, 2) + '\n', `${path}: stale generated file`);
    assert.deepEqual(Object.keys(theme).sort(), ['$schema', 'name', 'type', 'semanticHighlighting', 'colors', 'tokenColors', 'semanticTokenColors'].sort());
    assert.equal(theme.type, 'dark');
    assert.equal(theme.semanticHighlighting, true);
    assert.equal(theme.name, variant.name);
    const contribution = manifest.contributes.themes.find((v: { label: string }) => v.label === variant.name);
    assert.equal(contribution?.path, `./${path}`);
    assert.equal(contribution.uiTheme, 'vs-dark');
    function official(value: string, label: string, opaque = false) {
      assert.match(value, opaque ? /^#[\da-f]{6}$/i : /^#[\da-f]{6}([\da-f]{2})?$/i, label);
      assert(officialDarkColors.has(value.toLowerCase()), `${label}: non-Radix dark color ${value}`);
    }
    for (const [key, value] of Object.entries(theme.colors)) {
      assert(allowedKeys.has(key), `Unknown VS Code workbench key: ${key}`);
      official(value, key);
    }
    const scopes = new Set<string>();
    for (const rule of theme.tokenColors) {
      assert(rule.name && rule.scope.length);
      official(rule.settings.foreground, rule.name, true);
      for (const style of rule.settings.fontStyle?.split(' ') ?? []) assert(['', 'bold', 'italic', 'underline', 'strikethrough'].includes(style));
      for (const scope of rule.scope) {
        assert.match(scope, /^[\w.-]+(?: [\w.-]+)*$/, scope);
        assert(!scopes.has(scope), `Duplicate TextMate selector: ${scope}`);
        assert(!/^(source|meta|variable|entity|support|punctuation)$/.test(scope), `Overly broad selector: ${scope}`);
        scopes.add(scope);
      }
    }
    for (const [selector, style] of Object.entries(theme.semanticTokenColors)) {
      assert.match(selector, /^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*(?::[a-zA-Z]\w*)?$/);
      official(style.foreground, selector, true);
      for (const key of Object.keys(style)) assert(['foreground', 'bold', 'italic', 'underline', 'strikethrough'].includes(key));
    }
    const t = tokens(variant.id);
    let minSyntax = Infinity;
    for (const [role, value] of Object.entries(t.syntax)) {
      const ratio = contrast(value, t.editor);
      assert(ratio >= 4.5, `${variant.name} / ${role}: ${ratio.toFixed(2)} < 4.5:1`);
      minSyntax = Math.min(minSyntax, ratio);
    }
    const pairs = [['foreground', 'sideBar.background'], ['editor.foreground', 'editor.background'], ['input.foreground', 'input.background'], ['menu.foreground', 'menu.background'], ['quickInput.foreground', 'quickInput.background'], ['list.activeSelectionForeground', 'list.activeSelectionBackground'], ['editorSuggestWidget.foreground', 'editorSuggestWidget.selectedBackground'], ['statusBar.foreground', 'statusBar.background'], ['button.foreground', 'button.background'], ['badge.foreground', 'badge.background'], ['input.placeholderForeground', 'input.background'], ['tab.inactiveForeground', 'tab.inactiveBackground']];
    for (const [fg, bg] of pairs) assert(contrast(theme.colors[fg!]!, theme.colors[bg!]!) >= 4.5, `${variant.name}: insufficient contrast ${fg}/${bg}`);
    results.push(`${variant.name}: ${Object.keys(theme.colors).length} UI colors, ${scopes.size} TextMate selectors, ${Object.keys(theme.semanticTokenColors).length} semantic selectors; minimum syntax contrast ${minSyntax.toFixed(2)}:1`);
  }
  // Original architecture: shared UI, with variant-specific syntax intensity.
  const themes = variants.map(createTheme);
  assert.equal(new Set(themes.map(theme => JSON.stringify(theme.tokenColors))).size, variants.length);
  for (const theme of themes) assert.deepEqual(theme.colors, themes[0]!.colors);
  console.log(results.join('\n'));
  console.log('PASS: official Radix dark colors, manifest, UI keys, deterministic JSON, scopes, styles and contrast.');
}
validate().catch(error => { console.error(error); process.exitCode = 1; });
