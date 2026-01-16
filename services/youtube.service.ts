// ============================================
// YOUTUBE SERVICE - Transcript Extraction
// ============================================

import axios from 'axios';

interface YouTubeTranscriptResponse {
  success: boolean;
  transcript?: string;
  error?: string;
  metadata?: {
    title: string;
    thumbnail: string;
    duration: number;
  };
}

class YouTubeService {
  
  // ============================================
  // EXTRACT VIDEO ID FROM URL
  // ============================================
  extractVideoId(url: string): string | null {
    try {
      // Handle various YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        /youtube\.com\/embed\/([^&\s]+)/,
        /youtube\.com\/v\/([^&\s]+)/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to extract video ID:', error);
      return null;
    }
  }

  // ============================================
  // GET TRANSCRIPT FROM YOUTUBE
  // ============================================
  async getTranscript(videoUrl: string): Promise<YouTubeTranscriptResponse> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      
      if (!videoId) {
        return {
          success: false,
          error: 'Invalid YouTube URL'
        };
      }

      // Option 1: Use youtube-transcript npm package (server-side)
      // Option 2: Use external API service (more reliable for production)
      
      // Use self-hosted transcript API if provided, fallback to public endpoint
      const transcriptApiUrl =
        process.env.EXPO_PUBLIC_TRANSCRIPT_API_URL ||
        'https://youtube-transcript-api.vercel.app/api/transcript';

      const response = await axios.get(transcriptApiUrl, {
        params: { videoId },
        timeout: 30000 // 30 seconds
      });

      if (response.data && response.data.transcript) {
        // Clean up transcript
        const cleanTranscript = this.cleanTranscript(response.data.transcript);
        
        return {
          success: true,
          transcript: cleanTranscript,
          metadata: {
            title: response.data.title || '',
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            duration: response.data.duration || 0
          }
        };
      }

      return {
        success: false,
        error: 'No transcript available for this video'
      };
      
    } catch (error) {
      console.error('Failed to get transcript:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Request timeout - video may be too long'
          };
        }
        
        if (error.response?.status === 404) {
          return {
            success: false,
            error: 'Transcript not available for this video'
          };
        }
      }
      
      return {
        success: false,
        error: 'Failed to extract transcript. Please try another video.'
      };
    }
  }

  // ============================================
  // CLEAN TRANSCRIPT TEXT
  // ============================================
  private cleanTranscript(transcript: string | any[]): string {
    try {
      let text = '';
      
      // If transcript is array of segments
      if (Array.isArray(transcript)) {
        text = transcript
          .map(segment => {
            if (typeof segment === 'object' && segment.text) {
              return segment.text;
            }
            return segment;
          })
          .join(' ');
      } else {
        text = String(transcript);
      }
      
      // Clean up the text
      text = text
        .replace(/\[Music\]/gi, '')
        .replace(/\[Applause\]/gi, '')
        .replace(/\[Laughter\]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      return text;
    } catch (error) {
      console.error('Failed to clean transcript:', error);
      return String(transcript);
    }
  }

  // ============================================
  // GET VIDEO METADATA (without transcript)
  // ============================================
  async getVideoMetadata(videoUrl: string): Promise<any> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // For production, use YouTube Data API
      // For MVP, we can use oEmbed endpoint (no API key needed)
      const response = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      return {
        title: response.data.title,
        author: response.data.author_name,
        thumbnail: response.data.thumbnail_url,
        videoId
      };
      
    } catch (error) {
      console.error('Failed to get video metadata:', error);
      throw error;
    }
  }

  // ============================================
  // ALTERNATIVE: Manual Transcript Input
  // ============================================
  validateTranscript(transcript: string): {
    isValid: boolean;
    wordCount: number;
    estimatedMinutes: number;
  } {
    const cleaned = transcript.trim();
    const wordCount = cleaned.split(/\s+/).length;
    const estimatedMinutes = Math.ceil(wordCount / 150); // Average speaking rate
    
    return {
      isValid: wordCount >= 50, // Minimum 50 words for a recipe
      wordCount,
      estimatedMinutes
    };
  }

  // ============================================
  // FALLBACK: Extract from Video Description
  // ============================================
  async getVideoDescription(videoId: string): Promise<string | null> {
    try {
      // This would require YouTube Data API
      // For MVP, we skip this or use external service
      return null;
    } catch (error) {
      console.error('Failed to get video description:', error);
      return null;
    }
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService();

// Export class for testing
export default YouTubeService;

// ============================================
// HELPER: Detect if URL is YouTube
// ============================================
export const isYouTubeUrl = (url: string): boolean => {
  return /(?:youtube\.com|youtu\.be)/.test(url);
};

// ============================================
// HELPER: Get thumbnail from video ID
// ============================================
export const getYouTubeThumbnail = (videoId: string, quality: 'max' | 'high' | 'medium' | 'default' = 'max'): string => {
  const qualityMap = {
    max: 'maxresdefault',
    high: 'hqdefault',
    medium: 'mqdefault',
    default: 'default'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};
