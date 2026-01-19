import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import type { Recipe, User, ShoppingList, ShoppingItem, FridgeScan, DetectedIngredient } from '@/utils/types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    WebBrowser.maybeCompleteAuthSession();
    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  // ============================================
  // AUTH
  // ============================================
  async getSession() {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: 'recipeapp://auth/reset-password',
    });
    if (error) throw error;
  }

  async signInWithGoogle() {
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: 'recipeapp',
      path: 'auth/callback',
    });

    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    if (!data?.url) throw new Error('Missing OAuth URL');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) {
      throw new Error('Authentication cancelled');
    }

    const { data: sessionData, error: exchangeError } =
      await this.client.auth.exchangeCodeForSession(result.url);
    if (exchangeError) throw exchangeError;
    return sessionData;
  }

  // ============================================
  // PROFILES
  // ============================================
  async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async createProfile(profile: Partial<User>) {
    const { data, error } = await this.client
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await this.client
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ============================================
  // RECIPES
  // ============================================
  async getRecipes(): Promise<Recipe[]> {
    const session = await this.getSession();
    if (!session) return [];

    const { data, error } = await this.client
      .from('recipes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    const { data, error } = await this.client
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
    const session = await this.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await this.client
      .from('recipes')
      .insert({
        ...recipe,
        user_id: session.user.id,
        is_favorite: false,
        times_cooked: 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const { data, error } = await this.client
      .from('recipes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteRecipe(id: string): Promise<void> {
    const session = await this.getSession();
    if (!session) throw new Error('Not authenticated');

    const { error, count } = await this.client
      .from('recipes')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
    if (count === 0) throw new Error('Recipe not found or already deleted');
  }

  // ============================================
  // SHOPPING LISTS
  // ============================================
  async getShoppingList(): Promise<ShoppingList | null> {
    const session = await this.getSession();
    if (!session) return null;

    const { data, error } = await this.client
      .from('shopping_lists')
      .select('*, items:shopping_items(*)')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async addShoppingItem(item: Partial<ShoppingItem>): Promise<ShoppingItem> {
    const { data, error } = await this.client
      .from('shopping_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateShoppingItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
    const { error } = await this.client
      .from('shopping_items')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteShoppingItem(id: string): Promise<void> {
    const { error } = await this.client.from('shopping_items').delete().eq('id', id);
    if (error) throw error;
  }

  // ============================================
  // USAGE TRACKING (for free tier limits)
  // ============================================
  async checkUsageLimits(): Promise<{
    canExtractRecipe: boolean;
    canScanFridge: boolean;
    recipesRemaining: number;
    scansRemaining: number;
  }> {
    const session = await this.getSession();
    if (!session) {
      return {
        canExtractRecipe: false,
        canScanFridge: false,
        recipesRemaining: 0,
        scansRemaining: 0,
      };
    }

    const profile = await this.getProfile(session.user.id);
    if (profile?.is_premium) {
      return {
        canExtractRecipe: true,
        canScanFridge: true,
        recipesRemaining: 999,
        scansRemaining: 999,
      };
    }

    // Free tier limits
    const recipesRemaining = Math.max(0, 5 - (profile?.weekly_recipe_count || 0));
    const scansRemaining = Math.max(0, 1 - (profile?.weekly_scan_count || 0));

    return {
      canExtractRecipe: recipesRemaining > 0,
      canScanFridge: scansRemaining > 0,
      recipesRemaining,
      scansRemaining,
    };
  }

  async incrementUsage(type: 'recipe' | 'scan'): Promise<void> {
    const session = await this.getSession();
    if (!session) return;

    const profile = await this.getProfile(session.user.id);
    if (!profile) return;

    const updates =
      type === 'recipe'
        ? { weekly_recipe_count: (profile.weekly_recipe_count || 0) + 1 }
        : { weekly_scan_count: (profile.weekly_scan_count || 0) + 1 };

    await this.updateProfile(session.user.id, updates);
  }

  // ============================================
  // FRIDGE SCANS
  // ============================================
  async saveFridgeScan(scan: {
    image_url?: string;
    ingredients: DetectedIngredient[];
    total_items: number;
    notes?: string;
  }): Promise<FridgeScan> {
    const session = await this.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await this.client
      .from('fridge_scans')
      .insert({
        ...scan,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getFridgeScans(limit = 10): Promise<FridgeScan[]> {
    const session = await this.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await this.client
      .from('fridge_scans')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getFridgeScan(id: string): Promise<FridgeScan | null> {
    const { data, error } = await this.client
      .from('fridge_scans')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async deleteFridgeScan(id: string): Promise<void> {
    const session = await this.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { error } = await this.client
      .from('fridge_scans')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
  }
}

export const supabaseService = new SupabaseService();
export default SupabaseService;
