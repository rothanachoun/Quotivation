import { personalizationKeys } from '@/storage/personalizationStorage';

import { useStoredStringSet } from './useStoredStringSet';

export function useFollowedCategories() {
  const followedCategories = useStoredStringSet(
    personalizationKeys.followedCategories,
  );

  return {
    followCategory: followedCategories.add,
    followedCategoryNames: followedCategories.values,
    isFollowingCategory: followedCategories.contains,
    toggleFollowedCategory: followedCategories.toggle,
    unfollowCategory: followedCategories.remove,
  };
}
