import { useInfiniteQuery } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";
import { useAuth } from "../../../hooks";
import { cn } from "../../../utils/schemas/cn";
import { supabaseBucketUrl } from "../../../constants";
import { Link } from "react-router";
import React from "react";
import type { GetConversationApiResponse } from "../../../types/api";

type MessagesProps = {
  conversationId: number;
};
export default function Messages({ conversationId }: MessagesProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async ({ pageParam }): Promise<GetConversationApiResponse> =>
      messagesService.getConversation({
        conversationId,
        lastLoadedMsgCreatedAt: pageParam,
      }),
    initialPageParam: null as string,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
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
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div>
          <p>Please login to continue</p>
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-1">
      {data.pages.map((group, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {group.data.map((msg) => (
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
        </React.Fragment>
      ))}
    </div>
  );
}
