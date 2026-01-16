import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore } from '@/stores/recipeStore';

/**
 * Translucent header background with frosted glass effect
 */
export function TranslucentHeaderBackground() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={90}
      tint="light"
      style={[
        styles.headerBackground,
        { height: 44 + insets.top },
      ]}
    >
      <View style={styles.headerBackgroundOverlay} />
    </BlurView>
  );
}

/**
 * Pill-shaped back button with chevron and text
 */
export function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => router.back()}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
      <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      <Text style={styles.backButtonText}>Back</Text>
    </Pressable>
  );
}

/**
 * Circular share button
 */
function ShareButton() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { getRecipe } = useRecipeStore();
  const recipe = useRecipeStore((state) =>
    state.recipes.find((r) => r.id === id) ||
    (state.currentRecipe?.id === id ? state.currentRecipe : undefined)
  );

  useEffect(() => {
    if (id && !recipe) {
      getRecipe(id);
    }
  }, [id, recipe, getRecipe]);

  const handleShare = async () => {
    if (!recipe || isLoading) return;
    try {
      setIsLoading(true);
      const message = recipe.source_url
        ? `Check out this recipe: ${recipe.title}\n\n${recipe.source_url}`
        : `Check out this recipe: ${recipe.title}`;
      await Share.share({ message, title: recipe.title });
    } catch (error) {
      console.error(error);
      Alert.alert('Share failed', 'Unable to share this recipe right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleShare}
      disabled={isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
      <Ionicons name="share-outline" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

/**
 * Circular favorite button with toggle state
 */
function FavoriteButton() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, getRecipe } = useRecipeStore();
  const recipe = useRecipeStore((state) =>
    state.recipes.find((r) => r.id === id) ||
    (state.currentRecipe?.id === id ? state.currentRecipe : undefined)
  );

  useEffect(() => {
    if (id && !recipe) {
      getRecipe(id);
    }
  }, [id, recipe, getRecipe]);

  const handleToggleFavorite = async () => {
    if (!recipe || isLoading) return;
    try {
      setIsLoading(true);
      await toggleFavorite(recipe.id);
    } catch (error) {
      console.error(error);
      Alert.alert('Update failed', 'Unable to update favorite right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = recipe?.is_favorite ?? false;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        isFavorite && styles.actionButtonActive,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleToggleFavorite}
      disabled={isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
        color={isFavorite ? '#F2330D' : '#FFFFFF'}
      />
    </Pressable>
  );
}

/**
 * Circular delete button with confirmation
 */
function DeleteButton() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteRecipe, getRecipe } = useRecipeStore();
  const recipe = useRecipeStore((state) =>
    state.recipes.find((r) => r.id === id) ||
    (state.currentRecipe?.id === id ? state.currentRecipe : undefined)
  );

  useEffect(() => {
    if (id && !recipe) {
      getRecipe(id);
    }
  }, [id, recipe, getRecipe]);

  const handleDelete = () => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!recipe || isLoading) return;
          try {
            setIsLoading(true);
            await deleteRecipe(recipe.id);
            router.back();
          } catch (error) {
            console.error(error);
            Alert.alert('Delete failed', 'Unable to delete this recipe right now.');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleDelete}
      disabled={isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
      <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

/**
 * Container for header right action buttons
 */
export function RecipeHeaderRight() {
  return (
    <View style={styles.headerRight}>
      <ShareButton />
      <FavoriteButton />
      <DeleteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(242, 51, 13, 0.9)',
    borderColor: 'rgba(242, 51, 13, 0.95)',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
