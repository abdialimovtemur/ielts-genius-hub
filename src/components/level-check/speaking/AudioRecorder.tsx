// components/speaking/AudioRecorder.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  questionIndex: number;
  question: string;
  instructions: string;
  guidance: string;
  isSubmitting: boolean;
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  questionIndex, 
  question, 
  instructions, 
  guidance,
  isSubmitting 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [hasRecorded, setHasRecorded] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        setAudioChunks(chunks);
        onRecordingComplete(audioBlob);
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
      setHasRecorded(true);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedAudio && audioRef.current) {
      const audioURL = URL.createObjectURL(recordedAudio);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-primary mb-4">Question {questionIndex + 1}</h3>
      
      <div className="mb-4">
        <p className="font-medium text-lg mb-2">{question}</p>
        <p className="text-sm text-muted-foreground mb-2">{instructions}</p>
        <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">{guidance}</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-primary hover:bg-primary/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded mr-2"></div>
                Stop Recording
              </div>
            ) : (
              'Start Recording'
            )}
          </button>

          {recordedAudio && !isRecording && (
            <button
              onClick={playRecording}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Play Back
            </button>
          )}
        </div>

        {isRecording && (
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatTime(recordingTime)}</div>
            <div className="text-sm text-muted-foreground">Recording time</div>
          </div>
        )}

        {hasRecorded && !isRecording && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Recording duration: {formatTime(recordingTime)}
            </div>
          </div>
        )}

        <audio ref={audioRef} className="hidden" />
      </div>

      {!hasRecorded && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800 text-center">
            Please record your answer for this question before proceeding.
          </p>
        </div>
      )}
    </div>
  );
}