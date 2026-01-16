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
      /instagram\.com\/reel\/[\w-]+/i,
      /instagram\.com\/reels\/[\w-]+/i,
      /instagram\.com\/p\/[\w-]+/i,
      /instagram\.com\/tv\/[\w-]+/i,
      /instagr\.am\/p\/[\w-]+/i,
      /instagr\.am\/reel\/[\w-]+/i,
      /instagr\.am\/reels\/[\w-]+/i,
      /instagram\.com\/share\/[\w-]+/i,
      /instagram\.com\/stories\/[\w.-]+\/\d+/i,
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
      const reelMatch = url.match(/instagram\.com\/reels?\/([\w-]+)/i);
      if (reelMatch?.[1]) return reelMatch[1];

      const postMatch = url.match(/instagram\.com\/p\/([\w-]+)/i);
      if (postMatch?.[1]) return postMatch[1];

      const tvMatch = url.match(/instagram\.com\/tv\/([\w-]+)/i);
      if (tvMatch?.[1]) return tvMatch[1];

      const shortPostMatch = url.match(/instagr\.am\/p\/([\w-]+)/i);
      if (shortPostMatch?.[1]) return shortPostMatch[1];

      const shortReelMatch = url.match(/instagr\.am\/reels?\/([\w-]+)/i);
      if (shortReelMatch?.[1]) return shortReelMatch[1];

      const shareMatch = url.match(/instagram\.com\/share\/([\w-]+)/i);
      if (shareMatch?.[1]) return shareMatch[1];

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
   * Normalize Instagram URL
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

  async resolveShortUrl(shortUrl: string): Promise<string> {
    try {
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

      return shortUrl;
    } catch (error) {
      console.error('Failed to resolve Instagram short URL:', error);
      return shortUrl;
    }
  }

  async getFullUrl(url: string): Promise<string> {
    if (this.isShortUrl(url)) {
      console.log('Resolving short Instagram URL:', url);
      const resolved = await this.resolveShortUrl(url);
      console.log('Resolved to:', resolved);
      return resolved;
    }
    return this.normalizeUrl(url);
  }

  // ============================================
  // METADATA EXTRACTION - SCRAPE META TAGS
  // ============================================

  /**
   * Get video metadata by scraping the Instagram page
   * Instagram's oEmbed API no longer works reliably, so we scrape meta tags
   */
  async getVideoMetadata(videoUrl: string): Promise<InstagramVideoMetadata> {
    try {
      const fullUrl = await this.getFullUrl(videoUrl);
      const mediaType = this.getMediaType(fullUrl);

      // Fetch the Instagram page HTML
      const response = await axios.get(fullUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        maxRedirects: 5,
      });

      const html = response.data;

      // Extract meta tags from HTML
      const metadata = this.extractMetaTagsFromHtml(html, fullUrl);

      if (metadata.description || metadata.title) {
        return {
          success: true,
          mediaId: this.extractMediaId(fullUrl) || undefined,
          title: metadata.title || '',
          description: metadata.description || '',
          author: metadata.author || '',
          authorUsername: metadata.authorUsername || '',
          thumbnailUrl: metadata.thumbnailUrl || '',
          mediaType: mediaType || undefined,
          hashtags: this.extractHashtags(metadata.description || ''),
          resolvedUrl: fullUrl,
        };
      }

      // If scraping didn't work, return basic metadata
      return this.getBasicMetadataFromUrl(fullUrl);

    } catch (error) {
      console.error('Failed to get Instagram metadata:', error);

      const fullUrl = await this.getFullUrl(videoUrl);
      const basicMetadata = this.getBasicMetadataFromUrl(fullUrl);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            ...basicMetadata,
            success: false,
            error: 'Post not found or is private',
          };
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          return {
            ...basicMetadata,
            success: false,
            error: 'This post is from a private account',
          };
        }
      }

      return {
        ...basicMetadata,
        success: false,
        error: 'Failed to fetch post information. Try providing the recipe details manually.',
      };
    }
  }

  /**
   * Extract metadata from HTML meta tags
   */
  private extractMetaTagsFromHtml(html: string, url: string): {
    title?: string;
    description?: string;
    author?: string;
    authorUsername?: string;
    thumbnailUrl?: string;
  } {
    const result: {
      title?: string;
      description?: string;
      author?: string;
      authorUsername?: string;
      thumbnailUrl?: string;
    } = {};

    try {
      // Extract og:description - this contains the caption
      const ogDescriptionMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i) ||
                                  html.match(/content="([^"]*)"[^>]*property="og:description"/i);
      if (ogDescriptionMatch?.[1]) {
        // Decode HTML entities
        let description = ogDescriptionMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#x27;/g, "'")
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
          .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));

        // Remove the "X likes, Y comments - username on Date:" prefix
        const captionMatch = description.match(/:\s*[""](.*)[""]$/s) ||
                            description.match(/:\s*["'](.*)["']$/s) ||
                            description.match(/:\s*(.*)$/s);

        if (captionMatch?.[1]) {
          description = captionMatch[1].trim();
        }

        result.description = description;
      }

      // Extract og:title
      const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i) ||
                          html.match(/content="([^"]*)"[^>]*property="og:title"/i);
      if (ogTitleMatch?.[1]) {
        result.title = ogTitleMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
      }

      // Extract og:image for thumbnail
      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
                          html.match(/content="([^"]*)"[^>]*property="og:image"/i);
      if (ogImageMatch?.[1]) {
        result.thumbnailUrl = ogImageMatch[1].replace(/&amp;/g, '&');
      }

      // Extract author from og:url or the page
      const ogUrlMatch = html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]*)"/i);
      if (ogUrlMatch?.[1]) {
        const authorMatch = ogUrlMatch[1].match(/instagram\.com\/([^\/]+)\/(?:p|reel|reels|tv)\//i);
        if (authorMatch?.[1]) {
          result.authorUsername = authorMatch[1];
          result.author = authorMatch[1];
        }
      }

      // Try to get author from URL if not found in meta
      if (!result.authorUsername) {
        const urlAuthorMatch = url.match(/instagram\.com\/([^\/]+)\/(?:p|reel|reels|tv)\//i);
        if (urlAuthorMatch?.[1]) {
          result.authorUsername = urlAuthorMatch[1];
          result.author = urlAuthorMatch[1];
        }
      }

    } catch (error) {
      console.error('Error extracting meta tags:', error);
    }

    return result;
  }

  /**
   * Fallback: Build metadata from URL when scraping fails
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

  extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0600-\u06FF]+/g;
    const matches = text.match(hashtagRegex);
    if (!matches) return [];
    return [...new Set(matches.map(tag => tag.toLowerCase()))];
  }

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

  getThumbnailUrl(thumbnailUrl: string): string {
    return thumbnailUrl;
  }
}

// Export singleton instance
export const instagramService = new InstagramService();

// Export class for testing
export default InstagramService;

export const isInstagramUrl = (url: string): boolean => {
  return instagramService.isInstagramUrl(url);
};

export const getInstagramThumbnail = (thumbnailUrl: string): string => {
  return instagramService.getThumbnailUrl(thumbnailUrl);
};
