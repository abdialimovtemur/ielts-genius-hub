// api/queries/interests.ts (to'liq versiya)
import axiosInstance from "@/lib/client";
import { Interest } from "@/types/interest";
import { useQuery } from "@tanstack/react-query";

const fetchAvailableInterests = async (): Promise<Interest[]> => {
  const { data } = await axiosInstance.get("/users/interests/available");
  return data;
};

export const useAvailableInterestsQuery = () => {
  return useQuery({ 
    queryKey: ["interests", "available"], 
    queryFn: fetchAvailableInterests 
  });
};

// Agar kerak bo'lsa, user interests uchun alohida query
const fetchUserInterests = async (): Promise<Interest[]> => {
  const { data } = await axiosInstance.get("/users/profile");
  return data.interests || [];
};

export const useUserInterestsQuery = () => {
  return useQuery({ 
    queryKey: ["interests", "user"], 
    queryFn: fetchUserInterests 
  });
};