// ============================================
// INSTAGRAM SERVICE - Video/Reel Metadata Extraction
// ============================================

import axios from 'axios';

export interface InstagramVideoMetadata {
  success: boolean;
  mediaId?: string;
  title?: string;
  description?: string;
  author?: string;
  authorUsername?: string;
  thumbnailUrl?: string;
  mediaType?: 'reel' | 'post' | 'tv';
  hashtags?: string[];
  error?: string;
}

class InstagramService {

  // ============================================
  // URL PATTERN MATCHING
  // ============================================

  /**
   * Check if URL is an Instagram URL
   */
  isInstagramUrl(url: string): boolean {
    const patterns = [
      /instagram\.com\/reel\/[\w-]+/i,
      /instagram\.com\/p\/[\w-]+/i,
      /instagram\.com\/tv\/[\w-]+/i,
      /instagr\.am\/p\/[\w-]+/i,
      /instagr\.am\/reel\/[\w-]+/i,
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Extract media ID (shortcode) from various Instagram URL formats
   */
  extractMediaId(url: string): string | null {
    try {
      // Reel format: instagram.com/reel/ABC123
      const reelMatch = url.match(/instagram\.com\/reel\/([\w-]+)/i);
      if (reelMatch?.[1]) {
        return reelMatch[1];
      }

      // Post format: instagram.com/p/ABC123
      const postMatch = url.match(/instagram\.com\/p\/([\w-]+)/i);
      if (postMatch?.[1]) {
        return postMatch[1];
      }

      // IGTV format: instagram.com/tv/ABC123
      const tvMatch = url.match(/instagram\.com\/tv\/([\w-]+)/i);
      if (tvMatch?.[1]) {
        return tvMatch[1];
      }

      // Short URL format: instagr.am/p/ABC123 or instagr.am/reel/ABC123
      const shortMatch = url.match(/instagr\.am\/(?:p|reel)\/([\w-]+)/i);
      if (shortMatch?.[1]) {
        return shortMatch[1];
      }

      return null;
    } catch (error) {
      console.error('Failed to extract Instagram media ID:', error);
      return null;
    }
  }

  /**
   * Detect media type from URL
   */
  getMediaType(url: string): 'reel' | 'post' | 'tv' | null {
    if (/instagram\.com\/reel\//i.test(url) || /instagr\.am\/reel\//i.test(url)) {
      return 'reel';
    }
    if (/instagram\.com\/tv\//i.test(url)) {
      return 'tv';
    }
    if (/instagram\.com\/p\//i.test(url) || /instagr\.am\/p\//i.test(url)) {
      return 'post';
    }
    return null;
  }

  /**
   * Normalize Instagram URL to standard format
   */
  normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove trailing slashes and query parameters
      let path = urlObj.pathname.replace(/\/$/, '');
      return `https://www.instagram.com${path}/`;
    } catch {
      return url;
    }
  }

  // ============================================
  // METADATA EXTRACTION
  // ============================================

