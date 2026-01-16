// ============================================
// TIKTOK SERVICE - Video Metadata Extraction
// ============================================

import axios from 'axios';

export interface TikTokVideoMetadata {
  success: boolean;
  videoId?: string;
  title?: string;
  description?: string;
  author?: string;
  authorUsername?: string;
  thumbnailUrl?: string;
  hashtags?: string[];
  error?: string;
}

class TikTokService {

  // ============================================
  // URL PATTERN MATCHING
  // ============================================

  /**
   * Check if URL is a TikTok URL
   */
  isTikTokUrl(url: string): boolean {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/\d+/i,
      /vm\.tiktok\.com\/[\w]+/i,
      /tiktok\.com\/t\/[\w]+/i,
      /tiktok\.com\/v\/\d+/i,
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Extract video ID from various TikTok URL formats
   */
  extractVideoId(url: string): string | null {
    try {
      // Standard format: tiktok.com/@user/video/1234567890
      const standardMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/i);
      if (standardMatch?.[1]) {
        return standardMatch[1];
      }

      // Short format: vm.tiktok.com/ABC or tiktok.com/t/ABC
      // These need to be resolved to get the actual video ID
      const shortMatch = url.match(/(?:vm\.tiktok\.com|tiktok\.com\/t)\/([\w]+)/i);
      if (shortMatch?.[1]) {
        // Return the short code - will need to resolve later
        return shortMatch[1];
      }

      // Direct video format: tiktok.com/v/1234567890
      const directMatch = url.match(/tiktok\.com\/v\/(\d+)/i);
      if (directMatch?.[1]) {
        return directMatch[1];
      }

      return null;
    } catch (error) {
      console.error('Failed to extract TikTok video ID:', error);
      return null;
    }
  }

