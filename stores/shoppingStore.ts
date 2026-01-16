import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShoppingItem, Ingredient, IngredientCategory } from '@/utils/types';

interface ShoppingState {
  items: ShoppingItem[];
  isLoading: boolean;

  addItem: (item: Partial<ShoppingItem>) => void;
  addItemsFromRecipe: (recipeId: string, ingredients: Ingredient[]) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  clearChecked: () => void;
  clearAll: () => void;
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item: Partial<ShoppingItem>) => {
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          list_id: 'default',
          name: item.name || '',
          amount: item.amount,
          unit: item.unit,
          category: item.category || 'other',
          is_checked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      addItemsFromRecipe: (recipeId: string, ingredients: Ingredient[]) => {
        const existingNames = get().items.map((i) => i.name.toLowerCase());

        const newItems: ShoppingItem[] = ingredients
          .filter((ing) => !existingNames.includes(ing.name.toLowerCase()))
          .map((ing) => ({
            id: `${recipeId}-${Date.now()}-${Math.random()}`,
            list_id: 'default',
            recipe_id: recipeId,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category,
            is_checked: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

        set((state) => ({
          items: [...state.items, ...newItems],
        }));
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, is_checked: !item.is_checked }
              : item
          ),
        }));
      },

      updateItem: (id: string, updates: Partial<ShoppingItem>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updated_at: new Date().toISOString() }
              : item
          ),
        }));
      },

      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.is_checked),
        }));
      },

      clearAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'shopping-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
