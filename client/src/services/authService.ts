import viteEnv from "../../env";
const apiUrl = `${viteEnv.VITE_API_URL}`;
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
    console.log("registration", data);
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
    console.log("login", data);
    if (!data) throw new Error("Invalid server response check server.");
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  addUser: userRegistration,
  loginUser: userLogin,
};
