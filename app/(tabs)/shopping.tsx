import { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  Share,
  Platform,
  Pressable,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import { Text } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useShoppingStore,
  CATEGORY_ICONS,
  CATEGORY_ORDER,
  type ShoppingItem,
  type SortOption,
  type FilterOption,
} from '@/stores/shoppingStore';
import { AddItemModal } from '@/components/shopping/AddItemModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { INGREDIENT_CATEGORIES } from '@/utils/types';

// Recipe badge colors for visual variety
const RECIPE_COLORS = [
  { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.2)' },
  { bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316', border: 'rgba(249, 115, 22, 0.2)' },
  { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E', border: 'rgba(34, 197, 94, 0.2)' },
  { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.2)' },
  { bg: 'rgba(236, 72, 153, 0.1)', text: '#EC4899', border: 'rgba(236, 72, 153, 0.2)' },
];

const getRecipeColor = (recipeName: string) => {
  if (!recipeName) return null;
  const index = recipeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return RECIPE_COLORS[index % RECIPE_COLORS.length];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

type SectionData = {
  title: string;
  category: string;
  icon: string;
  data: ShoppingItem[];
  itemCount?: number; // Used to preserve original count when collapsed
};

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  const {
    items,
    activeListId,
    lists,
    sortBy,
    filterBy,
    toggleItem,
    removeItem,
    updateItem,
    addItem,
    clearChecked,
    setSortBy,
    setFilterBy,
    getFilteredItems,
    getProgress,
    getTotalPrice,
  } = useShoppingStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const [showCheckedItems, setShowCheckedItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  // Get filtered items
  const allFilteredItems = useMemo(() => {
    return getFilteredItems();
  }, [items, sortBy, filterBy, getFilteredItems]);

  // Separate checked and unchecked items
  const uncheckedItems = useMemo(() => allFilteredItems.filter(i => !i.is_checked), [allFilteredItems]);
  const checkedItems = useMemo(() => allFilteredItems.filter(i => i.is_checked), [allFilteredItems]);

  // Group unchecked items by category or recipe
  const sections = useMemo((): SectionData[] => {
    if (sortBy === 'recipe') {
      const grouped: Record<string, ShoppingItem[]> = {};
      uncheckedItems.forEach((item) => {
        const key = item.recipe_name || 'Other Items';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });
      return Object.entries(grouped).map(([title, data]) => ({
        title,
        category: 'recipe',
        icon: 'restaurant-outline',
        data,
      }));
    }

    // Default: group by category
    const grouped: Record<string, ShoppingItem[]> = {};
    uncheckedItems.forEach((item) => {
      const cat = item.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    return CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0).map((cat) => ({
      title: INGREDIENT_CATEGORIES[cat as keyof typeof INGREDIENT_CATEGORIES] || cat,
      category: cat,
      icon: CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || 'ellipse-outline',
      data: grouped[cat],
    }));
  }, [uncheckedItems, sortBy]);

  // Filter items in collapsed sections for display
  const displaySections = useMemo(() => {
    if (sortBy !== 'recipe') return sections;

    return sections.map(section => ({
      ...section,
      data: collapsedSections.has(section.title) ? [] : section.data,
      itemCount: section.data.length, // Preserve original count for header display
    }));
  }, [sections, collapsedSections, sortBy]);

  const { checked, total, percentage } = getProgress();

  // Count recipes
  const recipeCount = useMemo(() => {
    const recipes = new Set(items.filter(i => i.recipe_name).map(i => i.recipe_name));
    return recipes.size;
  }, [items]);

  // Quick add handler
  const handleQuickAdd = () => {
    if (!quickAddText.trim()) return;
    addItem({ name: quickAddText.trim(), category: 'other' });
    setQuickAddText('');
  };

  // Swipe actions
  const renderRightActions = useCallback(
    (item: ShoppingItem, progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [120, 0],
      });

      // Show "Release to delete" when past threshold
      const deleteScale = dragX.interpolate({
        inputRange: [-SWIPE_THRESHOLD - 50, -SWIPE_THRESHOLD, -60, 0],
        outputRange: [1.1, 1, 0.8, 0.8],
        extrapolate: 'clamp',
      });

      const deleteOpacity = dragX.interpolate({
        inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD + 20, 0],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp',
      });

      return (
        <View style={styles.swipeActionsContainer}>
          {/* Full swipe delete background */}
          <Animated.View style={[styles.swipeDeleteFull, { opacity: deleteOpacity }]}>
            <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
              <Ionicons name="trash" size={24} color="#FFF" />
              <Text style={styles.swipeDeleteText}>Release</Text>
            </Animated.View>
          </Animated.View>

          {/* Regular swipe actions */}
          <Animated.View style={[styles.swipeActions, { transform: [{ translateX }] }]}>
            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeUrgent]}
              onPress={() => {
                swipeableRefs.current.get(item.id)?.close();
                updateItem(item.id, { is_urgent: !item.is_urgent });
              }}
            >
              <Ionicons
                name={item.is_urgent ? 'flag' : 'flag-outline'}
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeDelete]}
              onPress={() => {
                swipeableRefs.current.get(item.id)?.close();
                removeItem(item.id);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    },
    [updateItem, removeItem]
  );

  const handleShare = async () => {
    const unchecked = items.filter((i) => !i.is_checked);
    const grouped: Record<string, ShoppingItem[]> = {};

    unchecked.forEach((item) => {
      const cat =
        INGREDIENT_CATEGORIES[item.category as keyof typeof INGREDIENT_CATEGORIES] ||
        item.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let text = '🛒 Shopping List\n\n';
    Object.entries(grouped).forEach(([category, categoryItems]) => {
      text += `📦 ${category}\n`;
      categoryItems.forEach((item) => {
        const amount = item.amount ? `${item.amount}${item.unit ? ' ' + item.unit : ''}` : '';
        text += `  ○ ${item.name}${amount ? ' - ' + amount : ''}\n`;
      });
      text += '\n';
    });

    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const renderItem = useCallback(
    ({ item, index, section }: { item: ShoppingItem; index: number; section: SectionData }) => {
      const isFirst = index === 0;
      const isLast = index === section.data.length - 1;
      const recipeColor = item.recipe_name ? getRecipeColor(item.recipe_name) : null;

      return (
        <Swipeable
          ref={(ref) => {
            if (ref) swipeableRefs.current.set(item.id, ref);
          }}
          renderRightActions={(progress, dragX) => renderRightActions(item, progress, dragX)}
          overshootRight={true}
          friction={2}
          rightThreshold={SWIPE_THRESHOLD}
          onSwipeableOpen={(direction) => {
            if (direction === 'right') {
              removeItem(item.id);
            }
          }}
          containerStyle={[
            isFirst && styles.itemCardFirst,
            isLast && styles.itemCardLast,
            section.data.length === 1 && styles.itemCardSingle,
          ]}
        >
          <Pressable
            onPress={() => toggleItem(item.id)}
            style={[
              styles.item,
              section.data.length === 1 && styles.itemSingle,
              section.data.length > 1 && isFirst && styles.itemFirst,
              section.data.length > 1 && isLast && styles.itemLast,
              section.data.length > 1 && !isFirst && !isLast && styles.itemMiddle,
              !isLast && styles.itemBorder,
              item.is_urgent && styles.itemUrgent,
            ]}
          >
            {/* Circular Checkbox */}
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                item.is_checked && styles.checkboxChecked,
              ]}>
                {item.is_checked && (
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                )}
              </View>
            </View>

            {/* Item Content */}
            <View style={styles.itemContent}>
              <Text
                style={[
                  styles.itemName,
                  item.is_checked && styles.itemNameChecked,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <View style={styles.itemMeta}>
                {item.amount && (
                  <Text style={styles.itemAmount}>
                    {item.amount}{item.unit ? ` ${item.unit}` : ''}
                  </Text>
                )}

                {sortBy !== 'recipe' && item.amount && item.recipe_name && (
                  <View style={styles.dotSeparator} />
                )}

                {sortBy !== 'recipe' && item.recipe_name && recipeColor && (
                  <View style={[
                    styles.recipeBadge,
                    { backgroundColor: recipeColor.bg, borderColor: recipeColor.border }
                  ]}>
                    <Text style={[styles.recipeBadgeText, { color: recipeColor.text }]} numberOfLines={1}>
                      {item.recipe_name}
                    </Text>
                  </View>
                )}

                {item.is_urgent && (
                  <>
                    {(item.amount || (sortBy !== 'recipe' && item.recipe_name)) && <View style={styles.dotSeparator} />}
                    <Ionicons name="alert-circle" size={12} color="#F2330D" />
                  </>
                )}
              </View>
            </View>
          </Pressable>
        </Swipeable>
      );
    },
    [toggleItem, renderRightActions, sortBy]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData }) => {
      const isRecipeView = sortBy === 'recipe';
      const isCollapsed = collapsedSections.has(section.title);
      const itemCount = section.itemCount ?? section.data.length;

      const content = (
        <>
          <View style={styles.sectionLeft}>
            {isRecipeView && (
              <Ionicons
                name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
                size={18}
                color="#9C5749"
              />
            )}
            <Ionicons name={section.icon as any} size={20} color="#F2330D" />
            <Text style={styles.sectionTitle} numberOfLines={1}>{section.title}</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionCount}>{itemCount} items</Text>
          </View>
        </>
      );

      if (isRecipeView) {
        return (
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(section.title)}
            activeOpacity={0.7}
          >
            {content}
          </TouchableOpacity>
        );
      }

      return <View style={styles.sectionHeader}>{content}</View>;
    },
    [sortBy, collapsedSections, toggleSection]
  );

  // Sort options as pills
  const sortPills: { key: SortOption; label: string }[] = [
    { key: 'category', label: 'By Aisle' },
    { key: 'recipe', label: 'By Recipe' },
    { key: 'recent', label: 'Recent' },
  ];

  if (items.length === 0) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View>
            <Text style={styles.headerTitle}>Shopping List</Text>
            <Text style={styles.headerSubtitle}>No items yet</Text>
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle" size={28} color="#F2330D" />
          </TouchableOpacity>
        </View>

        <EmptyState
          icon="cart-outline"
          title="Your shopping list is empty"
          subtitle="Add items manually or import ingredients from your recipes"
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={26} color="#FFF" />
        </TouchableOpacity>

        <AddItemModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <Text style={styles.headerSubtitle}>
            {total} items{recipeCount > 0 ? ` • ${recipeCount} recipes` : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleShare}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#F2330D" />
        </TouchableOpacity>
      </View>

      {/* Quick Add Input */}
      <View style={styles.quickAddContainer}>
        <View style={styles.quickAddInput}>
          <Ionicons name="add" size={20} color="#9C5749" style={styles.quickAddIcon} />
          <TextInput
            style={styles.quickAddTextInput}
            placeholder="Add item (e.g., Milk, Eggs)..."
            placeholderTextColor="#9C5749"
            value={quickAddText}
            onChangeText={setQuickAddText}
            onSubmitEditing={handleQuickAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="options-outline" size={18} color="#F2330D" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Pills */}
      <View style={styles.pillsContainer}>
        {sortPills.map((pill) => (
          <TouchableOpacity
            key={pill.key}
            style={[
              styles.pill,
              sortBy === pill.key && styles.pillActive,
            ]}
            onPress={() => setSortBy(pill.key)}
          >
            <Text style={[
              styles.pillText,
              sortBy === pill.key && styles.pillTextActive,
            ]}>
              {pill.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <SectionList
        sections={displaySections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <>
            {/* Checked Items Section */}
            {checkedItems.length > 0 && (
              <View style={styles.checkedSection}>
                <TouchableOpacity
                  style={styles.checkedHeader}
                  onPress={() => setShowCheckedItems(!showCheckedItems)}
                >
                  <Text style={styles.checkedTitle}>
                    Checked Items ({checkedItems.length})
                  </Text>
                  <Ionicons
                    name={showCheckedItems ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#9C5749"
                  />
                </TouchableOpacity>

                {showCheckedItems && (
                  <View style={styles.checkedList}>
                    {checkedItems.map((item, index) => (
                      <Pressable
                        key={item.id}
                        onPress={() => toggleItem(item.id)}
                        style={[
                          styles.checkedItem,
                          index !== checkedItems.length - 1 && styles.itemBorder,
                        ]}
                      >
                        <View style={[styles.checkbox, styles.checkboxChecked]}>
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        </View>
                        <Text style={styles.checkedItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </Pressable>
                    ))}

                    <TouchableOpacity
                      style={styles.clearCheckedButton}
                      onPress={() => {
                        Alert.alert(
                          'Clear Checked Items',
                          `Remove ${checkedItems.length} checked items?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Clear', style: 'destructive', onPress: clearChecked },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#F2330D" />
                      <Text style={styles.clearCheckedText}>Clear all checked</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="cart" size={26} color="#FFF" />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <AddItemModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F8F6F5',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1C100D',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
    color: '#9C5749',
    marginTop: 2,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAddContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickAddInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8D3CE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAddIcon: {
    marginRight: 8,
  },
  quickAddTextInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
    color: '#1C100D',
  },
  quickAddButton: {
    padding: 8,
    marginLeft: 4,
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D3CE',
  },
  pillActive: {
    backgroundColor: '#F2330D',
    borderColor: '#F2330D',
    shadowColor: '#F2330D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9C5749',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontFamily: 'NotoSans_700Bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1C100D',
  },
  sectionBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D3CE',
  },
  sectionCount: {
    fontSize: 11,
    fontFamily: 'NotoSans_500Medium',
    color: '#9C5749',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  itemCardFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  itemCardLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  itemCardSingle: {
    borderRadius: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  itemFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
  },
  itemLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
  },
  itemMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
  },
  itemSingle: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 211, 206, 0.5)',
  },
  itemUrgent: {
    backgroundColor: 'rgba(242, 51, 13, 0.03)',
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D3CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#F2330D',
    borderColor: '#F2330D',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'NotoSans_500Medium',
    color: '#1C100D',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9C5749',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  itemAmount: {
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9C5749',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8D3CE',
  },
  recipeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    maxWidth: 140,
  },
  recipeBadgeText: {
    fontSize: 10,
    fontFamily: 'NotoSans_500Medium',
  },
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  swipeDeleteFull: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: SCREEN_WIDTH * 0.6,
  },
  swipeDeleteText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
    marginTop: 4,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  swipeUrgent: {
    backgroundColor: '#F59E0B',
  },
  swipeDelete: {
    backgroundColor: '#EF4444',
  },
  checkedSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  checkedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  checkedTitle: {
    fontSize: 14,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9C5749',
  },
  checkedList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 206, 0.5)',
    overflow: 'hidden',
  },
  checkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  checkedItemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
    color: '#9C5749',
    textDecorationLine: 'line-through',
  },
  clearCheckedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 211, 206, 0.5)',
  },
  clearCheckedText: {
    fontSize: 13,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#F2330D',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2330D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F2330D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
