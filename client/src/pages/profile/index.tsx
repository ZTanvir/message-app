import { useParams } from "react-router";

export default function ProfilePage() {
  const { userId } = useParams();
  return <div>Profile page ,{userId}</div>;
}
