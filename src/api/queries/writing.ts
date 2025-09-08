// api/queries/writing.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { WritingTask1Question, WritingTask2Question } from "@/types/writing";

export const useWritingTask1Query = () => {
  return useQuery({ 
    queryKey: ["writing", "task1"], 
    queryFn: async (): Promise<WritingTask1Question> => {
      const { data } = await axiosInstance.get("/level-checker/writing-1");
      return data;
    },
    enabled: false // We'll manually trigger this when needed
  });
};

export const useWritingTask2Query = () => {
  return useQuery({ 
    queryKey: ["writing", "task2"], 
    queryFn: async (): Promise<WritingTask2Question> => {
      const { data } = await axiosInstance.get("/level-checker/writing-2");
      return data;
    },
    enabled: false
  });
};