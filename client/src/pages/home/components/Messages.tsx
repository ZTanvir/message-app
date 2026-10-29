import { useQuery } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";
import { useAuth } from "../../../hooks";
import { cn } from "../../../utils/schemas/cn";
import { supabaseBucketUrl } from "../../../constants";

type MessagesProps = {
  conversationId: number;
};
export default function Messages({ conversationId }: MessagesProps) {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => messagesService.getConversation(conversationId),
  });
  const auth = useAuth();
  const loggedInUserId = auth.user?.id;
  if (isPending) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <Spinner classname="w-10 h-10 border-3" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <ErrorMessage
          message={error.message || "Something went wrong"}
          refetch={refetch}
        />
      </div>
    );
  }
  if (!loggedInUserId) {
    return;
  }

  console.log("data", data, auth.user);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {data.conversations.map((msg) => (
          <div
            className={cn(
              "rounded-sm",
              loggedInUserId === msg.sender_id
                ? "self-start bg-gray-800/10"
                : "self-end bg-orange-600 text-white",
            )}
            key={msg.id}
          >
            {msg.type === "TEXT" ? (
              <p className="px-3 py-1">{msg.body}</p>
            ) : (
              <img
                className="rounded-sm p-3"
                src={`${supabaseBucketUrl}/${msg.body}`}
                alt="message image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
