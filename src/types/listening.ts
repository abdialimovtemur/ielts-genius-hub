// types/listening.ts
export interface ListeningQuestion {
  question: string;
  questionType: 'multiple_choice' | 'true_false_not_given' | 'short_answer' | 'matching';
  options?: string[];
}

export interface ListeningTest {
  testId: string;
  listeningText: string;
  questions: ListeningQuestion[];
}

export interface ListeningSubmission {
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

export interface ListeningEvaluation {
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