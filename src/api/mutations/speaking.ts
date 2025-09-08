// api/mutations/speaking.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { SpeakingSubmission, SpeakingEvaluation, ApiError } from "@/types/speaking";

const submitSpeakingTest = async (submission: SpeakingSubmission): Promise<SpeakingEvaluation> => {
  try {
    const formData = new FormData();
    formData.append("testId", submission.testId);
    formData.append("timeSpent", submission.timeSpent.toString());
    
    submission.audioFiles.forEach((file, index) => {
      formData.append(`audioFiles`, file);
    });

    const { data } = await axiosInstance.post("/level-checker/speaking", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to submit speaking test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useSubmitSpeakingTestMutation = () => {
  return useMutation<SpeakingEvaluation, ApiError, SpeakingSubmission>({
    mutationFn: submitSpeakingTest,
  });
};