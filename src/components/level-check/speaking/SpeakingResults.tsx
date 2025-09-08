// components/speaking/SpeakingResults.tsx
import { SpeakingEvaluation } from "@/types/speaking";

interface SpeakingResultsProps {
  evaluation: SpeakingEvaluation;
  onRestart: () => void;
}

export default function SpeakingResults({ evaluation, onRestart }: SpeakingResultsProps) {
  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">IELTS Speaking Results</h1>
          <p className="text-muted-foreground">Your speaking test has been evaluated</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary mb-1">{evaluation.overallBand}</div>
              <div className="text-xs font-medium">Overall Band</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700 mb-1">{evaluation.fluencyCoherence}</div>
              <div className="text-xs font-medium">Fluency</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700 mb-1">{evaluation.lexicalResource}</div>
              <div className="text-xs font-medium">Vocabulary</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700 mb-1">{evaluation.grammaticalRange}</div>
              <div className="text-xs font-medium">Grammar</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700 mb-1">{evaluation.pronunciation}</div>
              <div className="text-xs font-medium">Pronunciation</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Overall Feedback</h3>
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
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Question {index + 1}: {result.question}</h4>
                  
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Your response:</p>
                    <p className="bg-gray-50 p-3 rounded">{result.userAnswer}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-700">{result.fluencyScore}</div>
                      <div className="text-xs text-muted-foreground">Fluency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-700">{result.vocabularyScore}</div>
                      <div className="text-xs text-muted-foreground">Vocabulary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-700">{result.grammarScore}</div>
                      <div className="text-xs text-muted-foreground">Grammar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-700">{result.pronunciationScore}</div>
                      <div className="text-xs text-muted-foreground">Pronunciation</div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Feedback:</p>
                    <p className="text-sm">{result.feedback}</p>
                  </div>
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