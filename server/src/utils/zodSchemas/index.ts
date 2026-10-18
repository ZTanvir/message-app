import z from "zod";

export const ConversationIdSchema = z.object({
  conversationId: z.string().min(1, "Conversation id is required."),
});
