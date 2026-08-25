import type { QuoteIconName } from '@/components/icons';

import type { DecorationName } from './types';

export type DecorationPreset = {
  alignment: 'center' | 'left';
  icon: QuoteIconName;
  placement: 'background' | 'bottom' | 'top';
  size: number;
};

export const DECORATION_PRESETS: Record<DecorationName, DecorationPreset> = {
  block: {
    alignment: 'center',
    icon: 'quote-1',
    placement: 'top',
    size: 38,
  },
  classic: {
    alignment: 'center',
    icon: 'quote-2',
    placement: 'top',
    size: 38,
  },
  compact: {
    alignment: 'center',
    icon: 'quote-3',
    placement: 'top',
    size: 38,
  },
  soft: {
    alignment: 'center',
    icon: 'quote-4',
    placement: 'top',
    size: 38,
  },
  round: {
    alignment: 'center',
    icon: 'quote-5',
    placement: 'top',
    size: 38,
  },
};

export function resolveDecorationName(value: string | null): DecorationName {
  return value && value in DECORATION_PRESETS
    ? (value as DecorationName)
    : 'soft';
}
