import { tokens, variants } from './tokens.js';
import { syntax } from './syntax.js';
import { workbench } from './workbench.js';
export function createTheme(variant: typeof variants[number]) {
  const t = tokens(variant.id);
  return {
    $schema: 'vscode://schemas/color-theme', name: variant.name, type: 'dark',
    semanticHighlighting: true, colors: workbench(t), ...syntax(t),
  };
}
