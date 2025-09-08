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
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!synthRef.current || !text) return;

    // Clean up any existing utterance
    if (utteranceRef.current) {
      synthRef.current.cancel();
    }

    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.lang = 'en-US';
    utteranceRef.current.rate = 0.9; // Slightly slower for better comprehension
    utteranceRef.current.pitch = 1;
    utteranceRef.current.volume = 1;

    utteranceRef.current.onend = () => {
      onPause();
    };

    utteranceRef.current.onerror = () => {
      onPause();
    };
  }, [text, onPause]);

  useEffect(() => {
    if (!synthRef.current || !utteranceRef.current) return;

    if (isPlaying) {
      synthRef.current.speak(utteranceRef.current);
    } else {
      synthRef.current.cancel();
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          Your browser does not support text-to-speech functionality. 
          Please use Chrome, Edge, or Safari for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Listening Audio</h2>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handleTogglePlay}
          disabled={!text}
          className="bg-primary text-primary-foreground rounded-full p-4 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: isPlaying ? '100%' : '0%' }}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Click the play button to listen to the audio. You can only play it once during the test.
        </p>
      </div>
    </div>
  );
}