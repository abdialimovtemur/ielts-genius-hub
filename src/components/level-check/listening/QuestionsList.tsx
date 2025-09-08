// components/listening/QuestionsList.tsx
import { ListeningTest } from "@/types/listening";

interface QuestionsListProps {
  testData: ListeningTest;
  userAnswers: string[];
  onAnswerChange: (questionIndex: number, answer: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  hasPlayedAudio: boolean;
}

export default function QuestionsList({
  testData,
  userAnswers,
  onAnswerChange,
  isSubmitting,
  onSubmit,
  hasPlayedAudio
}: QuestionsListProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Questions</h2>
      
      {!hasPlayedAudio && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center">
            Please listen to the audio first before answering the questions.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {testData.questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="font-medium mb-3">
              {index + 1}. {question.question}
            </div>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type={question.questionType === 'multiple_choice' ? 'radio' : 'checkbox'}
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => onAnswerChange(index, option)}
                    className="mt-1"
                    disabled={isSubmitting || !hasPlayedAudio}
                  />
                  <span className={!hasPlayedAudio ? 'text-gray-400' : ''}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || userAnswers.length !== testData.questions.length || !hasPlayedAudio}
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