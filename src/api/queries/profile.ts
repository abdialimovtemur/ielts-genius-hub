// api/queries/profile.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/client";
import { User } from "@/types/user";
import Cookies from "js-cookie";

const fetchProfile = async (): Promise<User | null> => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return null;
    }

    const { data } = await axiosInstance.get("/users/profile");
    return data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      return null;
    }
    throw err; // boshqa xatolarni qayta otamiz
  }
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: false,
    // Faqat browserda ishlayotganda va token bo'lganda so'rov yuborish
    enabled: typeof window !== "undefined" && !!Cookies.get("token")
  });
};