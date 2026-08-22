import { apiUrl } from "./config";

async function getProfile(id: string) {
  const res = await fetch(`${apiUrl}/api/profile/${id}`);
  const data = await res.json();
  return data;
}

export default {
  getProfile,
};
