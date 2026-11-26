import { ApiError } from "./apiError";
import { apiUrl } from "./config";
async function getPeopleYouMayKnow({ pageParam }: { pageParam: string }) {
  const res = await fetch(
    `${apiUrl}/api/friends/people-you-may-know?cursor=${pageParam}`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) {
    throw new ApiError("Something went wrong", res.status);
  }
  const data = await res.json();
  if (data.success) {
    return data;
  }
  throw new ApiError(data.message, res.status);
}
export default { getPeopleYouMayKnow };
