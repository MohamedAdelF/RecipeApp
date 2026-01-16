import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import type { FridgeScanResult, SuggestedRecipe } from '@/utils/types';

interface FridgeScanResultsProps {
  scanResult: FridgeScanResult;
  suggestedRecipes: SuggestedRecipe[];
  onReset: () => void;
  onSelectRecipe: (recipe: SuggestedRecipe) => void;
}

export function FridgeScanResults({
  scanResult,
  suggestedRecipes,
  onReset,
  onSelectRecipe,
}: FridgeScanResultsProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
          <Text h4 style={styles.title}>Found {scanResult.total_items} Ingredients!</Text>
          <Button
            title="Scan Again"
            type="outline"
            onPress={onReset}
            buttonStyle={styles.resetButton}
            titleStyle={styles.resetButtonText}
            icon={<Ionicons name="refresh" size={16} color="#FF6B35" style={{ marginRight: 8 }} />}
          />
        </View>

        {/* Detected Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Ingredients</Text>
          <View style={styles.ingredientTags}>
            {scanResult.ingredients.map((ing, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  ing.confidence === 'high' && styles.tagHigh,
                  ing.confidence === 'medium' && styles.tagMedium,
                  ing.confidence === 'low' && styles.tagLow,
                ]}
              >
                <Text style={styles.tagText}>{ing.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Suggested Recipes */}
        {suggestedRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipes You Can Make</Text>
            {suggestedRecipes.map((recipe, index) => (
              <Card key={index} containerStyle={styles.recipeCard}>
                <View style={styles.recipeHeader}>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{recipe.match_score}% match</Text>
                  </View>
                </View>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>

                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#888" />
                    <Text style={styles.metaText}>{recipe.total_time_minutes} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="speedometer-outline" size={14} color="#888" />
                    <Text style={styles.metaText}>{recipe.difficulty}</Text>
                  </View>
                </View>

                {recipe.ingredients_you_need.length > 0 && (
                  <View style={styles.needSection}>
                    <Text style={styles.needTitle}>You might need:</Text>
                    <Text style={styles.needText}>
                      {recipe.ingredients_you_need.join(', ')}
                    </Text>
                  </View>
                )}

                <Button
                  title="View Recipe"
                  onPress={() => onSelectRecipe(recipe)}
                  buttonStyle={styles.viewButton}
                  icon={<Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 8 }} />}
                  iconRight
                />
              </Card>
            ))}
          </View>
        )}

        {suggestedRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              No recipes found with these ingredients. Try adding more items!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
    marginBottom: 16,
    color: '#1A1A2E',
  },
  resetButton: {
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    color: '#FF6B35',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagHigh: {
    backgroundColor: '#E8F5E9',
  },
  tagMedium: {
    backgroundColor: '#FFF3E0',
  },
  tagLow: {
    backgroundColor: '#FFEBEE',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  recipeCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    marginHorizontal: 0,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  matchBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#888',
  },
  needSection: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  needTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 4,
  },
  needText: {
    fontSize: 13,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    lineHeight: 24,
  },
});
