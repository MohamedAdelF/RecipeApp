// ============================================
// INGREDIENT EMOJI MAPPING
// ============================================

export const INGREDIENT_EMOJIS: Record<string, string> = {
  // Produce - Vegetables
  tomato: '🍅',
  tomatoes: '🍅',
  spinach: '🥬',
  lettuce: '🥬',
  kale: '🥬',
  cabbage: '🥬',
  carrot: '🥕',
  carrots: '🥕',
  onion: '🧅',
  onions: '🧅',
  garlic: '🧄',
  potato: '🥔',
  potatoes: '🥔',
  corn: '🌽',
  broccoli: '🥦',
  cucumber: '🥒',
  zucchini: '🥒',
  pepper: '🫑',
  'bell pepper': '🫑',
  'green pepper': '🫑',
  'red pepper': '🌶️',
  chili: '🌶️',
  jalapeño: '🌶️',
  eggplant: '🍆',
  mushroom: '🍄',
  mushrooms: '🍄',
  avocado: '🥑',
  celery: '🥬',
  asparagus: '🥦',
  peas: '🫛',
  'green beans': '🫛',
  beans: '🫘',

  // Produce - Fruits
  apple: '🍎',
  apples: '🍎',
  banana: '🍌',
  bananas: '🍌',
  orange: '🍊',
  oranges: '🍊',
  lemon: '🍋',
  lemons: '🍋',
  lime: '🍋',
  grape: '🍇',
  grapes: '🍇',
  strawberry: '🍓',
  strawberries: '🍓',
  blueberry: '🫐',
  blueberries: '🫐',
  watermelon: '🍉',
  melon: '🍈',
  peach: '🍑',
  pear: '🍐',
  cherry: '🍒',
  cherries: '🍒',
  pineapple: '🍍',
  mango: '🥭',
  coconut: '🥥',
  kiwi: '🥝',

  // Dairy
  milk: '🥛',
  cheese: '🧀',
  butter: '🧈',
  egg: '🥚',
  eggs: '🥚',
  yogurt: '🥛',
  cream: '🥛',
  'sour cream': '🥛',
  'cream cheese': '🧀',
  parmesan: '🧀',
  mozzarella: '🧀',
  cheddar: '🧀',

  // Meat & Protein
  chicken: '🍗',
  'chicken breast': '🍗',
  'chicken thigh': '🍗',
  turkey: '🦃',
  beef: '🥩',
  steak: '🥩',
  'ground beef': '🥩',
  pork: '🥓',
  bacon: '🥓',
  ham: '🥓',
  sausage: '🌭',
  lamb: '🍖',
  fish: '🐟',
  salmon: '🐟',
  tuna: '🐟',
  shrimp: '🦐',
  crab: '🦀',
  lobster: '🦞',
  tofu: '🧈',

  // Bread & Grains
  bread: '🍞',
  toast: '🍞',
  rice: '🍚',
  pasta: '🍝',
  noodles: '🍜',
  'spaghetti': '🍝',
  flour: '🌾',
  oats: '🌾',
  cereal: '🥣',

  // Pantry
  oil: '🫒',
  'olive oil': '🫒',
  'vegetable oil': '🫒',
  honey: '🍯',
  sugar: '🍬',
  salt: '🧂',
  vinegar: '🫒',
  'soy sauce': '🥢',

  // Condiments
  ketchup: '🍅',
  mustard: '🟡',
  mayonnaise: '🥚',
  'hot sauce': '🌶️',

  // Beverages
  coffee: '☕',
  tea: '🍵',
  juice: '🧃',
  water: '💧',
  wine: '🍷',
  beer: '🍺',

  // Nuts & Seeds
  peanut: '🥜',
  peanuts: '🥜',
  almond: '🌰',
  almonds: '🌰',
  walnut: '🌰',
  walnuts: '🌰',
  cashew: '🌰',
  cashews: '🌰',

  // Herbs & Spices
  basil: '🌿',
  mint: '🌿',
  parsley: '🌿',
  cilantro: '🌿',
  oregano: '🌿',
  thyme: '🌿',
  rosemary: '🌿',
  ginger: '🫚',
  cinnamon: '🟤',

  // Default
  default: '🥗',
};

/**
 * Get emoji for an ingredient by name
 */
export function getIngredientEmoji(name: string): string {
  const key = name.toLowerCase().trim();

  // Try exact match first
  if (INGREDIENT_EMOJIS[key]) {
    return INGREDIENT_EMOJIS[key];
  }

  // Try partial match
  for (const [ingredientKey, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
    if (key.includes(ingredientKey) || ingredientKey.includes(key)) {
      return emoji;
    }
  }

  return INGREDIENT_EMOJIS.default;
}

/**
 * Convert confidence level to percentage
 */
export function confidenceToPercent(confidence: 'high' | 'medium' | 'low'): number {
  switch (confidence) {
    case 'high':
      return 97;
    case 'medium':
      return 85;
    case 'low':
      return 68;
    default:
      return 85;
  }
}
