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

interface SendMessageData {
  conversation_id: number;
  sender_id: number;
}

interface SuccessSendMessage {
  success: true;
  message: string;
  type: MessageType;
  data: SendMessageData;
}
interface SuccessFailedMessage {
  success: false;
  message: string;
  status: number;
}
type SendMessageApiResponse = SuccessSendMessage | SuccessFailedMessage;

async function sendMessage(
  receiverId: string,
  messageType: MessageType,
  senderMessage?: string,
  formData?: FormData,
): Promise<SendMessageApiResponse> {
  const res = await fetch(`${apiUrl}/api/conversation/with/${receiverId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(messageType === "TEXT" && { "Content-Type": "application/json" }),
    },
    body:
      messageType === "TEXT"
        ? JSON.stringify({ receiverId, messageType, senderMessage })
        : formData,
  });

  const data = await res.json();
  if (data.success) {
    return data;
  }
  throw new ApiError(data.message || "Something went wrong", res.status);
}

export default {
  getParticipants,
  sendMessage,
};
