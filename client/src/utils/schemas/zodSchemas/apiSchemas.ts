import z from "zod";

const maxFileSize = 2 * 1024 * 1024; // 2MB
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
    receiverId: z.string(),
    messageType: z.literal("FILE"),
    formData: z.object({
      messageImage: z
        .array(
          z
            .instanceof(File, { message: "Please upload a valid file." })
            .refine(
              (file) => file.size <= maxFileSize,
              "Max image size is 2MB.",
            )
            .refine(
              (file) => acceptedImageTypes.includes(file.type),
              "Only .jpg, .jpeg, .png, and .webp formats are supported.",
            ),
        )
        .min(1, "At least one image is required."),
      messageType: z.literal("FILE"),
    }),
  }),
]);
