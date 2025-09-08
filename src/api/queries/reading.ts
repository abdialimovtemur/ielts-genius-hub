// api/queries/reading.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { ReadingTest, ApiError } from "@/types/reading";

const fetchReadingTest = async (): Promise<ReadingTest> => {
  try {
    const { data } = await axiosInstance.get("/level-checker/reading");
    return data; 
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch reading test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useReadingTestQuery = () => {
  return useQuery<ReadingTest, ApiError>({ 
    queryKey: ["reading", "test"], 
    queryFn: fetchReadingTest,
    retry: 1,
  });
};