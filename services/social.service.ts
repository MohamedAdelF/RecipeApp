// ============================================
// SOCIAL SERVICE - Unified Platform Orchestrator
// ============================================

import { tiktokService, TikTokVideoMetadata } from './tiktok.service';
import { instagramService, InstagramVideoMetadata } from './instagram.service';
import { youtubeService, isYouTubeUrl } from './youtube.service';
import { aiService } from './ai.service';
import type { ExtractedRecipe, RecipeSourceType } from '@/utils/types';

// ============================================
// TYPES
// ============================================

export type SocialPlatform = 'youtube' | 'tiktok' | 'instagram' | 'unknown';

export interface SocialVideoMetadata {
  platform: SocialPlatform;
  videoId?: string;
  title?: string;
  description?: string;
  author?: string;
  thumbnailUrl?: string;
  hashtags?: string[];
}

export interface ExtractionResult {
  success: boolean;
  recipe?: ExtractedRecipe;
  metadata?: SocialVideoMetadata;
  extractionMethod?: 'transcript' | 'description' | 'vision' | 'manual';
  error?: string;
  needsManualInput?: boolean;
  insufficientData?: boolean;
}

export interface ExtractionProgress {
  stage: string;
  progress: number;
  platform: SocialPlatform;
}

type ProgressCallback = (progress: ExtractionProgress) => void;

// ============================================
// SOCIAL SERVICE CLASS
// ============================================

class SocialService {

  // ============================================
  // PLATFORM DETECTION
  // ============================================

  /**
   * Detect which platform a URL belongs to
   */
  detectPlatform(url: string): SocialPlatform {
    if (!url || typeof url !== 'string') {
      return 'unknown';
    }

    const trimmedUrl = url.trim();

    if (isYouTubeUrl(trimmedUrl)) {
      return 'youtube';
    }

    if (tiktokService.isTikTokUrl(trimmedUrl)) {
      return 'tiktok';
    }

    if (instagramService.isInstagramUrl(trimmedUrl)) {
      return 'instagram';
    }

    return 'unknown';
  }

  /**
   * Check if URL is from a supported platform
   */
  isSupportedUrl(url: string): boolean {
    return this.detectPlatform(url) !== 'unknown';
  }

  /**
   * Get platform display name
   */
  getPlatformDisplayName(platform: SocialPlatform): string {
    const names: Record<SocialPlatform, string> = {
      youtube: 'YouTube',
      tiktok: 'TikTok',
      instagram: 'Instagram',
      unknown: 'Unknown',
    };
    return names[platform];
  }

  /**
   * Get source type for database storage
   */
  getSourceType(platform: SocialPlatform): RecipeSourceType {
    if (platform === 'youtube') return 'youtube';
    if (platform === 'tiktok') return 'tiktok';
    if (platform === 'instagram') return 'instagram';
    return 'manual';
  }

  // ============================================
  // METADATA EXTRACTION
  // ============================================

  /**
   * Get video metadata from any supported platform
   */
  async getVideoMetadata(url: string): Promise<SocialVideoMetadata | null> {
    const platform = this.detectPlatform(url);

    try {
      switch (platform) {
        case 'youtube': {
          const videoId = youtubeService.extractVideoId(url);
          if (!videoId) return null;

          try {
            const metadata = await youtubeService.getVideoMetadata(url);
            return {
              platform: 'youtube',
              videoId,
              title: metadata.title,
              author: metadata.author,
              thumbnailUrl: metadata.thumbnail,
            };
          } catch {
            // Return basic metadata if full fetch fails
            return {
              platform: 'youtube',
              videoId,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            };
          }
        }

        case 'tiktok': {
          const result = await tiktokService.getVideoMetadata(url);
          if (!result.success) return null;

          return {
            platform: 'tiktok',
            videoId: result.videoId,
            title: result.title,
            description: result.description,
            author: result.author,
            thumbnailUrl: result.thumbnailUrl,
            hashtags: result.hashtags,
          };
        }

        case 'instagram': {
          const result = await instagramService.getVideoMetadata(url);
          if (!result.success) {
            // Use basic metadata as fallback
            const basic = instagramService.getBasicMetadataFromUrl(url);
            return {
              platform: 'instagram',
              videoId: basic.mediaId,
            };
          }

          return {
            platform: 'instagram',
            videoId: result.mediaId,
            title: result.title,
            description: result.description,
            author: result.author,
            thumbnailUrl: result.thumbnailUrl,
            hashtags: result.hashtags,
          };
        }

        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to get metadata for ${platform}:`, error);
      return null;
    }
  }

  // ============================================
  // RECIPE EXTRACTION
  // ============================================

  /**
   * Extract recipe from any supported platform URL
   * Uses 3-tier fallback strategy:
   * 1. Transcript/Description extraction
   * 2. AI Vision analysis (if available)
   * 3. Manual input with AI assist
   */
  async extractRecipe(
    url: string,
    onProgress?: ProgressCallback
  ): Promise<ExtractionResult> {
    const platform = this.detectPlatform(url);

    if (platform === 'unknown') {
      return {
        success: false,
        error: 'Unsupported URL. Please use a YouTube, TikTok, or Instagram link.',
      };
    }

    const updateProgress = (stage: string, progress: number) => {
      onProgress?.({ stage, progress, platform });
    };

    try {
      // YouTube uses transcript-based extraction
      if (platform === 'youtube') {
        return await this.extractFromYouTube(url, updateProgress);
      }

      // TikTok and Instagram use description-based extraction
      if (platform === 'tiktok' || platform === 'instagram') {
        return await this.extractFromSocialMedia(url, platform, updateProgress);
      }

      return {
        success: false,
        error: 'Platform not supported',
      };
    } catch (error: any) {
      console.error(`Recipe extraction failed for ${platform}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to extract recipe',
      };
    }
  }

