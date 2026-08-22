import { apiUrl } from "./config";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "@message-app/shared/zodSchemas/validationSchema";
import z from "zod";

export async function userRegistration(
  payload: z.infer<typeof SignUpValidationSchema>,
) {
  try {
    const res = await fetch(`${apiUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data) throw new Error("Invalid server response check server.");
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function userLogin(
  payload: z.infer<typeof LoginValidationSchema>,
) {
  try {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data) throw new Error("Invalid server response check server.");
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function checkLoggedIn() {
  try {
    const res = await fetch(`${apiUrl}/api/auth/isLoggedIn`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("User not authenticated");
    }
    const data = await res.json();
    return { success: true, user: data.user };
  } catch (_error) {
    return { success: false };
  }
}
export async function logoutUser() {
  try {
    const res = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Something went wrong,try again");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong,try again",
    };
  }
}

export default {
  addUser: userRegistration,
  loginUser: userLogin,
  checkLoggedIn,
  logoutUser,
};
