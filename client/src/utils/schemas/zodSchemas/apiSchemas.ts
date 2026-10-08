import z from "zod";
import { maxFileSize } from "../../../constants";

const acceptedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const SendMessageSchema = z.discriminatedUnion("messageType", [
  z.object({
    receiverId: z.string(),
    messageType: z.literal("TEXT"),
    senderMessage: z.string().min(1, "Message can't be empty."),
  }),
  z.object({
    messageType: z.literal("FILE"),
    formData: z.object({
      messageImage: z
        .array(z.instanceof(File, { message: "Please upload a valid file." }))
        .refine(
          (files) => files.every((file) => file.size <= maxFileSize),
          "Max image size is 2MB.",
        )
        .refine(
          (files) =>
            files.every((file) => acceptedImageTypes.includes(file.type)),
          "Only .jpg, .jpeg, .png, and .webp formats are supported.",
        ),
      messageType: z.literal("FILE"),
      receiverId: z.string(),
    }),
  }),
]);
