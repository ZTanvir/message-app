import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "react-router";
import messagesService from "../../../services/messagesService";
import { Bars3CenterLeftIcon } from "@heroicons/react/24/outline";
import Spinner from "../../../components/Spinner";

export default function Conversation() {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: () => messagesService.getParticipants(),
  });
  console.log(isPending, isError, data, error);
  const handleRetryFetch = () => {
    refetch();
  };
  const Header = (
    <h2 className="flex items-center gap-x-1 px-4 py-6">
      <Bars3CenterLeftIcon className="h-7 w-7" />
      <span className="text-2xl">User Messages</span>
    </h2>
  );
  if (isPending) {
    return (
      <div className="flex h-full w-1/3 flex-col border-r border-gray-300 shadow-md">
        {Header}
        <div className="flex h-full items-center justify-center">
          <Spinner classname="w-15 h-15 border-3" />
        </div>
      </div>
    );
  }
  if (!isError) {
    return (
      <div className="flex h-full w-1/3 flex-col border-r border-gray-300 shadow-md">
        {Header}
        <div className="flex h-full flex-col items-center justify-center gap-y-1">
          <p>{"error.message" || "Something went wrong"}</p>
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
    <div>
      {Header}
      <div></div>
      <Outlet />
    </div>
  );
}
