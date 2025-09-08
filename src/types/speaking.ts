// types/speaking.ts
export interface SpeakingQuestion {
  question: string;
  questionType: string;
  instructions: string;
  guidance: string;
}

export interface SpeakingTest {
  testId: string;
  questions: SpeakingQuestion[];
}

export interface SpeakingSubmission {
  testId: string;
  audioFiles: File[];
  timeSpent: number;
}

export interface QuestionResult {
  questionIndex: number;
  question: string;
  userAnswer: string;
  fluencyScore: string;
  vocabularyScore: string;
  grammarScore: string;
  pronunciationScore: string;
  feedback: string;
}

export interface SpeakingEvaluation {
  overallBand: string;
  fluencyCoherence: string;
  lexicalResource: string;
  grammaticalRange: string;
  pronunciation: string;
  feedback: string;
  suggestions: string[];
  detailedResults: QuestionResult[];
  submissionId: string;
}

export interface ApiError {
  message: string;
  status?: number;
}