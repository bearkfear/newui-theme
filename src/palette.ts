import * as radix from '@radix-ui/colors';

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Family = 'slate' | 'gray' | 'mauve' | 'violet' | 'purple' | 'iris' | 'pink' | 'plum' | 'cyan' | 'sky' | 'green' | 'grass' | 'amber' | 'yellow' | 'red' | 'blue' | 'orange' | 'tomato' | 'crimson';
/** No mixing, hand-authored hex values or appended opacity. Alpha comes from Radix too. */
export function color(family: Family, step: Step, alpha = false): string {
  const scale = radix[`${family}Dark${alpha ? 'A' : ''}`] as Record<string, string>;
  return scale[`${family}${alpha ? 'A' : ''}${step}`]!;
}
export const officialDarkColors = new Set(
  Object.entries(radix).filter(([name]) => /DarkA?$/.test(name))
    .flatMap(([, scale]) => Object.values(scale)).filter((v): v is string => typeof v === 'string' && /^#[\da-f]{6}([\da-f]{2})?$/i.test(v))
    .map(v => v.toLowerCase()),
);
