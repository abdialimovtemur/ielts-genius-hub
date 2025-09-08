// components/reading/QuestionsList.tsx
import { ReadingTest } from "@/types/reading";

interface QuestionsListProps {
  testData: ReadingTest;
  userAnswers: string[];
  onAnswerChange: (questionIndex: number, answer: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function QuestionsList({
  testData,
  userAnswers,
  onAnswerChange,
  isSubmitting,
  onSubmit
}: QuestionsListProps) {
  // Add safety checks for undefined data
  if (!testData?.questions) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-6 mt-6">
        <div className="text-center text-muted-foreground">
          No questions available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mt-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Questions</h2>
        <div className="space-y-6">
          {testData.questions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-medium mb-3">
                {index + 1}. {question.question}
              </div>
              
              <div className="space-y-2">
                {/* Check if question has options (multiple choice, true/false, matching) */}
                {question.options && question.options.length > 0 ? (
                  question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type={question.questionType === 'multiple_choice' ? 'radio' : 'checkbox'}
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={() => onAnswerChange(index, option)}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                      <span>{option}</span>
                    </label>
                  ))
                ) : (
                  /* For short_answer questions, show text input */
                  <input
                    type="text"
                    value={userAnswers[index] || ''}
                    onChange={(e) => onAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || userAnswers.length !== testData.questions.length}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Answers"
          )}
        </button>
      </div>
    </div>
  );
}