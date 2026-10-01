import { Link, useLocation, useParams } from "react-router";
import viteEnv from "../../../../env";
import ProfileImg from "../../../components/ProfileImg";
import {
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  PlayIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import type { MessageType } from "../../../types/api";
interface SendMessageVariables {
  receiverId: string;
  senderMsgType: MessageType;
  senderMessage: string;
}

export default function Chat() {
  const location = useLocation();
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: ({
      receiverId,
      senderMsgType,
      senderMessage,
    }: SendMessageVariables) => {
      return messagesService.sendMessage(
        receiverId,
        senderMsgType,
        senderMessage,
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
    if (chatId) {
      mutation.mutate({
        receiverId: chatId,
        senderMsgType: "TEXT",
        senderMessage: message,
      });
    }
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
          className="relative mt-auto rounded-xl border border-gray-300 shadow-md"
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
              className="absolute top-[50%] right-10 -translate-y-1/2 hover:cursor-pointer"
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
            />
          </div>
          <div>dsdsd</div>
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
