import { apiUrl } from "./config";
import type { ApiErrorResponse } from "../types/api";
import { ApiError } from "./apiError";
import type { Profile, ApiEndPath } from "../types/api";
import { EditProfileSchema } from "@message-app/shared/zodSchemas/validationSchema";
import * as z from "zod";
import type { AboutFormData } from "../types/componentTypes";

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

async function editProfile(profileData: z.infer<typeof EditProfileSchema>) {
  const res = await fetch(`${apiUrl}/api/profile/editProfile`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    if (res.status === 400) {
      const errorData: ApiError = await res.json().catch((error) => ({
        message: error.error,
        success: false,
      }));
      throw new ApiError(errorData.message, res.status);
    } else if (res.status === 404) {
      const errorData: ApiError = await res.json().catch((error) => ({
        message: error.message,
        success: false,
      }));
      throw new ApiError(errorData.message, res.status);
    }
  }
  const data = await res.json();
  return data;
}

async function editAboutMe(aboutMeData: AboutFormData) {
  const res = await fetch(`${apiUrl}/api/profile/aboutMe`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(aboutMeData),
    credentials: "include",
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
}

export default {
  getProfile,
  uploadAvatarImg,
  editProfile,
  editAboutMe,
};
