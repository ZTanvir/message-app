import { useParams } from "react-router";

export default function Chat() {
  const { chatId } = useParams();
  return <div>Chat:{chatId}</div>;
}
