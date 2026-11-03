# Referências para validação

`workbench-colors.json` é um snapshot dos identificadores documentados em
[Theme Color Reference](https://code.visualstudio.com/api/references/theme-color),
extraídos de `microsoft/vscode-docs/api/references/theme-color.md` em 2026-11-03.
O arquivo registra a URL de origem e a data; a validação não acessa a rede.
Para atualizar, extraia os identificadores dos itens de lista no Markdown oficial
e revise o diff antes de substituir a lista. Não derive a lista dos temas gerados.

As gramáticas não são copiadas nem incluídas na extensão. `validate:syntax` usa
`vscode-textmate` e `vscode-oniguruma` com as gramáticas fornecidas pela instalação
local do VS Code. A saída identifica o diretório utilizado; atualizações do editor
podem mudar os escopos. A primeira validação foi executada no VS Code 1.144.1.

As 112 verificações cobrem a cor efetivamente resolvida para tokens selecionados
nas nove linguagens, nas duas variantes, sem Semantic Tokens. Não simulam
servidores de linguagem nem garantem cobertura de toda construção possível.
