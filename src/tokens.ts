import { color as c } from './palette.js';

export type Variant = 'dark' | 'vibrant';
export const variants = [
  { id: 'dark', name: 'New UI Dark', file: 'new-ui-dark' },
  { id: 'vibrant', name: 'New UI Dark Vibrant', file: 'new-ui-dark-vibrant' },
] as const;

export function tokens(variant: Variant) {
  const vibrant = variant === 'vibrant';
  return {
    // Original shared surfaces, with the corrected integrated breadcrumb.
    canvas: c('slate', 1), editor: c('slate', 2), surface: c('slate', 3),
    hover: c('slate', 4), pressed: c('slate', 5), border: c('slate', 6),
    controlBorder: c('slate', 7), guide: c('slate', 4), guideActive: c('slate', 7),
    text: c('slate', 12), secondary: c('slate', 11), muted: c('slate', 10),
    accent: c('blue', 11), focus: c('slate', 8),
    selection: c('slate', 7, true), selectionInactive: c('slate', 5, true),
    highlight: c('slate', 4, true), shadow: c('slate', 1),
    success: c('green', 11), error: c('red', 11), warning: c('amber', 11), info: c('cyan', 11),
    added: c('green', 3, true), removed: c('red', 3, true),
    syntax: {
      plain: c('slate', 12), punctuation: c('slate', 11), comment: c('gray', 11), documentation: c('gray', 11),
      keyword: c('violet', 11), declaration: c('pink', 11), modifier: c('pink', 11),
      operator: c('pink', 11),
      function: c(vibrant ? 'cyan' : 'sky', 11),
      functionDeclaration: c('cyan', 11),
      type: c(vibrant ? 'purple' : 'iris', vibrant ? 11 : 12),
      primitive: c('sky', 12),
      string: c('green', vibrant ? 11 : 12),
      constant: c('amber', vibrant ? 11 : 12),
      boolean: c('amber', 11),
      parameter: c('slate', 12), property: c('slate', 12),
      namespace: c('slate', 11),
      decorator: c('plum', 11),
      tag: c('violet', 11), attribute: c('sky', 12),
      markupAttribute: c('slate', 12), markupString: c('violet', 11),
      escape: c('pink', 11), invalid: c('red', 11),
    },
    declarationBold: true,
  };
}
export type Tokens = ReturnType<typeof tokens>;
