// app/level-checker/writing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useWritingTask1Query, useWritingTask2Query } from "@/api/queries/writing";
import { WritingTask1Evaluation, WritingTask2Evaluation } from "@/types/writing";
import { useSubmitBothWritingTasksMutation } from "@/api/mutations/writing";

export default function LevelCheckWriting() {
  const [task1Answer, setTask1Answer] = useState("");
  const [task2Essay, setTask2Essay] = useState("");
  const [task1TimeSpent, setTask1TimeSpent] = useState(0);
  const [task2TimeSpent, setTask2TimeSpent] = useState(0);
  const [task1Seconds, setTask1Seconds] = useState(0);
  const [task2Seconds, setTask2Seconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [task1Evaluation, setTask1Evaluation] = useState<WritingTask1Evaluation | null>(null);
  const [task2Evaluation, setTask2Evaluation] = useState<WritingTask2Evaluation | null>(null);
  
  const { data: task1Question, refetch: getTask1Question, isFetching: isFetchingTask1 } = useWritingTask1Query();
  const { data: task2Question, refetch: getTask2Question, isFetching: isFetchingTask2 } = useWritingTask2Query();
  const { mutate: submitBothTasks, isPending: isSubmitting } = useSubmitBothWritingTasksMutation();

  // Initialize questions on component mount
  useEffect(() => {
    getTask1Question();
    getTask2Question();
  }, [getTask1Question, getTask2Question]);

  // Task 1 timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTask1Seconds(prev => prev + 1);
      setTask1TimeSpent(Math.floor((task1Seconds + 1) / 60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [task1Seconds]);

  // Task 2 timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTask2Seconds(prev => prev + 1);
      setTask2TimeSpent(Math.floor((task2Seconds + 1) / 60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [task2Seconds]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!task1Question || !task2Question || !task1Answer.trim() || !task2Essay.trim()) return;
    
    const task1Submission = {
      question: task1Question.question,
      imageUrl: task1Question.imageUrl,
      taskType: task1Question.taskType,
      answer: task1Answer,
      timeSpent: task1TimeSpent
    };
    
    const task2Submission = {
      topic: task2Question.topic,
      essay: task2Essay,
      timeSpent: task2TimeSpent
    };
    
    submitBothTasks({
      task1: task1Submission,
      task2: task2Submission
    }, {
      onSuccess: (data) => {
        setTask1Evaluation(data.task1Evaluation);
        setTask2Evaluation(data.task2Evaluation);
        setIsSubmitted(true);
      }
    });
  };

  const handleRestart = () => {
    setTask1Answer("");
    setTask2Essay("");
    setTask1Seconds(0);
    setTask2Seconds(0);
    setTask1TimeSpent(0);
    setTask2TimeSpent(0);
    setIsSubmitted(false);
    setTask1Evaluation(null);
    setTask2Evaluation(null);
    getTask1Question();
    getTask2Question();
  };

  if (isFetchingTask1 || isFetchingTask2) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSubmitted && task1Evaluation && task2Evaluation) {
    return (
      <div className="min-h-screen bg-secondary/20 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">IELTS Writing Results</h1>
            <p className="text-muted-foreground">Your writing tasks have been evaluated</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary mb-2">{task1Evaluation.overallBand}</div>
                <div className="text-sm font-medium">Task 1 Score</div>
              </div>
              
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary mb-2">{task2Evaluation.overallBand}</div>
                <div className="text-sm font-medium">Task 2 Score</div>
              </div>
              
              <div className="bg-primary p-6 rounded-lg text-center text-primary-foreground">
                <div className="text-4xl font-bold mb-2">
                  {((parseFloat(task1Evaluation.overallBand) + parseFloat(task2Evaluation.overallBand)) / 2).toFixed(1)}
                </div>
                <div className="text-sm font-medium">Overall Band Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Task 1 Results */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-primary">Task 1 Evaluation</h3>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Task Achievement:</h4>
                  <div className="text-lg font-bold text-primary">{task1Evaluation.taskAchievement}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Coherence & Cohesion:</h4>
                  <div className="text-lg font-bold text-primary">{task1Evaluation.coherenceCohesion}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Lexical Resource:</h4>
                  <div className="text-lg font-bold text-primary">{task1Evaluation.lexicalResource}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Grammatical Range:</h4>
                  <div className="text-lg font-bold text-primary">{task1Evaluation.grammaticalRange}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Word Count:</h4>
                  <div className="font-medium">{task1Evaluation.wordCount}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Feedback:</h4>
                  <p className="text-sm">{task1Evaluation.feedback}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Suggestions:</h4>
                  <ul className="text-sm list-disc list-inside">
                    {task1Evaluation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Task 2 Results */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-primary">Task 2 Evaluation</h3>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Task Response:</h4>
                  <div className="text-lg font-bold text-primary">{task2Evaluation.taskResponse}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Coherence & Cohesion:</h4>
                  <div className="text-lg font-bold text-primary">{task2Evaluation.coherenceCohesion}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Lexical Resource:</h4>
                  <div className="text-lg font-bold text-primary">{task2Evaluation.lexicalResource}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Grammatical Range:</h4>
                  <div className="text-lg font-bold text-primary">{task2Evaluation.grammaticalRange}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Word Count:</h4>
                  <div className="font-medium">{task2Evaluation.wordCount}</div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium mb-1">Feedback:</h4>
                  <p className="text-sm">{task2Evaluation.feedback}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Suggestions:</h4>
                  <ul className="text-sm list-disc list-inside">
                    {task2Evaluation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRestart}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">IELTS Writing Level Check</h1>
          <p className="text-muted-foreground">Complete both writing tasks to assess your current IELTS writing level</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Writing Task 1</h2>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Time: <span className="font-medium">{formatTime(task1Seconds)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Word count: <span className="font-medium">{task1Answer.trim() ? task1Answer.trim().split(/\s+/).length : 0}/150</span>
            </div>
          </div>

          {task1Question && (
            <>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Task:</p>
                <p>{task1Question.question}</p>
              </div>

              {task1Question.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={task1Question.imageUrl} 
                    alt="Chart for writing task" 
                    className="w-full max-w-md mx-auto border rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {task1Question.dataDescription}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="task1-answer" className="block font-medium mb-2">
                  Your Response (minimum 150 words)
                </label>
                <textarea
                  id="task1-answer"
                  value={task1Answer}
                  onChange={(e) => setTask1Answer(e.target.value)}
                  className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Write your answer here..."
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Writing Task 2</h2>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Time: <span className="font-medium">{formatTime(task2Seconds)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Word count: <span className="font-medium">{task2Essay.trim() ? task2Essay.trim().split(/\s+/).length : 0}/250</span>
            </div>
          </div>

          {task2Question && (
            <>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Topic:</p>
                <p>{task2Question.topic}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="task2-essay" className="block font-medium mb-2">
                  Your Essay (minimum 250 words)
                </label>
                <textarea
                  id="task2-essay"
                  value={task2Essay}
                  onChange={(e) => setTask2Essay(e.target.value)}
                  className="w-full h-96 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Write your essay here..."
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || 
              task1Answer.trim().split(/\s+/).length < 150 || 
              task2Essay.trim().split(/\s+/).length < 250}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              "Finish and Submit Both Tasks"
            )}
          </button>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-lg font-medium">Submitting and evaluating your writing...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}