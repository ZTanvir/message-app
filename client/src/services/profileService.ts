import { apiUrl } from "./config";
import type { ApiErrorResponse } from "../types/api";
import { ApiError } from "./apiError";
import type { Profile, ApiEndPath } from "../types/api";

type UserProfile = {
  user: Profile;
  success: boolean;
};

async function getProfile(id: string): Promise<UserProfile> {
  const res = await fetch(`${apiUrl}/api/profile/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData: ApiErrorResponse = await res.json().catch((error) => ({
      message: error.message,
      success: false,
    }));
    throw new ApiError(errorData.message, res.status);
  }
  return res.json();
}

async function uploadAvatarImg(formData: FormData, apiEndPath: ApiEndPath) {
  const res = await fetch(`${apiUrl}/api/profile/${apiEndPath}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const errorData: ApiError = await res.json().catch((error) => ({
      message: error.message,
      success: false,
    }));
    throw new ApiError(errorData.message, res.status);
  }
  const result = await res.json();
  return result;
}

export default {
  getProfile,
  uploadAvatarImg,
};
