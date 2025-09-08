// app/level-checker/reading/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useReadingTestQuery } from "@/api/queries/reading";
import { ReadingTest, ReadingSubmission, ReadingEvaluation, ApiError } from "@/types/reading";
import { useSubmitReadingTestMutation } from "@/api/mutations/reading";
import ErrorDisplay from "@/components/level-check/reading/ErrorDisplay";
import LoadingSpinner from "@/components/level-check/reading/LoadingSpinner";
import ReadingResults from "@/components/level-check/reading/ReadingResults";
import ReadingPassage from "@/components/level-check/reading/ReadingPassage";
import QuestionsList from "@/components/level-check/reading/QuestionsList";

export default function LevelCheckReading() {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<ReadingEvaluation | null>(null);
  
  const { 
    data: testData, 
    refetch: getNewTest, 
    isFetching, 
    error: queryError,
    isError: isQueryError 
  } = useReadingTestQuery();
  
  const { 
    mutate: submitTest, 
    isPending: isSubmitting, 
    error: mutationError,
    isError: isMutationError 
  } = useSubmitReadingTestMutation();

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

  const handleSubmit = () => {
    if (!testData || userAnswers.length !== testData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    const submission: ReadingSubmission = {
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
          if (testData) {
            const submission: ReadingSubmission = {
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
    return <ReadingResults evaluation={evaluation} testData={testData as ReadingTest} onRestart={handleRestart} />;
  }

  // Show reading test
  if (testData) {
    return (
      <div className="min-h-screen bg-secondary/20 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <ReadingPassage testData={testData} timeSpent={formatTime(seconds)} />
          
          <QuestionsList
            testData={testData}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
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