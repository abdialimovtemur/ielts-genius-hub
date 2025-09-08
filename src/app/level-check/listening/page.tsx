// app/level-checker/listening/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useListeningTestQuery } from "@/api/queries/listening";
import { ListeningSubmission, ListeningEvaluation, ApiError } from "@/types/listening";
import { useSubmitListeningTestMutation } from "@/api/mutations/listening";
import ErrorDisplay from "@/components/level-check/reading/ErrorDisplay";
import LoadingSpinner from "@/components/level-check/reading/LoadingSpinner";
import ListeningResults from "@/components/level-check/listening/ListeningResults";
import AudioPlayer from "@/components/level-check/listening/AudioPlayer";
import QuestionsList from "@/components/level-check/listening/QuestionsList";

export default function LevelCheckListening() {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<ListeningEvaluation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  
  const { 
    data: testData, 
    refetch: getNewTest, 
    isFetching, 
    error: queryError,
    isError: isQueryError 
  } = useListeningTestQuery();
  
  const { 
    mutate: submitTest, 
    isPending: isSubmitting, 
    error: mutationError,
    isError: isMutationError 
  } = useSubmitListeningTestMutation();

  // Initialize test on component mount
  useEffect(() => {
    getNewTest();
  }, [getNewTest]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
      setTimeSpent(Math.floor((seconds + 1) / 60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [seconds]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    setHasPlayedAudio(true);
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (!testData || userAnswers.length !== testData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    const submission: ListeningSubmission = {
      testId: testData.testId,
      userAnswers,
      timeSpent
    };
    
    submitTest(submission, {
      onSuccess: (data) => {
        setEvaluation(data);
        setIsSubmitted(true);
      }
    });
  };

  const handleRestart = () => {
    setUserAnswers([]);
    setSeconds(0);
    setTimeSpent(0);
    setIsSubmitted(false);
    setEvaluation(null);
    setIsPlaying(false);
    setHasPlayedAudio(false);
    getNewTest();
  };

  // Handle query errors
  if (isQueryError) {
    return <ErrorDisplay error={queryError as ApiError} onRetry={getNewTest} />;
  }

  // Handle mutation errors
  if (isMutationError) {
    return (
      <ErrorDisplay 
        error={mutationError as ApiError} 
        onRetry={() => {
          if (testData) {
            const submission: ListeningSubmission = {
              testId: testData.testId,
              userAnswers,
              timeSpent
            };
            submitTest(submission);
          }
        }} 
      />
    );
  }

  // Show loading spinner
  if (isFetching) {
    return <LoadingSpinner />;
  }

  // Show results if submitted
  if (isSubmitted && evaluation) {
    return <ListeningResults evaluation={evaluation} onRestart={handleRestart} />;
  }

  // Show listening test
  if (testData) {
    return (
      <div className="min-h-screen bg-secondary/20 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">IELTS Listening Level Check</h1>
            <p className="text-muted-foreground">
              Listen to the audio and answer the questions below
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              Time: <span className="font-medium">
                {Math.floor(seconds / 60).toString().padStart(2, '0')}:
                {(seconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <AudioPlayer 
            text={testData.listeningText} 
            isPlaying={isPlaying}
            onPlay={handlePlayAudio}
            onPause={handlePauseAudio}
          />
          
          <QuestionsList
            testData={testData}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            hasPlayedAudio={hasPlayedAudio}
          />

          {isSubmitting && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Evaluating your answers...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback to loading
  return <LoadingSpinner />;
}