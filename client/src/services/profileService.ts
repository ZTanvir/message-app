import { apiUrl } from "./config";

async function getProfile(id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/profile/${id}`);
    if (!res.ok) {
      throw new Error("Something wrong , please try again");
    }
    const data = await res.json();
    return {
      success: true,
      user: data.data,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Something wrong , please try again",
    };
  }
}

export default {
  getProfile,
};
