export type ApiErrorResponse = {
  success: boolean;
  message: string;
  stack?: string;
};
export type ApiEndPath = "uploadCoverImg" | "uploadProfileImg";

export type Profile = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profession?: string | null;
  about?: string | null;
  location?: string | null;
  coverImgUrl?: string | null;
  profileImgUrl?: string | null;
};
export type MessageType = "TEXT" | "FILE";
export type LastMessage = {
  body: string;
  type: MessageType;
  created_at: Date;
  conversation_id: number;
};

export type Participants = {
  id: string;
  email: string;
  lastMessage: null | LastMessage;
  profile: {
    firstName: string;
    lastName: string;
    profileImgUrl: string;
  };
};

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
interface FailedSendMessage {
  success: false;
  message: string;
  status: number;
}
export type SendMessageApiResponse = SuccessSendMessage | FailedSendMessage;

interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  body: string;
  type: MessageType;
  receiver_id: string;
  created_at: Date;
}

export type GetConversationApiResponse = {
  conversations: Message[];
};