  /**
   * Get video metadata using oEmbed API (free, official)
   * Note: Instagram's oEmbed has more restrictions than TikTok's
   */
  async getVideoMetadata(videoUrl: string): Promise<InstagramVideoMetadata> {
    try {
      const normalizedUrl = this.normalizeUrl(videoUrl);
      const mediaType = this.getMediaType(normalizedUrl);

      // Instagram's official oEmbed endpoint
      // Note: Requires app review for full access in production
      const oEmbedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(normalizedUrl)}`;

      const response = await axios.get(oEmbedUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.data) {
        const data = response.data;

        // Extract hashtags from title/caption
        const hashtags = this.extractHashtags(data.title || '');

        // Extract author username
        let authorUsername = data.author_name || '';

        return {
          success: true,
          mediaId: this.extractMediaId(normalizedUrl) || undefined,
          title: data.title || '',
          description: data.title || '', // oEmbed title often contains the caption
          author: data.author_name || '',
          authorUsername,
          thumbnailUrl: data.thumbnail_url || '',
          mediaType: mediaType || undefined,
          hashtags,
        };
      }

      return {
        success: false,
        error: 'No metadata available for this post',
      };
    } catch (error) {
      console.error('Failed to get Instagram metadata:', error);

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
            error: 'Post not found or is private',
          };
        }

        if (error.response?.status === 400) {
          return {
            success: false,
            error: 'Invalid Instagram URL',
          };
        }

        // Instagram often returns 401/403 for private accounts
        if (error.response?.status === 401 || error.response?.status === 403) {
          return {
            success: false,
            error: 'This post is from a private account or requires login to view',
          };
        }
      }

      return {
        success: false,
        error: 'Failed to fetch post information. The post may be private or unavailable.',
      };
    }
  }

  /**
   * Fallback: Build metadata from URL when oEmbed fails
   * This provides minimal info but allows the flow to continue
   */
  getBasicMetadataFromUrl(videoUrl: string): InstagramVideoMetadata {
    const mediaId = this.extractMediaId(videoUrl);
    const mediaType = this.getMediaType(videoUrl);

    return {
      success: true,
      mediaId: mediaId || undefined,
      mediaType: mediaType || undefined,
      title: '',
      description: '',
      author: '',
      authorUsername: '',
      thumbnailUrl: '',
      hashtags: [],
    };
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
      '#foodstagram', '#food', '#homemade', '#homecooking',
      '#easyrecipe', '#quickrecipe', '#dinner', '#lunch',
      '#breakfast', '#dessert', '#baking', '#meal',
      '#foodie', '#yummy', '#delicious', '#tasty',
      '#instafood', '#foodporn', '#foodphotography',
      '#reelsrecipe', '#reelsfood', '#cookingreels',
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
      italian: ['#italian', '#pasta', '#pizza', '#risotto', '#italianfood'],
      mexican: ['#mexican', '#tacos', '#burrito', '#salsa', '#mexicanfood'],
      asian: ['#asian', '#chinese', '#japanese', '#korean', '#thai', '#vietnamese', '#asianfood'],
      indian: ['#indian', '#curry', '#biryani', '#masala', '#indianfood'],
      mediterranean: ['#mediterranean', '#greek', '#lebanese', '#turkish', '#medfood'],
      american: ['#american', '#bbq', '#burger', '#comfort', '#comfortfood'],
      middleeastern: ['#middleeastern', '#arabic', '#persian', '#عربي'],
    };

    const dishTypePatterns: Record<string, string[]> = {
      breakfast: ['#breakfast', '#brunch', '#eggs', '#pancakes', '#breakfastideas'],
      lunch: ['#lunch', '#sandwich', '#salad', '#wrap', '#lunchideas'],
      dinner: ['#dinner', '#maincourse', '#entree', '#dinnerideas'],
      dessert: ['#dessert', '#sweet', '#cake', '#cookies', '#chocolate', '#baking'],
      appetizer: ['#appetizer', '#snack', '#starter', '#dip', '#fingerfood'],
      drink: ['#drink', '#smoothie', '#juice', '#cocktail', '#beverages'],
    };

    const dietaryPatterns: Record<string, string[]> = {
      vegan: ['#vegan', '#plantbased', '#veganfood', '#veganrecipes'],
      vegetarian: ['#vegetarian', '#veggie', '#meatless', '#vegetarianfood'],
      glutenfree: ['#glutenfree', '#gf', '#celiac', '#glutenfreerecipes'],
      keto: ['#keto', '#lowcarb', '#ketodiet', '#ketorecipes'],
      healthy: ['#healthy', '#healthyfood', '#cleaneating', '#fitness', '#eatclean'],
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
   * Generate a thumbnail URL from media ID
   * Note: Direct thumbnail access may be restricted
   */
  getThumbnailUrl(thumbnailUrl: string): string {
    // Instagram thumbnails from oEmbed are usually available
    return thumbnailUrl;
  }
}

// Export singleton instance
export const instagramService = new InstagramService();

// Export class for testing
export default InstagramService;

// ============================================
// HELPER: Check if URL is Instagram
// ============================================
export const isInstagramUrl = (url: string): boolean => {
  return instagramService.isInstagramUrl(url);
};

// ============================================
// HELPER: Get Instagram thumbnail
// ============================================
export const getInstagramThumbnail = (thumbnailUrl: string): string => {
  return instagramService.getThumbnailUrl(thumbnailUrl);
};
