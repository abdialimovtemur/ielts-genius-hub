// types/level-check.ts

export interface TestResults {
  reading?: {
    overallBand: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  };
  writing?: {
    overallBand: string;
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammarAccuracy: number;
  };
  listening?: {
    overallBand: string;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  };
  speaking?: {
    overallBand: string;
    fluencyCoherence: number;
    lexicalResource: number;
    grammarAccuracy: number;
    pronunciation: number;
  };
}

export interface FinalTestResult {
  overallBand: string;
  sectionResults: TestResults;
  totalTimeSpent: string;
  completedSections: string[];
  recommendations: string[];
  submissionDate: string;
}