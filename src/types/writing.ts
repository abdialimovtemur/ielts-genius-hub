// types/writing.ts
export interface WritingTask1Question {
  question: string;
  imageUrl: string;
  taskType: string;
  dataDescription: string;
}

export interface WritingTask1Submission {
  question: string;
  imageUrl: string;
  taskType: string;
  answer: string;
  timeSpent: number;
}

export interface WritingTask1Data {
  questionData: WritingTask1Question;
  submission: WritingTask1Submission;
}

export interface WritingTask1Evaluation {
  overallBand: string;
  taskAchievement: string;
  coherenceCohesion: string;
  lexicalResource: string;
  grammaticalRange: string;
  feedback: string;
  suggestions: string[];
  wordCount: number;
  submissionId: string;
}

export interface WritingTask2Question {
  topic: string;
}

export interface WritingTask2Submission {
  topic: string;
  essay: string;
  timeSpent: number;
}

export interface WritingTask2Data {
  questionData: WritingTask2Question;
  submission: WritingTask2Submission;
}

export interface WritingTask2Evaluation {
  overallBand: string;
  taskResponse: string;
  coherenceCohesion: string;
  lexicalResource: string;
  grammaticalRange: string;
  feedback: string;
  suggestions: string[];
  wordCount: number;
  submissionId: string;
}

export interface WritingResults {
  task1Evaluation: WritingTask1Evaluation;
  task2Evaluation: WritingTask2Evaluation;
  overallBand: string;
}