// api/queries/listening.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { ListeningTest, ApiError } from "@/types/listening";

const fetchListeningTest = async (): Promise<ListeningTest> => {
  try {
    const { data } = await axiosInstance.get("/level-checker/listening");
    return data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch listening test",
      status: error.response?.status
    };
    throw apiError;
  }
};

export const useListeningTestQuery = () => {
  return useQuery<ListeningTest, ApiError>({ 
    queryKey: ["listening", "test"], 
    queryFn: fetchListeningTest,
    retry: 1,
  });
};