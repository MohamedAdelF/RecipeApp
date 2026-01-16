// ============================================
// AI SERVICE - Gemini API Integration
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_PROMPTS, parseAIResponse } from '../utils/prompts';
import type {
  ExtractedRecipe,
  SuggestedRecipe,
  FridgeScanResult,
  IngredientSubstitution,
  VoiceCommand,
  Ingredient
} from '../utils/types';

// Initialize Gemini client
const gemini = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const systemInstruction =
  'You are a helpful cooking assistant. Always return valid JSON without markdown formatting.';
const textModel = gemini.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction
});
const visionModel = gemini.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction
});

const generateText = async (
  prompt: string,
  options?: { temperature?: number; maxOutputTokens?: number; responseMimeType?: string }
) => {
  const result = await textModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxOutputTokens ?? 4000,
      responseMimeType: options?.responseMimeType
    }
  });

  return result.response.text();
};

const generateVision = async (
  prompt: string,
  imageBase64: string,
  options?: { temperature?: number; maxOutputTokens?: number; responseMimeType?: string }
) => {
  const result = await visionModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.5,
      maxOutputTokens: options?.maxOutputTokens ?? 2000,
      responseMimeType: options?.responseMimeType
    }
  });

  return result.response.text();
};

const parseWithRepair = async (rawText: string) => {
  try {
    return parseAIResponse(rawText);
  } catch (error) {
    const repairPrompt = `Fix and complete the JSON below. Return only valid JSON, no markdown or extra text.\n\n${rawText}`;
    const repaired = await generateText(repairPrompt, {
      temperature: 0,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json'
    });
    return parseAIResponse(repaired);
  }
};

class AIService {
  
  // ============================================
  // EXTRACT RECIPE FROM VIDEO TRANSCRIPT
  // ============================================
  async extractRecipeFromTranscript(
    transcript: string,
    userPreferences?: any
  ): Promise<ExtractedRecipe> {
    try {
      const prompt = AI_PROMPTS.extractRecipe(transcript, userPreferences);
      
      const responseText = await generateText(prompt, {
        temperature: 0.5,
        maxOutputTokens: 6000,
        responseMimeType: 'application/json'
      });

      const extractedRecipe = await parseWithRepair(responseText);
      
      // Validate required fields
      if (!extractedRecipe.title || !extractedRecipe.ingredients || !extractedRecipe.steps) {
        throw new Error('Incomplete recipe data received from AI');
      }
      
      return extractedRecipe;
    } catch (error) {
      console.error('Failed to extract recipe:', error);
      throw new Error('Failed to extract recipe from transcript');
    }
  }

