import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type ErrorMessageProps = {
  message: string;
  refetch: () => void;
};

export default function ErrorMessage({ message, refetch }: ErrorMessageProps) {
  return (
    <div className="fixed inset-0 m-auto flex h-32 w-[80%] flex-col items-center justify-center gap-y-2 rounded-xl p-3 shadow md:h-64">
      <span>
        <ExclamationCircleIcon className="h-10 w-10 text-red-400" />
      </span>
      <p>{message}</p>
      <button
        className="rounded-lg bg-orange-500 px-5 py-2 text-white transition-colors duration-300 hover:cursor-pointer hover:bg-orange-400"
        onClick={refetch}
      >
        Try again
      </button>
    </div>
  );
}
