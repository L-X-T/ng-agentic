import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind utility class strings, letting later classes win over earlier
 * conflicting ones. Mirrors the `hlm` helper shipped with spartan-ng helm components,
 * implemented locally on top of `tailwind-merge`.
 */
export function hlm(...classes: (string | false | null | undefined)[]): string {
  return twMerge(classes.filter((value): value is string => Boolean(value)).join(' '));
}
