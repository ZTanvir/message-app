import { ApiError } from "./apiError";
import { apiUrl } from "./config";
import type { Participants, MessageType } from "../types/api";

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

async function sendMessage(
  receiverId: string,
  senderMsgType: MessageType,
  senderMessage: string,
) {
  const res = await fetch(`${apiUrl}/api/conversation/with/${receiverId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId, senderMsgType, senderMessage }),
  });
  if (!res.ok) {
    throw new ApiError("Something went wrong", res.status);
  }
  const data = await res.json();
  if (data.success) {
    return data;
  }
  throw new ApiError(data.message, res.status);
}

export default {
  getParticipants,
  sendMessage,
};