  /**
   * Extract recipe from YouTube using transcript
   */
  private async extractFromYouTube(
    url: string,
    updateProgress: (stage: string, progress: number) => void
  ): Promise<ExtractionResult> {
    updateProgress('Connecting to video...', 10);

    const videoId = youtubeService.extractVideoId(url);
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    updateProgress('Fetching transcript...', 25);

    const transcriptResult = await youtubeService.getTranscript(url);

    if (!transcriptResult.success || !transcriptResult.transcript) {
      return {
        success: false,
        error: transcriptResult.error || 'Could not get transcript',
        needsManualInput: true,
      };
    }

    updateProgress('Analyzing recipe...', 50);

    const recipe = await aiService.extractRecipeFromTranscript(transcriptResult.transcript);

    updateProgress('Finalizing...', 90);

    return {
      success: true,
      recipe,
      metadata: {
        platform: 'youtube',
        videoId,
        title: transcriptResult.metadata?.title,
        thumbnailUrl: transcriptResult.metadata?.thumbnail,
      },
      extractionMethod: 'transcript',
    };
  }

  /**
   * Extract recipe from TikTok or Instagram using description
   */
  private async extractFromSocialMedia(
    url: string,
    platform: 'tiktok' | 'instagram',
    updateProgress: (stage: string, progress: number) => void
  ): Promise<ExtractionResult> {
    const platformName = this.getPlatformDisplayName(platform);

    updateProgress(`Connecting to ${platformName}...`, 10);

    // Get video metadata
    const metadata = await this.getVideoMetadata(url);

    if (!metadata) {
      return {
        success: false,
        error: `Could not access ${platformName} video. It may be private or unavailable.`,
        needsManualInput: true,
      };
    }

    updateProgress('Analyzing description...', 30);

    // Check if we have enough data from description
    const description = metadata.description || metadata.title || '';
    const hashtags = metadata.hashtags || [];

    // If description is very short, we may need manual input or vision
    if (description.length < 50 && hashtags.length < 3) {
      updateProgress('Insufficient data detected...', 40);

      return {
        success: false,
        metadata,
        error: 'Not enough information in the video description to extract a recipe.',
        needsManualInput: true,
        insufficientData: true,
      };
    }

    updateProgress('Extracting recipe from description...', 50);

    try {
      // Use AI to extract recipe from description
      const recipe = await aiService.extractRecipeFromDescription(
        description,
        hashtags
      );

      // Validate the extracted recipe
      if (!recipe || !recipe.title || !recipe.ingredients || recipe.ingredients.length === 0) {
        return {
          success: false,
          metadata,
          error: 'Could not extract a complete recipe from the description.',
          needsManualInput: true,
          insufficientData: true,
        };
      }

      updateProgress('Finalizing...', 90);

      return {
        success: true,
        recipe,
        metadata,
        extractionMethod: 'description',
      };
    } catch (error: any) {
      console.error('Description extraction failed:', error);

      // Return with manual input flag
      return {
        success: false,
        metadata,
        error: 'Could not extract recipe automatically. Please provide additional details.',
        needsManualInput: true,
      };
    }
  }

  /**
   * Extract recipe using vision analysis of video frames/thumbnail
   * This is a fallback when description extraction fails
   */
  async extractRecipeFromVision(
    thumbnailUrl: string,
    metadata?: SocialVideoMetadata,
    onProgress?: ProgressCallback
  ): Promise<ExtractionResult> {
    const platform = metadata?.platform || 'unknown';

    onProgress?.({
      stage: 'Analyzing video thumbnail...',
      progress: 30,
      platform,
    });

    try {
      // Use AI vision to analyze the thumbnail
      const recipe = await aiService.extractRecipeFromVideoFrames(
        [thumbnailUrl],
        metadata
      );

      if (!recipe || !recipe.title) {
        return {
          success: false,
          error: 'Could not identify recipe from video thumbnail.',
          needsManualInput: true,
        };
      }

      onProgress?.({
        stage: 'Finalizing...',
        progress: 90,
        platform,
      });

      return {
        success: true,
        recipe,
        metadata,
        extractionMethod: 'vision',
      };
    } catch (error: any) {
      console.error('Vision extraction failed:', error);
      return {
        success: false,
        error: 'Vision analysis failed. Please provide recipe details manually.',
        needsManualInput: true,
      };
    }
  }

  /**
   * Extract recipe with manual description input
   * User provides the recipe description/ingredients
   */
  async extractRecipeFromManualInput(
    userDescription: string,
    metadata?: SocialVideoMetadata,
    onProgress?: ProgressCallback
  ): Promise<ExtractionResult> {
    const platform = metadata?.platform || 'unknown';

    onProgress?.({
      stage: 'Processing your input...',
      progress: 30,
      platform,
    });

    try {
      const hashtags = metadata?.hashtags || [];

      const recipe = await aiService.extractRecipeFromDescription(
        userDescription,
        hashtags
      );

      if (!recipe || !recipe.title || !recipe.ingredients || recipe.ingredients.length === 0) {
        return {
          success: false,
          error: 'Could not extract a recipe from the provided description. Please include ingredients and cooking steps.',
        };
      }

      onProgress?.({
        stage: 'Finalizing...',
        progress: 90,
        platform,
      });

      return {
        success: true,
        recipe,
        metadata,
        extractionMethod: 'manual',
      };
    } catch (error: any) {
      console.error('Manual input extraction failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to process recipe description.',
      };
    }
  }
}

// Export singleton instance
export const socialService = new SocialService();

// Export class for testing
export default SocialService;
