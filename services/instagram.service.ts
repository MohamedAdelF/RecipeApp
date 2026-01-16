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
  resolvedUrl?: string;
  error?: string;
}

class InstagramService {

  // ============================================
  // URL PATTERN MATCHING
  // ============================================

  /**
   * Check if URL is an Instagram URL (supports ALL formats)
   */
  isInstagramUrl(url: string): boolean {
    const patterns = [
      // Standard formats
      /instagram\.com\/reel\/[\w-]+/i,
      /instagram\.com\/reels\/[\w-]+/i,
      /instagram\.com\/p\/[\w-]+/i,
      /instagram\.com\/tv\/[\w-]+/i,
      // Short URL formats
      /instagr\.am\/p\/[\w-]+/i,
      /instagr\.am\/reel\/[\w-]+/i,
      /instagr\.am\/reels\/[\w-]+/i,
      // Share URLs
      /instagram\.com\/share\/[\w-]+/i,
      // Stories (though we can't extract these)
      /instagram\.com\/stories\/[\w.-]+\/\d+/i,
      // Any instagram domain with valid path
      /(?:www\.)?instagram\.com\/[\w\/@.-]+/i,
      /instagr\.am\/[\w\/@.-]+/i,
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Check if URL is a short/redirect URL that needs resolution
   */
  isShortUrl(url: string): boolean {
    const shortPatterns = [
      /instagr\.am\//i,
      /instagram\.com\/share\//i,
    ];
    return shortPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Extract media ID (shortcode) from various Instagram URL formats
   */
  extractMediaId(url: string): string | null {
    try {
      // Reel format: instagram.com/reel/ABC123 or instagram.com/reels/ABC123
      const reelMatch = url.match(/instagram\.com\/reels?\/([\w-]+)/i);
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

      // Short URL formats: instagr.am/p/ABC123 or instagr.am/reel/ABC123
      const shortPostMatch = url.match(/instagr\.am\/p\/([\w-]+)/i);
      if (shortPostMatch?.[1]) {
        return shortPostMatch[1];
      }

      const shortReelMatch = url.match(/instagr\.am\/reels?\/([\w-]+)/i);
      if (shortReelMatch?.[1]) {
        return shortReelMatch[1];
      }

      // Share format: instagram.com/share/ABC123
      const shareMatch = url.match(/instagram\.com\/share\/([\w-]+)/i);
      if (shareMatch?.[1]) {
        return shareMatch[1];
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
    if (/instagram\.com\/reels?\//i.test(url) || /instagr\.am\/reels?\//i.test(url)) {
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
   * Normalize Instagram URL - remove tracking parameters
   */
  normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname.replace(/\/$/, '');
      return `https://www.instagram.com${path}/`;
    } catch {
      return url;
    }
  }

  // ============================================
  // URL RESOLUTION
  // ============================================

  /**
   * Resolve short URL to full URL by following redirects
   */
  async resolveShortUrl(shortUrl: string): Promise<string> {
    try {
      // Follow redirects to get the final URL
      const response = await axios.head(shortUrl, {
        maxRedirects: 5,
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        }
      });

      const resolvedUrl = response.request?.res?.responseUrl ||
                          response.request?.responseURL ||
                          response.headers?.location;

      if (resolvedUrl && resolvedUrl.includes('instagram.com')) {
        return this.normalizeUrl(resolvedUrl);
      }

      // Fallback: try GET request
      const getResponse = await axios.get(shortUrl, {
        maxRedirects: 5,
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        }
      });

      const finalUrl = getResponse.request?.res?.responseUrl ||
                       getResponse.request?.responseURL;

      if (finalUrl && finalUrl.includes('instagram.com')) {
        return this.normalizeUrl(finalUrl);
      }

      return shortUrl;
    } catch (error) {
      console.error('Failed to resolve Instagram short URL:', error);
      return shortUrl;
    }
  }

  /**
   * Ensure we have a full URL (resolve if short)
   */
  async getFullUrl(url: string): Promise<string> {
    const normalizedUrl = this.normalizeUrl(url);

    if (this.isShortUrl(url)) {
      console.log('Resolving short Instagram URL:', url);
      const resolved = await this.resolveShortUrl(url);
      console.log('Resolved to:', resolved);
      return resolved;
    }

    return normalizedUrl;
  }

  // ============================================
  // METADATA EXTRACTION
  // ============================================

  /**
   * Get video metadata using oEmbed API (free, official)
   */
  async getVideoMetadata(videoUrl: string): Promise<InstagramVideoMetadata> {
    try {
      // First, resolve short URLs to full URLs
      const fullUrl = await this.getFullUrl(videoUrl);
      const mediaType = this.getMediaType(fullUrl);

      // Instagram's official oEmbed endpoint
      const oEmbedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(fullUrl)}`;

      const response = await axios.get(oEmbedUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; RecipeApp/1.0)',
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
          mediaId: this.extractMediaId(fullUrl) || undefined,
          title: data.title || '',
          description: data.title || '',
          author: data.author_name || '',
          authorUsername,
          thumbnailUrl: data.thumbnail_url || '',
          mediaType: mediaType || undefined,
          hashtags,
          resolvedUrl: fullUrl,
        };
      }

      return {
        success: false,
        error: 'No metadata available for this post',
      };
    } catch (error) {
      console.error('Failed to get Instagram metadata:', error);

      // Try to return basic metadata even if oEmbed fails
      const fullUrl = await this.getFullUrl(videoUrl);
      const basicMetadata = this.getBasicMetadataFromUrl(fullUrl);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            ...basicMetadata,
            success: false,
            error: 'Request timeout - please try again',
          };
        }

        if (error.response?.status === 404) {
          return {
            ...basicMetadata,
            success: false,
            error: 'Post not found or is private',
          };
        }

        if (error.response?.status === 400) {
          return {
            ...basicMetadata,
            success: false,
            error: 'Invalid Instagram URL',
          };
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          return {
            ...basicMetadata,
            success: false,
            error: 'This post is from a private account or requires login to view',
          };
        }
      }

      return {
        ...basicMetadata,
        success: false,
        error: 'Failed to fetch post information. The post may be private or unavailable.',
      };
    }
  }

  /**
   * Fallback: Build metadata from URL when oEmbed fails
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
      resolvedUrl: videoUrl,
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
   */
  getThumbnailUrl(thumbnailUrl: string): string {
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
