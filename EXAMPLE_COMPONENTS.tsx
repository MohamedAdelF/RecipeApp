// ============================================
// EXAMPLE COMPONENTS - Ready to Use
// ============================================

// components/ui/Button.tsx
// ============================================
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  loading, 
  variant = 'primary',
  size = 'medium',
  disabled 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        styles[variant],
        styles[size],
        (loading || disabled) && styles.disabled
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#007AFF' : '#fff'} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#fff',
  },
});


// ============================================
// components/ui/Input.tsx
// ============================================
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline,
  numberOfLines = 1,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multiline,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="#999"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
});


// ============================================
// components/ui/Card.tsx
// ============================================
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: any;
}

export default function Card({ children, onPress, style }: CardProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
});


// ============================================
// components/ui/Loading.tsx
// ============================================
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export default function Loading({ 
  message, 
  size = 'large',
  fullScreen = false 
}: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color="#007AFF" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});


// ============================================
// components/recipe/RecipeCard.tsx
// ============================================
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Recipe } from '../../utils/types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onFavorite?: () => void;
}

export default function RecipeCard({ recipe, onPress, onFavorite }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {recipe.thumbnail_url && (
        <Image source={{ uri: recipe.thumbnail_url }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{recipe.total_time_minutes} min</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="restaurant-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{recipe.current_servings} servings</Text>
          </View>
          
          <View style={[styles.badge, styles[`${recipe.difficulty}Badge`]]}>
            <Text style={styles.badgeText}>{recipe.difficulty}</Text>
          </View>
        </View>
        
        {onFavorite && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={onFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={recipe.is_favorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={recipe.is_favorite ? '#dc3545' : '#666'} 
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  beginnerBadge: {
    backgroundColor: '#d4edda',
  },
  intermediateBadge: {
    backgroundColor: '#fff3cd',
  },
  advancedBadge: {
    backgroundColor: '#f8d7da',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
});


// ============================================
// components/recipe/IngredientCheckbox.tsx
// ============================================
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Ingredient } from '../../utils/types';

interface IngredientCheckboxProps {
  ingredient: Ingredient;
  checked: boolean;
  onToggle: () => void;
}

export default function IngredientCheckbox({ 
  ingredient, 
  checked, 
  onToggle 
}: IngredientCheckboxProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, checked && styles.nameChecked]}>
          {ingredient.amount && `${ingredient.amount} `}
          {ingredient.unit && `${ingredient.unit} `}
          {ingredient.name}
        </Text>
        
        {ingredient.notes && (
          <Text style={styles.notes}>{ingredient.notes}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  nameChecked: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});


// ============================================
// Export all components
// ============================================
export { default as Button } from './ui/Button';
export { default as Input } from './ui/Input';
export { default as Card } from './ui/Card';
export { default as Loading } from './ui/Loading';
export { default as RecipeCard } from './recipe/RecipeCard';
export { default as IngredientCheckbox } from './recipe/IngredientCheckbox';
