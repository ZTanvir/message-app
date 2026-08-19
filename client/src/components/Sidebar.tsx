import { NavLink } from "react-router";
import Logo from "./Logo";
import {
  ChatBubbleLeftIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
export default function Sidebar() {
  return (
    <aside className="h-content relative bottom-0 left-0 flex w-full gap-x-6 bg-gray-900 p-2">
      <Logo classname="w-10" />
      <nav className="flex">
        <NavLink to="">
          <ChatBubbleLeftIcon className="h-10 w-10 text-white" />
        </NavLink>
        <NavLink to="">
          <UserIcon className="h-10 w-10 text-white" />
        </NavLink>
        <NavLink to="">
          <ArrowLeftStartOnRectangleIcon className="h-10 w-10 text-white" />
        </NavLink>
        <NavLink to="/profile/:userId"></NavLink>
      </nav>
    </aside>
  );
}
