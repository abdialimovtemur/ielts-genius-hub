// api/mutations/writing.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { 
  WritingTask1Submission, 
  WritingTask2Submission, 
  WritingTask1Evaluation, 
  WritingTask2Evaluation,
  WritingResults 
} from "@/types/writing";

export const useSubmitWritingTask1Mutation = () => {
  return useMutation({
    mutationFn: async (submission: WritingTask1Submission): Promise<WritingTask1Evaluation> => {
      const { data } = await axiosInstance.post("/level-checker/writing-1", submission);
      return data;
    },
  });
};

export const useSubmitWritingTask2Mutation = () => {
  return useMutation({
    mutationFn: async (submission: WritingTask2Submission): Promise<WritingTask2Evaluation> => {
      const { data } = await axiosInstance.post("/level-checker/writing-2", submission);
      return data;
    },
  });
};

export const useSubmitBothWritingTasksMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      task1: WritingTask1Submission,
      task2: WritingTask2Submission
    }): Promise<WritingResults> => {
      // Submit both tasks in parallel
      const [task1Result, task2Result] = await Promise.all([
        axiosInstance.post("/level-checker/writing-1", data.task1),
        axiosInstance.post("/level-checker/writing-2", data.task2)
      ]);
      
      const task1Evaluation: WritingTask1Evaluation = task1Result.data;
      const task2Evaluation: WritingTask2Evaluation = task2Result.data;
      
      // Calculate overall band score
      const overallBand = (
        (parseFloat(task1Evaluation.overallBand) + parseFloat(task2Evaluation.overallBand)) / 2
      ).toFixed(1);
      
      return {
        task1Evaluation,
        task2Evaluation,
        overallBand
      };
    },
  });
};