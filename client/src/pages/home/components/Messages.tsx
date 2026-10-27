import { useQuery } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";

type MessagesProps = {
  conversationId: number;
};
export default function Messages({ conversationId }: MessagesProps) {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => messagesService.getConversation(conversationId),
  });

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
  console.log();

  return <div>Messages :{conversationId}</div>;
}
