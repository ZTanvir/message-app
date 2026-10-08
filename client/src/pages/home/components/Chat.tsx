import { Link, useLocation, useParams } from "react-router";
import viteEnv from "../../../../env";
import ProfileImg from "../../../components/ProfileImg";
import {
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  PlayIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import type { MessageType } from "../../../types/api";
import { SendMessageSchema } from "../../../utils/schemas/zodSchemas/apiSchemas";
import { cn } from "../../../utils/schemas/cn";
import { maxFileSize } from "../../../constants";
import z from "zod";

interface UploadedFile extends File {
  isLarge: boolean;
}
type RenderUploadedFilesProps = {
  FileList: UploadedFile[];
  handleRemoveFile: (fileName: File["name"]) => void;
};

function RenderUploadedFiles({
  FileList,
  handleRemoveFile,
}: RenderUploadedFilesProps) {
  return (
    <>
      {Boolean(FileList.length) && (
        <div className="m-2 flex flex-wrap items-end gap-1">
          {FileList.map((file) => (
            <div
              key={file.name}
              className={cn(
                "relative mr-2 flex items-center gap-x-2 rounded-xl p-2 text-xs text-white",
                file.isLarge ? "bg-red-500" : "bg-orange-500",
              )}
            >
              <img
                className="h-5 w-5 rounded-sm"
                src={URL.createObjectURL(file)}
                alt="preview"
              />
              <span>{file.name}</span>
              <button
                data-fileid={file.name}
                onClick={() => handleRemoveFile(file.name)}
                className="absolute -top-1.5 -right-1.5 overflow-hidden text-gray-800 hover:cursor-pointer hover:opacity-80"
              >
                <XCircleIcon className="h-6 w-6" />
                <span className="sr-only">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

interface SendMessageVariables {
  receiverId: string;
  messageType: MessageType;
  senderMessage?: string;
  formData?: FormData;
}

export default function Chat() {
  const location = useLocation();
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);
  const mutation = useMutation({
    mutationFn: ({
      receiverId,
      messageType,
      senderMessage,
      formData,
    }: SendMessageVariables) => {
      return messagesService.sendMessage(
        receiverId,
        messageType,
        senderMessage,
        formData,
      );
    },
    onSuccess: () => {
      setMessage("");
    },
  });
  const { email, avatarImg, firstName, lastName } = location.state || {};
  const fullName = firstName + " " + lastName;
  const profileImgUrl = avatarImg
    ? `${viteEnv.VITE_SUPABASE_PUBLIC_URL}/message_app/${avatarImg}`
    : null;
  const handleSubmitMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (chatId) {
      const msgType: MessageType = selectedFiles.length ? "FILE" : "TEXT";
      const messageObj =
        msgType === "TEXT"
          ? {
              receiverId: chatId,
              messageType: msgType,
              senderMessage: message,
            }
          : {
              receiverId: chatId,
              messageType: msgType,
              formData: {
                messageImage: selectedFiles,
                messageType: msgType,
              },
            };
      const result = SendMessageSchema.safeParse(messageObj);
      if (!result.success) {
        const errors = z.flattenError(result.error);
        const errorMessages = Object.values(errors.fieldErrors).flat();
        setErrorMessage(errorMessages);
        return;
      }
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append("messageImage", file);
      }
      formData.append("messageType", msgType);
      mutation.mutate({
        receiverId: chatId,
        messageType: msgType,
        senderMessage: msgType === "TEXT" ? message : undefined,
        formData: msgType === "FILE" ? formData : undefined,
      });
    }
  };
  const handleUploadFileChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    if (!e.currentTarget.files) return;
    const filesArray = Array.from(e.currentTarget.files);
    const filesWithLargeCheck = filesArray.map((item) => {
      if (item.size > maxFileSize) {
        return Object.assign(item, { isLarge: true });
      }
      return Object.assign(item, { isLarge: false });
    });
    setSelectedFiles(filesWithLargeCheck);
  };
  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.name !== fileName);
      return updatedFiles;
    });
  };
  return (
    <section className="w-full md:w-6/10">
      <header className="flex h-20 border-b border-b-gray-200 px-4 py-6">
        <div className="flex flex-1 items-center gap-x-3">
          <Link to="/messages" className="inline md:hidden">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <ProfileImg
            className="h-12 w-12 rounded-full"
            imageUrl={profileImgUrl}
          />
          <div>
            <h3 className="font-bold">
              <Link to={`/profile/${chatId}`}>{fullName}</Link>
            </h3>
            <p className="text-xs text-gray-600">{email}</p>
          </div>
        </div>

        <button>
          <EllipsisVerticalIcon className="h-7 w-7" />
          <span className="sr-only">Chat options</span>
        </button>
      </header>
      <main className="flex h-[92%] flex-col px-4 py-6">
        <div></div>
        <form
          id="conversation"
          onSubmit={handleSubmitMessage}
          encType="multipart/form-data"
          className="relative mt-auto mb-6 rounded-lg border border-gray-300 shadow-md lg:mb-0"
        >
          <div className="flex-1">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="message"
              id="message"
              placeholder="Send your message.."
              className="w-full px-4 py-4"
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="msgFiles"
              title="add photo"
              className={cn(
                "absolute top-[50%] right-10 -translate-y-1/2 hover:cursor-pointer",
                selectedFiles.length ? "opacity-100" : "opacity-50",
              )}
            >
              <PhotoIcon className="h-5 w-5" />
              <span className="sr-only">add photo</span>
            </label>
            <input
              type="file"
              name="msgFiles"
              id="msgFiles"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUploadFileChange}
            />
          </div>

          {/* User can choose their files */}
          <RenderUploadedFiles
            FileList={selectedFiles}
            handleRemoveFile={handleRemoveFile}
          />
          {/* User will send proper data  */}
          {errorMessage && (
            <div className="m-2">
              {errorMessage.map((msg, index) => (
                <p className="mb-1 text-sm text-red-500" key={index}>
                  {msg}
                </p>
              ))}
            </div>
          )}

          <button
            className="absolute top-[50%] right-2 -translate-y-1/2 hover:cursor-pointer disabled:hover:cursor-not-allowed"
            type="submit"
            disabled={mutation.isPending}
          >
            <PlayIcon className="h-8 w-8 text-gray-600" />
          </button>
        </form>
      </main>
    </section>
  );
}
