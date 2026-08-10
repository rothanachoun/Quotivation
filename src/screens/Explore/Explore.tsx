import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import categoryGroupsData from '@/assets/db/categories.json';
import {
  getQuoteCategories,
  type QuoteCategory,
} from '@/database/quotes';
import { useFollowedCategories } from '@/hooks/useFollowedCategories';
import { colors } from '@/theme/colors';

type CategoryDefinition = {
  id: string;
  name: string;
};

type CategoryGroup = {
  categories: CategoryDefinition[];
  id: string;
  name: string;
};

type CategoryListItem = CategoryDefinition & {
  quoteCount: number;
};

const CATEGORY_GROUPS = categoryGroupsData as CategoryGroup[];

function Explore() {
  const insets = useSafeAreaInsets();
  const {
    followedCategoryNames,
    isFollowingCategory,
    toggleFollowedCategory,
  } = useFollowedCategories();
  const [categories, setCategories] = useState<QuoteCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    getQuoteCategories()
      .then(result => {
        if (!cancelled) {
          setCategories(result);
        }
      })
      .catch(loadError => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load categories',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const quoteCounts = new Map(
      categories.map(category => [category.id, category.quoteCount]),
    );

    return CATEGORY_GROUPS.map(group => {
      const groupMatches = group.name
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const data: CategoryListItem[] = group.categories
        .filter(
          category =>
            groupMatches ||
            category.name.toLocaleLowerCase().includes(normalizedQuery),
        )
        .map(category => ({
          ...category,
          quoteCount: quoteCounts.get(category.id) ?? 0,
        }))
        .sort((left, right) => {
          const leftIsFollowed = followedCategoryNames.has(left.id);
          const rightIsFollowed = followedCategoryNames.has(right.id);

          if (leftIsFollowed !== rightIsFollowed) {
            return leftIsFollowed ? -1 : 1;
          }

          return left.name.localeCompare(right.name);
        });

      return {
        data,
        id: group.id,
        title: group.name,
      };
    }).filter(section => section.data.length > 0);
  }, [categories, followedCategoryNames, searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>
          Follow categories to personalize your quotes.
        </Text>

        <TextInput
          accessibilityLabel="Search categories"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardAppearance="dark"
          onChangeText={setSearchQuery}
          placeholder="Search categories"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.centeredState} />
      ) : error ? (
        <Text style={styles.centeredStateText}>{error}</Text>
      ) : (
        <SectionList
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyExtractor={category => category.id}
          ListEmptyComponent={
            <Text style={styles.centeredStateText}>No categories found.</Text>
          }
          renderItem={({ item }) => {
            const isFollowing = isFollowingCategory(item.id);

            return (
              <View style={styles.categoryRow}>
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.quoteCount}>
                    {item.quoteCount}{' '}
                    {item.quoteCount === 1 ? 'quote' : 'quotes'}
                  </Text>
                </View>

                <Pressable
                  accessibilityLabel={`${
                    isFollowing ? 'Unfollow' : 'Follow'
                  } ${item.name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isFollowing }}
                  onPress={() => toggleFollowedCategory(item.id)}
                  style={({ pressed }) => [
                    styles.followButton,
                    isFollowing && styles.followingButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.followButtonText,
                      isFollowing && styles.followingButtonText,
                    ]}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              </View>
            );
          }}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          sections={visibleSections}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryDetails: {
    flex: 1,
    gap: 4,
  },
  categoryName: {
    color: colors.textPrimary,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 17,
  },
  categoryRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 16,
    minHeight: 76,
    paddingVertical: 12,
  },
  centeredState: {
    marginTop: 48,
  },
  centeredStateText: {
    color: colors.textSecondary,
    marginTop: 48,
    textAlign: 'center',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 92,
    paddingHorizontal: 16,
  },
  followButtonText: {
    color: colors.accentText,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
  },
  followingButton: {
    backgroundColor: 'transparent',
  },
  followingButtonText: {
    color: colors.accent,
  },
  header: {
    gap: 8,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  pressedButton: {
    opacity: 0.65,
  },
  quoteCount: {
    color: colors.textSecondary,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    color: colors.textPrimary,
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingBottom: 6,
    paddingTop: 26,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    lineHeight: 38,
  },
});

export default Explore;
