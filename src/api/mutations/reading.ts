// api/mutations/reading.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { ReadingSubmission, ReadingEvaluation, ApiError } from "@/types/reading";

const submitReadingTest = async (submission: ReadingSubmission): Promise<ReadingEvaluation> => {
  try {
    const { data } = await axiosInstance.post("/level-checker/reading", submission);
    return data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to submit reading test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useSubmitReadingTestMutation = () => {
  return useMutation<ReadingEvaluation, ApiError, ReadingSubmission>({
    mutationFn: submitReadingTest,
  });
};