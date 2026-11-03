# New UI Theme

Uma coleção de temas escuros para Visual Studio Code, construída exclusivamente
com as escalas Dark oficiais de `@radix-ui/colors`.

| Tema | Personalidade |
| --- | --- |
| **New UI Dark** | Equilíbrio original: funções sky/cyan, tipos iris suaves, strings verdes e valores âmbar. |
| **New UI Dark Vibrant** | Funções cyan, tipos purple e strings/valores mais expressivos no passo 11. |

A base visual segue a **0.1.2**, após a correção do breadcrumb, com ajustes
específicos em HTML/JSX para separar tags, delimitadores, atributos e valores.
As duas variantes compartilham moldura Slate 1, editor Slate 2 e overlays Slate 3.
Hover usa Slate 4 e estados pressionados Slate 5. Breadcrumbs compartilham o
fundo do editor, com um separador discreto nas abas.

A interface usa accent azul suave, seleções neutras e brackets Slate.
A diferença entre variantes está na intensidade da sintaxe. Todos os valores
vêm diretamente das escalas Dark do Radix, incluindo os overlays alpha oficiais.

## Testar com F5

Requisitos: Node.js 22 ou superior, npm e VS Code estável.

```sh
npm ci
npm run build
```

Abra esta pasta no VS Code e pressione **F5**. Na janela **Extension Development
Host**, execute **Preferences: Color Theme** (`⌘K ⌘T` no macOS, `Ctrl+K Ctrl+T`
no Windows/Linux) e escolha uma das duas variantes. A pasta `fixtures/` será
aberta para comparar TypeScript, TSX, JavaScript, Rust, Go, PHP, HTML, CSS e JSON.
Não é necessário publicar nem entrar no Marketplace.

## Instalar nesta máquina

```sh
npm run package
code --install-extension new-ui-theme-0.1.15.vsix
```

Também é possível usar **Extensions: Install from VSIX...**. O comando de
empacotamento baixa a ferramenta oficial `@vscode/vsce` via npm, apenas durante
o desenvolvimento. O campo `publisher` é uma identificação local; para publicar
futuramente, substitua-o por um publisher sob seu controle.

Os arquivos `themes/*.json` já estão gerados e devem ser versionados. A extensão
é declarativa: não executa JavaScript, não instala dependências no host e não
consulta serviços externos. Somente manifesto, temas e documentação entram no VSIX.

## Editar e reconstruir

```sh
npm run build          # TypeScript + geração determinística dos dois temas
npm run generate       # alias de build
npm run validate       # cores, contraste, estrutura, escopos e arquivos atualizados
npm run validate:syntax # tokenização com as gramáticas do VS Code instalado
npm run check          # build + todas as validações
```

Para reconstrução contínua, execute **Tasks: Run Task → watch themes**. Ou, após
um build inicial, rode `npm run watch` e `npm run watch:themes` em terminais
separados. O VS Code recarrega alterações no arquivo do tema ativo; se necessário,
selecione novamente o tema ou use **Developer: Reload Window**.

`validate:syntax` encontra instalações usuais de VS Code no macOS, Linux, Windows
e VS Code Server. Para instalações portáteis ou personalizadas, defina
`VSCODE_EXTENSIONS_PATH` com o caminho de `resources/app/extensions` da aplicação
(não a pasta de extensões do usuário). A validação básica não exige VS Code e
funciona offline após `npm ci`.

## Arquitetura

| Arquivo | Responsabilidade |
| --- | --- |
| `src/palette.ts` | Acesso tipado às escalas oficiais; conjunto de cores permitidas. |
| `src/tokens.ts` | Tokens compartilhados e diferenças entre as variantes. |
| `src/workbench.ts` | Mapeamento de tokens para componentes do VS Code. |
| `src/syntax.ts` | Regras TextMate e Semantic Tokens. |
| `src/theme.ts` | Composição do formato final de Color Theme. |
| `src/generate.ts` | Escrita determinística dos JSONs. |
| `src/validate*.ts` | Validação dos artefatos e tokenização real de amostras. |
| `validation/workbench-colors.json` | Lista de propriedades da referência oficial, para verificação offline. |

Edite os arquivos em `src/`, não os JSONs finais. O pacote Radix está fixado em
`3.0.0`; `package-lock.json` fixa as demais dependências de desenvolvimento.

## Decisões de sintaxe

- Controle de fluxo em violeta; declarações e modificadores em Pink 11, incluindo
  `import`, `export`, `const`, `function`, `interface` e modificadores de acesso.
- Operadores em pink, incluindo arrows, acesso opcional, coalescência e ternários.
- Funções em sky/cyan e declarações com negrito discreto.
- Tipos definidos pelo usuário em iris suave/purple; primitivos em sky.
- HTML/JSX: tags e valores literais em lavanda (Violet 11), atributos Slate 12,
  delimitadores Slate 11 e atribuição em pink. Expressões JSX mantêm as cores
  normais de código, inclusive strings verdes. CSS e JSON preservam seus atributos em sky.
- Strings verdes, números e constantes âmbar; o Vibrant usa o passo 11 mais expressivo.
- Parâmetros, variáveis e propriedades em Slate 12 para leitura uniforme;
  namespaces em Slate 11.
- Decorators em plum; documentação e comentários em Gray 11, sem itálico.
- Brackets neutros e realce estático nativo; nenhum módulo de animação.

Semantic Tokens estão habilitados e complementam o fallback TextMate. A distinção
exata entre chamada, declaração, tipo primitivo e tipo definido depende das
informações fornecidas pela gramática e pelo servidor de linguagem. Extensões
como rust-analyzer, Go e PHP podem enriquecer a semântica; não são dependências
da extensão de tema. Nomes não reconhecidos permanecem na cor neutra do editor.

## Verificação visual

1. Abra os exemplos em `fixtures/` e compare as duas variantes.
2. Teste também com `editor.semanticHighlighting.enabled: false` para observar
   o fallback TextMate e reative com `configuredByTheme`.
3. Use **Developer: Inspect Editor Tokens and Scopes** para conferir o token
   sob o cursor. As regras evitam colorir contêineres completos de funções.
4. Confira Explorer, abas, Command Palette, sugestões, hover, menus e terminal.
5. Selecione texto, busque um termo, abra um diff e observe erros/avisos.
   Os seis níveis de bracket pairs usam Slate, inclusive com
   `editor.bracketPairColorization.enabled` habilitado.

A validação exige contraste WCAG de pelo menos **4,5:1** para todos os papéis de
sintaxe sobre o editor e para os principais pares de texto/superfície da UI.
Guias, bordas, decoração e overlays têm finalidades diferentes e não são tratados
como texto. Esse teste não equivale a uma certificação de acessibilidade de toda
a interface. `npm run check` também detecta seletores repetidos, cores externas,
propriedades desconhecidas e divergências entre fontes e JSONs gerados. Também
verifica a interface compartilhada e a sintaxe distinta entre variantes.

## Referências oficiais

- [VS Code: Color Theme](https://code.visualstudio.com/api/extension-guides/color-theme)
- [VS Code: Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [VS Code: Syntax Highlight Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [VS Code: Semantic Highlight Guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- [Radix Colors: uso do pacote](https://www.radix-ui.com/colors/docs/overview/usage)
- [Radix Colors: passos da escala](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)

MIT. As cores Radix são distribuídas pelo pacote oficial sob licença MIT.
