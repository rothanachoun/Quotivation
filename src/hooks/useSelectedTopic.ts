import { useMMKVString } from 'react-native-mmkv';

import {
  personalizationKeys,
  personalizationStorage,
} from '@/storage/personalizationStorage';

export function useSelectedTopic() {
  const [selectedTopicId, setSelectedTopicId] = useMMKVString(
    personalizationKeys.selectedTopicId,
    personalizationStorage,
  );

  return {
    clearSelectedTopic: () => setSelectedTopicId(undefined),
    selectedTopicId,
    selectTopic: setSelectedTopicId,
  };
}
