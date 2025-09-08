// api/queries/interests.ts
import axiosInstance from "@/lib/client";
import { 
  InterestSelectResponse, 
  SelectInterestsRequest, 
  UpdateInterestsRequest, 
  InterestUpdateResponse 
} from "@/types/interest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Mutation to select interests (first time after login) - POST
export const useSelectInterestsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SelectInterestsRequest): Promise<InterestSelectResponse> => 
      axiosInstance.post("/users/interests/select", data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
    }
  });
};

// Mutation to update interests (edit existing interests) - PUT
export const useUpdateInterestsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInterestsRequest): Promise<InterestUpdateResponse> => 
      axiosInstance.put("/users/interests", data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
    }
  });
};