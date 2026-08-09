import { useCallback, useMemo } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { personalizationStorage } from '@/storage/personalizationStorage';

type StoredStringSet = {
  add: (value: string) => void;
  contains: (value: string) => boolean;
  remove: (value: string) => void;
  toggle: (value: string) => void;
  values: ReadonlySet<string>;
};

function parseValues(value: string | undefined): Set<string> {
  if (!value) {
    return new Set();
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed)
      ? new Set(parsed.filter(item => typeof item === 'string'))
      : new Set();
  } catch {
    return new Set();
  }
}

export function useStoredStringSet(key: string): StoredStringSet {
  const [storedValue, setStoredValue] = useMMKVString(
    key,
    personalizationStorage,
  );
  const values = useMemo(() => parseValues(storedValue), [storedValue]);

  const update = useCallback(
    (value: string, operation: 'add' | 'remove' | 'toggle') => {
      setStoredValue(currentValue => {
        const nextValues = parseValues(currentValue);

        if (
          operation === 'remove' ||
          (operation === 'toggle' && nextValues.has(value))
        ) {
          nextValues.delete(value);
        } else {
          nextValues.add(value);
        }

        return JSON.stringify([...nextValues]);
      });
    },
    [setStoredValue],
  );

  return {
    add: useCallback(value => update(value, 'add'), [update]),
    contains: useCallback(value => values.has(value), [values]),
    remove: useCallback(value => update(value, 'remove'), [update]),
    toggle: useCallback(value => update(value, 'toggle'), [update]),
    values,
  };
}
