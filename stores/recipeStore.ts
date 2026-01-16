import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from '@/services/supabase.service';
import { youtubeService, getYouTubeThumbnail } from '@/services/youtube.service';
import { socialService } from '@/services/social.service';
import type { Recipe, ExtractedRecipe, RecipeSourceType } from '@/utils/types';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;

  fetchRecipes: () => Promise<void>;
  getRecipe: (id: string) => Promise<Recipe | null>;
  addRecipe: (recipe: ExtractedRecipe, sourceUrl?: string) => Promise<Recipe>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],
      currentRecipe: null,
      isLoading: false,
      error: null,

      fetchRecipes: async () => {
        try {
          set({ isLoading: true, error: null });
          const recipes = await supabaseService.getRecipes();
          set({ recipes, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch recipes',
            isLoading: false,
          });
        }
      },

      getRecipe: async (id: string) => {
        try {
          const cached = get().recipes.find((r) => r.id === id);
          if (cached) {
            set({ currentRecipe: cached });
            return cached;
          }

          const recipe = await supabaseService.getRecipe(id);
          if (recipe) {
            set({ currentRecipe: recipe });
          }
          return recipe;
        } catch (error) {
          console.error('Get recipe error:', error);
          return null;
        }
      },

      addRecipe: async (extractedRecipe: ExtractedRecipe, sourceUrl?: string) => {
        try {
          set({ isLoading: true, error: null });

          // Detect platform and extract video ID and thumbnail
          let thumbnailUrl: string | undefined;
          let videoId: string | undefined;
          let sourceType: RecipeSourceType = 'manual';

          if (sourceUrl) {
            const platform = socialService.detectPlatform(sourceUrl);
            sourceType = socialService.getSourceType(platform);

            // Get video metadata for thumbnail and ID
            const metadata = await socialService.getVideoMetadata(sourceUrl);
            if (metadata) {
              videoId = metadata.videoId;
              thumbnailUrl = metadata.thumbnailUrl;
            }

            // Fallback for YouTube thumbnails if metadata fetch failed
            if (!thumbnailUrl && platform === 'youtube') {
              const ytVideoId = youtubeService.extractVideoId(sourceUrl);
              if (ytVideoId) {
                videoId = ytVideoId;
                thumbnailUrl = getYouTubeThumbnail(ytVideoId, 'high');
              }
            }
          }

          // Map ExtractedRecipe to database schema
          const recipeData: Partial<Recipe> = {
            title: extractedRecipe.title,
            description: extractedRecipe.description,
            cuisine_type: extractedRecipe.cuisine_type,
            difficulty: extractedRecipe.difficulty,
            prep_time_minutes: extractedRecipe.prep_time_minutes,
            cook_time_minutes: extractedRecipe.cook_time_minutes,
            total_time_minutes: extractedRecipe.total_time_minutes,
            active_time_minutes: extractedRecipe.active_time_minutes,
            original_servings: extractedRecipe.servings,
            current_servings: extractedRecipe.servings,
            ingredients: extractedRecipe.ingredients,
            steps: extractedRecipe.steps,
            tools: extractedRecipe.tools,
            source_url: sourceUrl,
            source_type: sourceType,
            thumbnail_url: thumbnailUrl,
            video_id: videoId,
            // Flatten nutrition_estimate to individual columns
            calories: extractedRecipe.nutrition_estimate?.calories,
            protein_g: extractedRecipe.nutrition_estimate?.protein_g,
            carbs_g: extractedRecipe.nutrition_estimate?.carbs_g,
            fat_g: extractedRecipe.nutrition_estimate?.fat_g,
          };

          const recipe = await supabaseService.createRecipe(recipeData);

          set((state) => ({
            recipes: [recipe, ...state.recipes],
            isLoading: false,
          }));

          return recipe;
        } catch (error: any) {
          set({
            error: error.message || 'Failed to add recipe',
            isLoading: false,
          });
          throw error;
        }
      },

      updateRecipe: async (id: string, updates: Partial<Recipe>) => {
        try {
          await supabaseService.updateRecipe(id, updates);

          set((state) => ({
            recipes: state.recipes.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
            currentRecipe:
              state.currentRecipe?.id === id
                ? { ...state.currentRecipe, ...updates }
                : state.currentRecipe,
          }));
        } catch (error) {
          console.error('Update recipe error:', error);
          throw error;
        }
      },

      deleteRecipe: async (id: string) => {
        try {
          await supabaseService.deleteRecipe(id);

          set((state) => ({
            recipes: state.recipes.filter((r) => r.id !== id),
            currentRecipe:
              state.currentRecipe?.id === id ? null : state.currentRecipe,
          }));
        } catch (error) {
          console.error('Delete recipe error:', error);
          throw error;
        }
      },

      toggleFavorite: async (id: string) => {
        const recipe = get().recipes.find((r) => r.id === id);
        if (recipe) {
          await get().updateRecipe(id, { is_favorite: !recipe.is_favorite });
        }
      },

      setCurrentRecipe: (recipe: Recipe | null) => {
        set({ currentRecipe: recipe });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recipes: state.recipes,
      }),
    }
  )
);
