// types/reading.ts
export interface ReadingQuestion {
  question: string;
  questionType: 'multiple_choice' | 'true_false_not_given' | 'short_answer' | 'matching';
  options: string[];
}

export interface ReadingTest {
  testId: string;
  readingText: string;
  questions: ReadingQuestion[];
}

export interface ReadingSubmission {
  testId: string;
  userAnswers: string[];
  timeSpent: number;
}

export interface DetailedResult {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ReadingEvaluation {
  overallBand: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  detailedResults: DetailedResult[];
  feedback: string;
  suggestions: string[];
  submissionId: string;
}

export interface ApiError {
  message: string;
  status?: number;
}