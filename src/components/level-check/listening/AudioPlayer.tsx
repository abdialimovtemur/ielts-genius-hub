// components/listening/AudioPlayer.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  text: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export default function AudioPlayer({ text, isPlaying, onPlay, onPause }: AudioPlayerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        if (voices.length > 0) {
          setVoicesLoaded(true);
        }
      };

      // Voices might be loaded already
      loadVoices();
      
      // Listen for voices loaded event
      if (synthRef.current) {
        synthRef.current.addEventListener('voiceschanged', loadVoices);
      }

      return () => {
        if (synthRef.current) {
          synthRef.current.removeEventListener('voiceschanged', loadVoices);
        }
      };
    } else {
      setError("Your browser doesn't support speech synthesis");
    }
  }, []);

  const createUtterance = () => {
    if (!synthRef.current || !text || !voicesLoaded) return null;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice tanlash (English voice topish)
    const voices = synthRef.current.getVoices();
    let englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.localService === false
    );
    
    // Agar preferred voice topilmasa, boshqa English voice qidirish
    if (!englishVoice) {
      englishVoice = voices.find(voice => voice.lang.includes('en'));
    }
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.lang = 'en-US';
    utterance.rate = 0.85; // IELTS listening speed ga yaqinroq
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => {
      setIsLoading(false);
      setError(null);
      console.log('Speech started');
    };

    utterance.onend = () => {
      console.log('Speech ended');
      onPause();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setError(`Speech synthesis error: ${event.error}`);
      setIsLoading(false);
      onPause();
    };

    return utterance;
  };

  useEffect(() => {
    if (!synthRef.current || !voicesLoaded) return;

    const synth = synthRef.current;

    if (isPlaying) {
      // Cancel any existing speech
      synth.cancel();
      
      // Create new utterance
      const utterance = createUtterance();
      if (utterance) {
        utteranceRef.current = utterance;
        setIsLoading(true);
        
        // Small delay to ensure cancellation
        setTimeout(() => {
          try {
            synth.speak(utterance);
          } catch (err) {
            console.error('Error speaking:', err);
            setError(`Failed to play audio: ${err}`);
            setIsLoading(false);
            onPause();
          }
        }, 100);
      }
    } else {
      // Stop speaking
      synth.cancel();
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      synth.cancel();
    };
  }, [isPlaying, voicesLoaded, text]);

  const handleTogglePlay = () => {
    if (isLoading || !voicesLoaded) return;
    
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleStop = () => {
    if (synthRef.current && (synthRef.current.speaking || synthRef.current.pending)) {
      synthRef.current.cancel();
    }
    onPause();
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
        <p className="text-yellow-800">
          Your browser does not support text-to-speech functionality. 
          Please use Chrome, Edge, or Safari for the best experience.
        </p>
      </div>
    );
  }

  if (!voicesLoaded) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Listening Audio</h2>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading voices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Listening Audio</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handleTogglePlay}
          disabled={!text || isLoading || !voicesLoaded}
          className="bg-primary text-primary-foreground rounded-full p-4 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="bg-destructive text-destructive-foreground rounded-full p-3 hover:bg-destructive/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Status: {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Ready to play'}
        </p>
        <p className="text-xs text-muted-foreground">
          Click play to listen. The audio will play at IELTS listening speed.
        </p>
      </div>

      {/* Progress indicator */}
      {isPlaying && (
        <div className="mt-4 bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" />
        </div>
      )}
    </div>
  );
}