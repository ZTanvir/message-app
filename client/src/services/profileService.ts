import { apiUrl } from "./config";
import type { ApiErrorResponse } from "../types/api";
import { ApiError } from "./apiError";
import type { Profile } from "../types/api";

type UserProfile = {
  user: Profile;
  success: boolean;
};

async function getProfile(id: string): Promise<UserProfile> {
  const res = await fetch(`${apiUrl}/api/profile/${id}`);
  if (!res.ok) {
    const errorData: ApiErrorResponse = await res.json().catch((error) => ({
      message: error.message,
      success: false,
    }));
    throw new ApiError(errorData.message, res.status);
  }
  return res.json();
}

export default {
  getProfile,
};
