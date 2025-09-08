// api/mutations/listening.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { ListeningSubmission, ListeningEvaluation, ApiError } from "@/types/listening";

const submitListeningTest = async (submission: ListeningSubmission): Promise<ListeningEvaluation> => {
  try {
    const { data } = await axiosInstance.post("/level-checker/listening", submission);
    return data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to submit listening test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useSubmitListeningTestMutation = () => {
  return useMutation<ListeningEvaluation, ApiError, ListeningSubmission>({
    mutationFn: submitListeningTest,
  });
};