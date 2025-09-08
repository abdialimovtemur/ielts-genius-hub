// components/reading/ReadingResults.tsx
import { ReadingEvaluation, ReadingTest } from "@/types/reading";

interface ReadingResultsProps {
  evaluation: ReadingEvaluation;
  testData: ReadingTest;
  onRestart: () => void;
}

export default function ReadingResults({ evaluation, onRestart }: ReadingResultsProps) {
  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">IELTS Reading Results</h1>
          <p className="text-muted-foreground">Your reading test has been evaluated</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">{evaluation.overallBand}</div>
              <div className="text-sm font-medium">Overall Band Score</div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">{evaluation.correctAnswers}/{evaluation.totalQuestions}</div>
              <div className="text-sm font-medium">Correct Answers</div>
            </div>
            
            <div className="bg-primary p-6 rounded-lg text-center text-primary-foreground">
              <div className="text-4xl font-bold mb-2">{evaluation.percentage}%</div>
              <div className="text-sm font-medium">Percentage</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Feedback</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p>{evaluation.feedback}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Suggestions for Improvement</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc list-inside">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="mb-1">{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Detailed Results</h3>
            <div className="space-y-4">
              {evaluation.detailedResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">Question {index + 1}</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  <p className="font-medium mb-2">{result.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Your answer:</span> {result.userAnswer}
                    </div>
                    <div>
                      <span className="font-medium">Correct answer:</span> {result.correctAnswer}
                    </div>
                  </div>
                  {result.explanation && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Explanation:</span> {result.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90"
            >
              Try Another Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}