  // ============================================
  // ANALYZE FRIDGE IMAGE
  // ============================================
  async analyzeFridgeImage(imageBase64: string): Promise<FridgeScanResult> {
    try {
      const prompt = AI_PROMPTS.analyzeFridgeImage();
      
      const responseText = await generateVision(prompt, imageBase64, {
        maxOutputTokens: 2000,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      // Check for error in response
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to analyze fridge image:', error);
      throw new Error('Failed to analyze fridge image');
    }
  }

  // ============================================
  // SUGGEST RECIPES FROM AVAILABLE INGREDIENTS
  // ============================================
  async suggestRecipesFromIngredients(
    ingredients: string[],
    userPreferences?: any
  ): Promise<SuggestedRecipe[]> {
    try {
      const prompt = AI_PROMPTS.suggestRecipesFromFridge(ingredients, userPreferences);
      
      const responseText = await generateText(prompt, {
        temperature: 0.8,
        maxOutputTokens: 3000,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return result.recipes || [];
    } catch (error) {
      console.error('Failed to suggest recipes:', error);
      throw new Error('Failed to suggest recipes from ingredients');
    }
  }

  // ============================================
  // SUGGEST INGREDIENT SUBSTITUTION
  // ============================================
  async suggestSubstitution(
    ingredient: string,
    recipeContext: string
  ): Promise<IngredientSubstitution[]> {
    try {
      const prompt = AI_PROMPTS.suggestSubstitution(ingredient, recipeContext);
      
      const responseText = await generateText(prompt, {
        temperature: 0.6,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return result.substitutes || [];
    } catch (error) {
      console.error('Failed to suggest substitution:', error);
      throw new Error('Failed to suggest ingredient substitution');
    }
  }

  // ============================================
  // SCALE RECIPE
  // ============================================
  async scaleRecipe(
    originalServings: number,
    newServings: number,
    ingredients: Ingredient[]
  ): Promise<{ ingredients: Ingredient[]; notes?: string }> {
    try {
      const prompt = AI_PROMPTS.scaleRecipe(originalServings, newServings, ingredients);
      
      const responseText = await generateText(prompt, {
        temperature: 0.3,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return {
        ingredients: result.ingredients,
        notes: result.notes
      };
    } catch (error) {
      console.error('Failed to scale recipe:', error);
      throw new Error('Failed to scale recipe');
    }
  }

  // ============================================
  // PARSE VOICE COMMAND
  // ============================================
  async parseVoiceCommand(
    command: string,
    context: { currentStep: number; totalSteps: number }
  ): Promise<VoiceCommand> {
    try {
      const prompt = AI_PROMPTS.parseVoiceCommand(command, context);
      
      const responseText = await generateText(prompt, {
        temperature: 0.3,
        maxOutputTokens: 500,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return result;
    } catch (error) {
      console.error('Failed to parse voice command:', error);
      // Return unknown command on error
      return {
        action: 'unknown',
        confidence: 'low'
      };
    }
  }

  // ============================================
  // ESTIMATE NUTRITION (if not in transcript)
  // ============================================
  async estimateNutrition(
    ingredients: Ingredient[],
    servings: number
  ): Promise<any> {
    try {
      const prompt = AI_PROMPTS.estimateNutrition(ingredients, servings);
      
      const responseText = await generateText(prompt, {
        temperature: 0.4,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return result;
    } catch (error) {
      console.error('Failed to estimate nutrition:', error);
      return null;
    }
  }

  // ============================================
  // PROCESS USER RECIPE NOTES
  // ============================================
  async processUserNotes(
    notes: string,
    originalRecipe: any
  ): Promise<any> {
    try {
      const prompt = AI_PROMPTS.processUserNotes(notes, originalRecipe);
      
      const responseText = await generateText(prompt, {
        temperature: 0.5,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json'
      });

      const result = await parseWithRepair(responseText);
      
      return result;
    } catch (error) {
      console.error('Failed to process user notes:', error);
      return null;
    }
  }

  // ============================================
  // EXTRACT RECIPE FROM SOCIAL MEDIA DESCRIPTION
  // ============================================
  async extractRecipeFromDescription(
    description: string,
    hashtags: string[] = []
  ): Promise<ExtractedRecipe> {
    try {
      const prompt = AI_PROMPTS.extractRecipeFromDescription(description, hashtags);

      const responseText = await generateText(prompt, {
        temperature: 0.6,
        maxOutputTokens: 6000,
        responseMimeType: 'application/json'
      });

      const extractedRecipe = await parseWithRepair(responseText);

      // Validate required fields
      if (!extractedRecipe.title || !extractedRecipe.ingredients || !extractedRecipe.steps) {
        throw new Error('Incomplete recipe data extracted from description');
      }

      return extractedRecipe;
    } catch (error) {
      console.error('Failed to extract recipe from description:', error);
      throw new Error('Failed to extract recipe from description');
    }
  }

  // ============================================
  // EXTRACT RECIPE FROM VIDEO FRAMES (VISION)
  // ============================================
  async extractRecipeFromVideoFrames(
    frameUrls: string[],
    metadata?: { title?: string; description?: string; hashtags?: string[] }
  ): Promise<ExtractedRecipe> {
    try {
      if (!frameUrls || frameUrls.length === 0) {
        throw new Error('No video frames provided');
      }

      // Use the first frame/thumbnail for analysis
      const thumbnailUrl = frameUrls[0];

      // Fetch the image and convert to base64
      const response = await fetch(thumbnailUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch video thumbnail');
      }

      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove the data URL prefix to get just the base64
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const prompt = AI_PROMPTS.extractRecipeFromVideoFrames(metadata);

      const responseText = await generateVision(prompt, base64, {
        temperature: 0.6,
        maxOutputTokens: 6000,
        responseMimeType: 'application/json'
      });

      const extractedRecipe = await parseWithRepair(responseText);

      // Validate required fields
      if (!extractedRecipe.title) {
        throw new Error('Could not identify recipe from video frame');
      }

      // Ensure we have at least basic structure
      if (!extractedRecipe.ingredients) {
        extractedRecipe.ingredients = [];
      }
      if (!extractedRecipe.steps) {
        extractedRecipe.steps = [];
      }

      return extractedRecipe;
    } catch (error) {
      console.error('Failed to extract recipe from video frames:', error);
      throw new Error('Failed to analyze video for recipe');
    }
  }

  // ============================================
  // BATCH PROCESSING (for multiple recipes)
  // ============================================
  async batchExtractRecipes(
    transcripts: { id: string; transcript: string }[],
    userPreferences?: any
  ): Promise<{ id: string; recipe?: ExtractedRecipe; error?: string }[]> {
    const results = [];
    
    for (const item of transcripts) {
      try {
        const recipe = await this.extractRecipeFromTranscript(
          item.transcript,
          userPreferences
        );
        results.push({ id: item.id, recipe });
      } catch (error) {
        results.push({ 
          id: item.id, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export class for testing
export default AIService;
