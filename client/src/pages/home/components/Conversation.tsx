import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams } from "react-router";
import messagesService from "../../../services/messagesService";
import { Bars3CenterLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Spinner from "../../../components/Spinner";
import type { Participants } from "../../../types/api";
import viteEnv from "../../../../env";
import ProfileImg from "../../../components/ProfileImg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function Participant({
  profile,
  lastMessage,
}: Omit<Participants, "id" | "email">) {
  const fullname = profile.firstName + profile.lastName;
  const profileImgUrl = profile.profileImgUrl
    ? `${viteEnv.VITE_SUPABASE_PUBLIC_URL}/message_app/${profile.profileImgUrl}`
    : null;

  const lastConversation = lastMessage?.body ? (
    lastMessage.type === "TEXT" ? (
      lastMessage.body
    ) : (
      <span>
        <PhotoIcon className="h-3 w-3" />
        <span className="sr-only">Image file</span>
      </span>
    )
  ) : (
    `Chat with ${fullname}`
  );

  dayjs.extend(relativeTime);
  const timeAgo = dayjs(lastMessage?.created_at).fromNow();
  return (
    <div className="flex items-center gap-x-2 border-b border-b-gray-200 px-4 py-2">
      <ProfileImg imageUrl={profileImgUrl} className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <h3>{fullname}</h3>
        <p className="text-sm text-gray-700">{lastConversation}</p>
      </div>
      <p className="self-start text-xs text-gray-700">{timeAgo}</p>
    </div>
  );
}

export default function Conversation() {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: () => messagesService.getParticipants(),
  });
  const { chatId } = useParams();
  console.log(isPending, isError, data, error, chatId);
  const handleRetryFetch = () => {
    refetch();
  };
  const Header = (
    <header className="flex flex-col">
      <h2 className="flex items-center gap-x-1 px-4 py-6">
        <Bars3CenterLeftIcon className="h-7 w-7" />
        <span className="text-2xl">User Messages</span>
      </h2>
      <hr className="text-gray-300" />
    </header>
  );
  if (isPending) {
    return (
      <div className="flex min-h-[92dvh] w-1/3 flex-col border-r border-gray-300 shadow-md lg:h-full">
        {Header}
        <div className="flex flex-1 items-center justify-center">
          <Spinner classname="md:w-10 md:h-10 lg:w-15 lg:h-15 border-3" />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-[92vh] w-1/3 flex-col border-r border-gray-300 shadow-md lg:h-full">
        {Header}
        <div className="flex flex-1 flex-col items-center justify-center gap-y-1">
          <p>{error.message || "Something went wrong"}</p>
          <button
            className="rounded-md bg-orange-400 px-3 py-1 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-orange-400/80"
            onClick={handleRetryFetch}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-[92dvh] lg:h-full">
      <div className="w-1/3 border-r border-gray-300 shadow-md">
        {Header}
        <div className="overflow-auto">
          {data.map((user) => (
            <Link key={user.id} to={String(user.id)}>
              <Participant
                profile={user.profile}
                lastMessage={user.lastMessage}
              />
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