  /**
   * Normalize TikTok URL to standard format
   */
  normalizeUrl(url: string): string {
    // Remove tracking parameters
    try {
      const urlObj = new URL(url);
      // Keep only the path
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  // ============================================
  // METADATA EXTRACTION
  // ============================================

  /**
   * Get video metadata using oEmbed API (free, official)
   */
  async getVideoMetadata(videoUrl: string): Promise<TikTokVideoMetadata> {
    try {
      const normalizedUrl = this.normalizeUrl(videoUrl);

      // Use TikTok's official oEmbed endpoint
      const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(normalizedUrl)}`;

      const response = await axios.get(oEmbedUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.data) {
        const data = response.data;

        // Extract hashtags from title
        const hashtags = this.extractHashtags(data.title || '');

        // Extract author username from author_url
        let authorUsername = '';
        if (data.author_url) {
          const authorMatch = data.author_url.match(/tiktok\.com\/@([\w.-]+)/i);
          if (authorMatch?.[1]) {
            authorUsername = authorMatch[1];
          }
        }

        return {
          success: true,
          videoId: this.extractVideoId(normalizedUrl) || undefined,
          title: data.title || '',
          description: data.title || '', // oEmbed only provides title as description
          author: data.author_name || '',
          authorUsername,
          thumbnailUrl: data.thumbnail_url || '',
          hashtags,
        };
      }

      return {
        success: false,
        error: 'No metadata available for this video',
      };
    } catch (error) {
      console.error('Failed to get TikTok metadata:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Request timeout - please try again',
          };
        }

        if (error.response?.status === 404) {
          return {
            success: false,
            error: 'Video not found or is private',
          };
        }

        if (error.response?.status === 400) {
          return {
            success: false,
            error: 'Invalid TikTok URL',
          };
        }
      }

      return {
        success: false,
        error: 'Failed to fetch video information. The video may be private or unavailable.',
      };
    }
  }

  /**
   * Attempt to get more detailed description via web scraping
   * This is a fallback when oEmbed doesn't provide enough info
   */
  async scrapeVideoDescription(videoUrl: string): Promise<string | null> {
    try {
      // Use a CORS proxy or server-side endpoint in production
      // For now, we'll rely on the oEmbed data
      // This method is a placeholder for future server-side implementation

      console.log('Description scraping would require server-side implementation');
      return null;
    } catch (error) {
      console.error('Failed to scrape TikTok description:', error);
      return null;
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Extract hashtags from text
   */
  extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0600-\u06FF]+/g;
    const matches = text.match(hashtagRegex);

    if (!matches) return [];

    // Clean up hashtags and remove duplicates
    return [...new Set(matches.map(tag => tag.toLowerCase()))];
  }

  /**
   * Check if hashtags suggest this is a recipe video
   */
  isLikelyRecipeVideo(hashtags: string[]): boolean {
    const recipeRelatedHashtags = [
      '#recipe', '#recipes', '#cooking', '#cook', '#chef',
      '#foodtiktok', '#food', '#homemade', '#homecooking',
      '#easyrecipe', '#quickrecipe', '#dinner', '#lunch',
      '#breakfast', '#dessert', '#baking', '#meal',
      '#foodie', '#yummy', '#delicious', '#tasty',
      '#recipetiktok', '#cookingtiktok', '#learnontiktok',
      '#howto', '#tutorial', '#diy',
      // Arabic cooking hashtags
      '#طبخ', '#وصفات', '#اكل', '#مطبخ',
    ];

    return hashtags.some(tag =>
      recipeRelatedHashtags.includes(tag.toLowerCase())
    );
  }

  /**
   * Extract potential recipe hints from hashtags
   */
  getRecipeHintsFromHashtags(hashtags: string[]): {
    cuisineHints: string[];
    dishTypeHints: string[];
    dietaryHints: string[];
  } {
    const cuisinePatterns: Record<string, string[]> = {
      italian: ['#italian', '#pasta', '#pizza', '#risotto'],
      mexican: ['#mexican', '#tacos', '#burrito', '#salsa'],
      asian: ['#asian', '#chinese', '#japanese', '#korean', '#thai', '#vietnamese'],
      indian: ['#indian', '#curry', '#biryani', '#masala'],
      mediterranean: ['#mediterranean', '#greek', '#lebanese', '#turkish'],
      american: ['#american', '#bbq', '#burger', '#comfort'],
      middleeastern: ['#middleeastern', '#arabic', '#persian', '#عربي'],
    };

    const dishTypePatterns: Record<string, string[]> = {
      breakfast: ['#breakfast', '#brunch', '#eggs', '#pancakes'],
      lunch: ['#lunch', '#sandwich', '#salad', '#wrap'],
      dinner: ['#dinner', '#maincourse', '#entree'],
      dessert: ['#dessert', '#sweet', '#cake', '#cookies', '#chocolate'],
      appetizer: ['#appetizer', '#snack', '#starter', '#dip'],
      drink: ['#drink', '#smoothie', '#juice', '#cocktail'],
    };

    const dietaryPatterns: Record<string, string[]> = {
      vegan: ['#vegan', '#plantbased'],
      vegetarian: ['#vegetarian', '#veggie', '#meatless'],
      glutenfree: ['#glutenfree', '#gf', '#celiac'],
      keto: ['#keto', '#lowcarb', '#ketodiet'],
      healthy: ['#healthy', '#healthyfood', '#cleaneating', '#fitness'],
    };

    const lowerHashtags = hashtags.map(h => h.toLowerCase());

    const cuisineHints = Object.entries(cuisinePatterns)
      .filter(([, patterns]) => patterns.some(p => lowerHashtags.includes(p)))
      .map(([cuisine]) => cuisine);

    const dishTypeHints = Object.entries(dishTypePatterns)
      .filter(([, patterns]) => patterns.some(p => lowerHashtags.includes(p)))
      .map(([type]) => type);

    const dietaryHints = Object.entries(dietaryPatterns)
      .filter(([, patterns]) => patterns.some(p => lowerHashtags.includes(p)))
      .map(([diet]) => diet);

    return { cuisineHints, dishTypeHints, dietaryHints };
  }

  /**
   * Generate thumbnail URL variants
   */
  getThumbnailUrl(thumbnailUrl: string, quality: 'original' | 'high' | 'medium' = 'high'): string {
    // TikTok thumbnails from oEmbed are usually good quality
    // This method is here for future quality adjustments if needed
    return thumbnailUrl;
  }
}

// Export singleton instance
export const tiktokService = new TikTokService();

// Export class for testing
export default TikTokService;

// ============================================
// HELPER: Check if URL is TikTok
// ============================================
export const isTikTokUrl = (url: string): boolean => {
  return tiktokService.isTikTokUrl(url);
};

// ============================================
// HELPER: Get TikTok thumbnail
// ============================================
export const getTikTokThumbnail = (thumbnailUrl: string): string => {
  return tiktokService.getThumbnailUrl(thumbnailUrl);
};
