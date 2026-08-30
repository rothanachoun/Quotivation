import type { QuoteIconName } from '@/components/icons';

import type { QuotationId } from './types';

export type QuotationPreset = {
  alignment: 'center' | 'left';
  icon: QuoteIconName;
  placement: 'background' | 'bottom' | 'top';
  size: number;
};

export const QUOTATION_PRESETS: Record<QuotationId, QuotationPreset> = {
  1: {
    alignment: 'center',
    icon: 'quote-1',
    placement: 'top',
    size: 38,
  },
  2: {
    alignment: 'center',
    icon: 'quote-2',
    placement: 'top',
    size: 38,
  },
  3: {
    alignment: 'center',
    icon: 'quote-3',
    placement: 'top',
    size: 38,
  },
  4: {
    alignment: 'center',
    icon: 'quote-4',
    placement: 'top',
    size: 38,
  },
};

export function resolveQuotationId(value: number | null): QuotationId {
  return value && value in QUOTATION_PRESETS ? (value as QuotationId) : 1;
}
