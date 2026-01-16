import { useState } from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { Text, CheckBox, Button, FAB } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useShoppingStore } from '@/stores/shoppingStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { INGREDIENT_CATEGORIES } from '@/utils/types';

export default function ShoppingScreen() {
  const { items, toggleItem, clearChecked, addItem } = useShoppingStore();

  const groupedItems = items.reduce((acc: any, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedItems)
    .sort()
    .map((category) => ({
      title: INGREDIENT_CATEGORIES[category as keyof typeof INGREDIENT_CATEGORIES] || category,
      data: groupedItems[category],
    }));

  const checkedCount = items.filter((i) => i.is_checked).length;

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Shopping list empty"
          subtitle="Add ingredients from your recipes to start your shopping list"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Shopping List</Text>
        <Text style={styles.subtitle}>
          {checkedCount} of {items.length} items checked
        </Text>
        {checkedCount > 0 && (
          <Button
            title="Clear Checked"
            type="clear"
            titleStyle={styles.clearButton}
            onPress={clearChecked}
          />
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <CheckBox
              checked={item.is_checked}
              onPress={() => toggleItem(item.id)}
              containerStyle={styles.checkbox}
              checkedColor="#F2330D"
            />
            <View style={styles.itemContent}>
              <Text
                style={[
                  styles.itemName,
                  item.is_checked && styles.itemChecked,
                ]}
              >
                {item.name}
              </Text>
              {item.amount && (
                <Text style={styles.itemAmount}>
                  {item.amount} {item.unit || ''}
                </Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon={<Ionicons name="add" size={24} color="#FFF" />}
        color="#F2330D"
        placement="right"
        onPress={() => {
          // TODO: Open add item modal
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F5',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#1C100D',
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
  },
  subtitle: {
    color: '#9C5749',
    fontFamily: 'NotoSans_500Medium',
    fontSize: 13,
    marginTop: 6,
  },
  clearButton: {
    color: '#F2330D',
    fontSize: 13,
    fontFamily: 'NotoSans_600SemiBold',
  },
  list: {
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9C5749',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D3CE',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 8,
    margin: 0,
  },
  itemContent: {
    flex: 1,
    paddingVertical: 12,
  },
  itemName: {
    fontSize: 16,
    color: '#1C100D',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  itemChecked: {
    textDecorationLine: 'line-through',
    color: '#C8B7B2',
  },
  itemAmount: {
    fontSize: 13,
    color: '#9C5749',
    marginTop: 2,
    fontFamily: 'NotoSans_500Medium',
  },
});
