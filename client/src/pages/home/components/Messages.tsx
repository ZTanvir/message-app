import { useInfiniteQuery } from "@tanstack/react-query";
import messagesService from "../../../services/messagesService";
import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";
import { useAuth } from "../../../hooks";
import { cn } from "../../../utils/schemas/cn";
import { supabaseBucketUrl } from "../../../constants";
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
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<GetConversationApiResponse> =>
      messagesService.getConversation({
        conversationId,
        lastLoadedMsgCreatedAt: pageParam,
      }),
    initialPageParam: null,
    refetchInterval: 3 * 1000, // 3 sec
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
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
          {/* <p>Please login to continue</p>
          <Link to={"/login"}>
            <button>Login</button>
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-1">
      {hasNextPage && (
        <button
          className="mx-auto flex max-w-fit items-center justify-center gap-2 rounded-sm bg-blue-900/70 px-3 py-2 text-white transition-colors duration-200 hover:cursor-pointer hover:bg-blue-900/50"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          <span>{isFetchingNextPage ? "Loading more" : "Load more"}</span>
          <span className="self-center">
            {isFetchingNextPage && <Spinner classname="w-5 h-5 " />}
          </span>
        </button>
      )}
      <div className="flex flex-1 flex-col justify-end gap-3">
        {data.pages.map((group, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {group.conversations.map((msg) => (
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
                  <p className="px-3 py-1 whitespace-pre-wrap">{msg.body}</p>
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
    </div>
  );
}
