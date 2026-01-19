import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Animated,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Text } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecipeLoadingAnimation } from '@/components/RecipeLoadingAnimation';
import { aiService } from '@/services/ai.service';
import { useAuthStore } from '@/stores/authStore';
import type { SuggestedRecipe, RecipeDifficulty } from '@/utils/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#F2330D',
  olive: '#606C38',
  oliveDark: '#283618',
  oliveLight: '#DDE5B6',
  backgroundLight: '#FCFAF9',
  backgroundDark: '#1A1210',
  cardLight: '#FFFFFF',
  cardDark: '#2A1D1A',
};

interface Ingredient {
  name: string;
  emoji: string;
  selected: boolean;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  matchPercentage: number;
  time: string;
  difficulty: string;
  description?: string;
  matchedIngredients?: string;
  missingIngredients?: string;
  featured?: boolean;
}

// Placeholder images for AI-suggested recipes
const RECIPE_PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
];

// Map AI SuggestedRecipe to UI Recipe format
function mapSuggestedRecipeToUI(recipe: SuggestedRecipe, index: number): Recipe {
  const difficultyMap: Record<RecipeDifficulty, string> = {
    beginner: 'Easy',
    intermediate: 'Medium',
    advanced: 'Hard',
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return {
    id: `ai-${index + 1}`,
    title: recipe.title,
    image: RECIPE_PLACEHOLDER_IMAGES[index % RECIPE_PLACEHOLDER_IMAGES.length],
    matchPercentage: recipe.match_score ?? 80,
    time: formatTime(recipe.total_time_minutes),
    difficulty: difficultyMap[recipe.difficulty] || 'Easy',
    description: recipe.description,
    matchedIngredients: recipe.ingredients_you_have?.join(', ') ?? '',
    missingIngredients: recipe.ingredients_you_need && recipe.ingredients_you_need.length > 0
      ? recipe.ingredients_you_need.join(', ')
      : undefined,
    featured: index === 0,
  };
}

function IngredientChip({
  ingredient,
  onToggle,
  isDark,
}: {
  ingredient: Ingredient;
  onToggle: () => void;
  isDark: boolean;
}) {
  const isSelected = ingredient.selected;

  return (
    <Pressable
      style={[
        styles.chip,
        isSelected
          ? styles.chipSelected
          : {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
              borderColor: 'transparent',
            },
      ]}
      onPress={onToggle}
    >
      <Text
        style={[
          styles.chipEmoji,
          !isSelected && { opacity: 0.6 },
        ]}
      >
        {ingredient.emoji}
      </Text>
      <Text
        style={[
          styles.chipText,
          isSelected
            ? styles.chipTextSelected
            : { color: isDark ? '#9CA3AF' : '#6B7280' },
        ]}
      >
        {ingredient.name}
      </Text>
      <Ionicons
        name={isSelected ? 'checkmark' : 'add'}
        size={16}
        color={isSelected ? '#FFFFFF' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(96,108,56,0.5)'}
      />
    </Pressable>
  );
}

function FeaturedRecipeCard({
  recipe,
  isDark,
  onPress,
}: {
  recipe: Recipe;
  isDark: boolean;
  onPress: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 100,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featuredCard,
        {
          backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable onPress={onPress}>
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.featuredImage} />
          <View style={styles.featuredImageOverlay} />

          {/* Match Badge */}
          <View
            style={[
              styles.matchBadge,
              { backgroundColor: isDark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.95)' },
            ]}
          >
            <View style={styles.matchDot} />
            <Text style={styles.matchText}>{recipe.matchPercentage}% MATCH</Text>
          </View>

          {/* Meta Badges */}
          <View style={styles.metaBadges}>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={14} color="#FFFFFF" />
              <Text style={styles.metaBadgeText}>{recipe.time}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons name="flame-outline" size={14} color="#FFFFFF" />
              <Text style={styles.metaBadgeText}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuredContent}>
          <Text
            style={[
              styles.featuredTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {recipe.title}
          </Text>

          <View style={styles.matchInfo}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.olive} />
            <Text style={[styles.matchInfoText, { color: isDark ? COLORS.oliveLight : COLORS.olive }]}>
              You have almost everything!
            </Text>
          </View>

          <Text style={[styles.featuredDescription, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
            A classic Middle Eastern dish that matches perfectly with your{' '}
            <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontFamily: 'PlusJakartaSans_600SemiBold' }}>
              {recipe.matchedIngredients}
            </Text>
            .
          </Text>

          <Pressable style={styles.viewRecipeButton} onPress={onPress}>
            <Text style={styles.viewRecipeButtonText}>View Recipe</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function CompactRecipeCard({
  recipe,
  isDark,
  onPress,
  delay = 0,
}: {
  recipe: Recipe;
  isDark: boolean;
  onPress: () => void;
  delay?: number;
}) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        delay,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay,
      }),
    ]).start();
  }, [delay]);

  const isHighMatch = recipe.matchPercentage >= 90;

  return (
    <Animated.View
      style={[
        styles.compactCard,
        {
          backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable style={styles.compactCardInner} onPress={onPress}>
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.compactImage} />
          <View
            style={[
              styles.compactMatchBadge,
              {
                backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                borderColor: isHighMatch ? 'rgba(96,108,56,0.2)' : 'rgba(234,179,8,0.2)',
              },
            ]}
          >
            <Text
              style={[
                styles.compactMatchText,
                { color: isHighMatch ? (isDark ? COLORS.oliveLight : COLORS.oliveDark) : '#D97706' },
              ]}
            >
              {recipe.matchPercentage}% Match
            </Text>
          </View>
        </View>

        <View style={styles.compactContent}>
          <View>
            <Text
              style={[
                styles.compactTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={2}
            >
              {recipe.title}
            </Text>
            {recipe.missingIngredients && (
              <Text style={styles.missingText}>
                Missing: {recipe.missingIngredients}
              </Text>
            )}
          </View>

          <View style={styles.compactFooter}>
            <View style={styles.compactTime}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.compactTimeText}>{recipe.time}</Text>
            </View>
            <Pressable
              style={[
                styles.compactArrowButton,
                { backgroundColor: isDark ? 'rgba(96,108,56,0.2)' : 'rgba(96,108,56,0.1)' },
              ]}
              onPress={onPress}
            >
              <Ionicons name="arrow-forward" size={18} color={COLORS.olive} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TabBarItem({
  icon,
  label,
  isActive,
  onPress,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      {isActive && <View style={styles.tabIndicator} />}
      <Ionicons
        name={icon as any}
        size={24}
        color={isActive ? COLORS.primary : 'rgba(100,116,139,0.5)'}
      />
      <Text
        style={[
          styles.tabLabel,
          isActive ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function RecipeResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ ingredients?: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuthStore();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('fridge');

  // Parse ingredients from params
  useEffect(() => {
    if (params.ingredients) {
      try {
        const parsed = JSON.parse(params.ingredients);
        if (Array.isArray(parsed)) {
          setIngredients(
            parsed.map((item: { name: string; emoji: string }) => ({
              name: item.name,
              emoji: item.emoji,
              selected: true,
            }))
          );
        }
      } catch (e) {
        console.log('Failed to parse ingredients:', e);
      }
    }
  }, [params.ingredients]);

  // Fetch recipe suggestions when ingredients change
  useEffect(() => {
    const selectedIngredients = ingredients.filter((i) => i.selected);
    if (selectedIngredients.length > 0) {
      fetchRecipeSuggestions(selectedIngredients);
    }
  }, [ingredients]);

  const fetchRecipeSuggestions = async (ingredientList: Ingredient[]) => {
    try {
      setIsLoadingRecipes(true);
      setError(null);

      const ingredientNames = ingredientList.map((i) => i.name);
      const userPreferences = user
        ? {
            dietary_restrictions: user.dietary_restrictions,
            cooking_style: user.cooking_style,
          }
        : undefined;

      const suggestions = await aiService.suggestRecipesFromIngredients(
        ingredientNames,
        userPreferences
      );

      const mappedRecipes = suggestions.map(mapSuggestedRecipeToUI);
      setRecipes(mappedRecipes);
    } catch (err) {
      console.error('Failed to fetch recipe suggestions:', err);
      setError('Failed to find recipes. Please try again.');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const toggleIngredient = (index: number) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  const handleRetry = () => {
    const selectedIngredients = ingredients.filter((i) => i.selected);
    if (selectedIngredients.length > 0) {
      fetchRecipeSuggestions(selectedIngredients);
    }
  };

  const featuredRecipe = recipes.find((r) => r.featured);
  const otherRecipes = recipes.filter((r) => !r.featured);

  // Get emojis from selected ingredients for the loading animation
  const selectedIngredients = ingredients.filter((i) => i.selected);
  const ingredientEmojis = selectedIngredients.map((i) => i.emoji);

  // Show full-screen loading animation while fetching recipes
  if (isLoadingRecipes && selectedIngredients.length > 0) {
    return (
      <RecipeLoadingAnimation
        ingredientCount={selectedIngredients.length}
        ingredientEmojis={ingredientEmojis}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: isDark
              ? 'rgba(26,18,16,0.9)'
              : 'rgba(252,250,249,0.9)',
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? '#E5E7EB' : '#374151'}
            />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Recipes for your ingredients
            </Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={isDark ? '#E5E7EB' : '#374151'}
            />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Ingredients Section */}
        <View style={styles.ingredientsSection}>
          <View style={styles.ingredientsHeader}>
            <Text style={styles.sectionLabel}>Detected Ingredients</Text>
            <Pressable>
              <Text style={styles.editLink}>Edit List</Text>
            </Pressable>
          </View>
          <View style={styles.chipsContainer}>
            {ingredients.map((ingredient, index) => (
              <IngredientChip
                key={ingredient.name}
                ingredient={ingredient}
                onToggle={() => toggleIngredient(index)}
                isDark={isDark}
              />
            ))}
          </View>
        </View>

        {/* Recipes Section */}
        <View style={styles.recipesSection}>
          {/* Error State */}
          {error && !isLoadingRecipes && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {error}
              </Text>
              <Pressable style={styles.retryButton} onPress={handleRetry}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </View>
          )}

          {/* Recipe Results */}
          {!isLoadingRecipes && !error && (
            <>
              {featuredRecipe && (
                <FeaturedRecipeCard
                  recipe={featuredRecipe}
                  isDark={isDark}
                  onPress={() => handleRecipePress(featuredRecipe.id)}
                />
              )}

              {otherRecipes.map((recipe, index) => (
                <CompactRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isDark={isDark}
                  onPress={() => handleRecipePress(recipe.id)}
                  delay={(index + 1) * 100 + 200}
                />
              ))}

              {recipes.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="restaurant-outline" size={48} color={isDark ? '#4B5563' : '#9CA3AF'} />
                  <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
                    Select some ingredients to find matching recipes
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={[
          styles.fab,
          { backgroundColor: isDark ? '#FFFFFF' : '#0F172A', bottom: insets.bottom + 100 },
        ]}
      >
        <Ionicons
          name="add"
          size={28}
          color={isDark ? '#0F172A' : '#FFFFFF'}
        />
      </Pressable>

      {/* Bottom Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDark ? 'rgba(26,18,16,0.95)' : 'rgba(255,255,255,0.9)',
            borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
            paddingBottom: insets.bottom || 16,
          },
        ]}
      >
        <TabBarItem
          icon="home-outline"
          label="Home"
          isActive={activeTab === 'home'}
          onPress={() => setActiveTab('home')}
        />
        <TabBarItem
          icon="restaurant-outline"
          label="Fridge"
          isActive={activeTab === 'fridge'}
          onPress={() => setActiveTab('fridge')}
        />
        <TabBarItem
          icon="book-outline"
          label="Saved"
          isActive={activeTab === 'saved'}
          onPress={() => setActiveTab('saved')}
        />
        <TabBarItem
          icon="person-outline"
          label="Profile"
          isActive={activeTab === 'profile'}
          onPress={() => setActiveTab('profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 24,
  },
  notificationButton: {
    width: 40,
    height: 40,
    marginRight: -8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
    paddingTop: 120,
  },
  ingredientsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  editLink: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: COLORS.primary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 2,
    gap: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.olive,
    borderColor: COLORS.olive,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  recipesSection: {
    paddingHorizontal: 24,
    gap: 32,
  },
  featuredCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
  },
  featuredImageContainer: {
    height: 256,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(242,51,13,0.2)',
    gap: 8,
  },
  matchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  metaBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  featuredContent: {
    padding: 24,
  },
  featuredTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 28,
    marginBottom: 8,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  matchInfoText: {
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'NotoSans_400Regular',
    lineHeight: 22,
    marginBottom: 24,
  },
  viewRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  viewRecipeButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  compactCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
  },
  compactCardInner: {
    flexDirection: 'row',
    height: 160,
  },
  compactImageContainer: {
    width: '40%',
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactMatchBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactMatchText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  compactContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 22,
    marginBottom: 4,
  },
  missingText: {
    fontSize: 12,
    fontFamily: 'NotoSans_400Regular',
    color: '#9CA3AF',
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  compactTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactTimeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
  },
  compactArrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 40,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    zIndex: 50,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: -16,
    width: 48,
    height: 2,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 10,
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: COLORS.primary,
  },
  tabLabelInactive: {
    fontFamily: 'NotoSans_500Medium',
    color: 'rgba(100,116,139,0.5)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
    textAlign: 'center',
  },
});
