import { useInfiniteQuery } from "@tanstack/react-query";
import friendsService from "../../services/friendsService";

export default function FriendsPage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["people-you-may-know"],
    queryFn: () => friendsService.getPeopleYouMayKnow(),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  return <div>FriendsPage</div>;
}
