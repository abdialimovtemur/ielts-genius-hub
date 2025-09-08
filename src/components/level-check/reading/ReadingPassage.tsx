// components/reading/ReadingPassage.tsx
import { ReadingTest } from "@/types/reading";

interface ReadingPassageProps {
  testData: ReadingTest;
  timeSpent: string;
}

export default function ReadingPassage({ testData, timeSpent }: ReadingPassageProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">IELTS Reading Level Check</h1>
        <p className="text-muted-foreground">
          Read the passage and answer the questions below
        </p>
        <div className="mt-2 text-sm text-muted-foreground">
          Time: <span className="font-medium">{timeSpent}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Reading Passage</h2>
        <div className="bg-muted p-6 rounded-lg max-h-96 overflow-y-auto">
          <p className="whitespace-pre-line">{testData.readingText}</p>
        </div>
      </div>
    </div>
  );
}