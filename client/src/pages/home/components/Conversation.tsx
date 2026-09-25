import { Link, Outlet } from "react-router";

export default function Conversation() {
  return (
    <div>
      <h1>Conversation</h1>
      <Link to={"/messages/12"}>User 12</Link>
      <Outlet />
    </div>
  );
}
