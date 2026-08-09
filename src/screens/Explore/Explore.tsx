import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getQuoteCategories,
  type QuoteCategory,
} from '@/database/quotes';
import { useFollowedCategories } from '@/hooks/useFollowedCategories';

function formatCategoryName(name: string): string {
  return name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

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

  const visibleCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return categories
      .filter(category =>
        category.name.toLocaleLowerCase().includes(normalizedQuery),
      )
      .sort((left, right) => {
        const leftIsFollowed = followedCategoryNames.has(left.name);
        const rightIsFollowed = followedCategoryNames.has(right.name);

        if (leftIsFollowed !== rightIsFollowed) {
          return leftIsFollowed ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      });
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
          onChangeText={setSearchQuery}
          placeholder="Search categories"
          placeholderTextColor="#777777"
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
        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleCategories}
          keyboardShouldPersistTaps="handled"
          keyExtractor={category => category.name}
          ListEmptyComponent={
            <Text style={styles.centeredStateText}>No categories found.</Text>
          }
          renderItem={({ item }) => {
            const isFollowing = isFollowingCategory(item.name);
            const displayName = formatCategoryName(item.name);

            return (
              <View style={styles.categoryRow}>
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryName}>{displayName}</Text>
                  <Text style={styles.quoteCount}>
                    {item.quoteCount}{' '}
                    {item.quoteCount === 1 ? 'quote' : 'quotes'}
                  </Text>
                </View>

                <Pressable
                  accessibilityLabel={`${
                    isFollowing ? 'Unfollow' : 'Follow'
                  } ${displayName}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isFollowing }}
                  onPress={() => toggleFollowedCategory(item.name)}
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
          showsVerticalScrollIndicator={false}
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
    color: '#171717',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 17,
  },
  categoryRow: {
    alignItems: 'center',
    borderBottomColor: '#E8E8E8',
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
    color: '#707070',
    marginTop: 48,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: '#171717',
    borderColor: '#171717',
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 92,
    paddingHorizontal: 16,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
  },
  followingButton: {
    backgroundColor: 'transparent',
  },
  followingButtonText: {
    color: '#171717',
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
    color: '#707070',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    color: '#171717',
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  subtitle: {
    color: '#666666',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    color: '#111111',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    lineHeight: 38,
  },
});

export default Explore;
