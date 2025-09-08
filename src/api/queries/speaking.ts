// api/queries/speaking.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { SpeakingTest, ApiError } from "@/types/speaking";

const fetchSpeakingTest = async (): Promise<SpeakingTest> => {
  try {
    const { data } = await axiosInstance.get("/api/level-checker/speaking");
    return data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch speaking test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useSpeakingTestQuery = () => {
  return useQuery<SpeakingTest, ApiError>({ 
    queryKey: ["speaking", "test"], 
    queryFn: fetchSpeakingTest,
    retry: 1,
  });
};