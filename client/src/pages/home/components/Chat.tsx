import { Link, useParams } from "react-router";

export default function Chat() {
  const { chatId } = useParams();
  return (
    <div>
      <div>Chat:{chatId}</div>
      <Link to="/messages">Back</Link>
    </div>
  );
}
