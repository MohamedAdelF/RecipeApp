import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null,
  });

  // Note: Full voice recognition requires native modules
  // This is a simplified version using text-to-speech for feedback

  const speak = useCallback((text: string, options?: Speech.SpeechOptions) => {
    return Speech.speak(text, {
      language: 'en-US',
      rate: 0.9,
      ...options,
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  const isSpeaking = useCallback(async () => {
    return Speech.isSpeakingAsync();
  }, []);

  return {
    ...state,
    speak,
    stop,
    isSpeaking,
  };
}
