import { ApiError } from "./apiError";
import { apiUrl } from "./config";
import type { Participants } from "../types/api";

async function getParticipants(): Promise<Participants[]> {
  const res = await fetch(`${apiUrl}/api/conversation/participants`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new ApiError("Something went wrong", res.status);
  }
  const data = await res.json();
  if (data.success) {
    return data.users;
  }
  throw new ApiError(data.message, res.status);
}

export default {
  getParticipants,
};
