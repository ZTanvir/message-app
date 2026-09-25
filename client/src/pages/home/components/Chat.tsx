import { useParams } from "react-router";

export default function Chat() {
  const { id } = useParams();
  return <div>Chat:{id}</div>;
}
