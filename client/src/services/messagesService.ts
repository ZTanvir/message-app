import { ApiError } from "./apiError";
import { apiUrl } from "./config";

async function getParticipants() {
  const res = await fetch(`${apiUrl}/api/conversation/participants`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new ApiError("Something went wrong", res.status);
  }
  const data = await res.json();
  if (data.success) {
    return data.users;
  } else if (!data.success) {
    throw new ApiError(data.message, res.status);
  }
}

export default {
  getParticipants,
};
