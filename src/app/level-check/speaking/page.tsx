// app/level-checker/speaking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSpeakingTestQuery } from "@/api/queries/speaking";
import { SpeakingTest, SpeakingSubmission, SpeakingEvaluation, ApiError } from "@/types/speaking";
import { useSubmitSpeakingTestMutation } from "@/api/mutations/speaking";
import ErrorDisplay from "@/components/level-check/reading/ErrorDisplay";
import LoadingSpinner from "@/components/level-check/reading/LoadingSpinner";
import SpeakingResults from "@/components/level-check/speaking/SpeakingResults";
import AudioRecorder from "@/components/level-check/speaking/AudioRecorder";

export default function LevelCheckSpeaking() {
  const [recordedAudios, setRecordedAudios] = useState<Blob[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [allQuestionsRecorded, setAllQuestionsRecorded] = useState(false);
  
  const { 
    data: testData, 
    refetch: getNewTest, 
    isFetching, 
    error: queryError,
    isError: isQueryError 
  } = useSpeakingTestQuery();
  
  const { 
    mutate: submitTest, 
    isPending: isSubmitting, 
    error: mutationError,
    isError: isMutationError 
  } = useSubmitSpeakingTestMutation();

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

  useEffect(() => {
    if (testData && recordedAudios.length === testData.questions.length) {
      setAllQuestionsRecorded(true);
    } else {
      setAllQuestionsRecorded(false);
    }
  }, [recordedAudios, testData]);

  const handleRecordingComplete = (questionIndex: number, audioBlob: Blob) => {
    const newRecordedAudios = [...recordedAudios];
    newRecordedAudios[questionIndex] = audioBlob;
    setRecordedAudios(newRecordedAudios);
  };

  const handleSubmit = async () => {
    if (!testData || !allQuestionsRecorded) {
      alert("Please record answers for all questions before submitting.");
      return;
    }

    // Convert Blobs to Files
    const audioFiles = recordedAudios.map((blob, index) => {
      return new File([blob], `question-${index + 1}.webm`, { type: 'audio/webm' });
    });

    const submission: SpeakingSubmission = {
      testId: testData.testId,
      audioFiles,
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
    setRecordedAudios([]);
    setSeconds(0);
    setTimeSpent(0);
    setIsSubmitted(false);
    setEvaluation(null);
    setAllQuestionsRecorded(false);
    getNewTest();
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
          if (testData && allQuestionsRecorded) {
            const audioFiles = recordedAudios.map((blob, index) => {
              return new File([blob], `question-${index + 1}.webm`, { type: 'audio/webm' });
            });
            
            const submission: SpeakingSubmission = {
              testId: testData.testId,
              audioFiles,
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
    return <SpeakingResults evaluation={evaluation} onRestart={handleRestart} />;
  }

  // Show speaking test
  if (testData) {
    return (
      <div className="min-h-screen bg-secondary/20 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">IELTS Speaking Level Check</h1>
            <p className="text-muted-foreground">
              Record your answers to the following questions
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              Time: <span className="font-medium">{formatTime(seconds)}</span>
            </div>
          </div>

          <div className="space-y-6">
            {testData.questions.map((question, index) => (
              <AudioRecorder
                key={index}
                questionIndex={index}
                question={question.question}
                instructions={question.instructions}
                guidance={question.guidance}
                onRecordingComplete={(audioBlob) => handleRecordingComplete(index, audioBlob)}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !allQuestionsRecorded}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit All Answers"
              )}
            </button>
          </div>

          {isSubmitting && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Evaluating your speaking...</p>
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