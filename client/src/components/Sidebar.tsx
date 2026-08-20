import { NavLink } from "react-router";
import Logo from "./Logo";
import {
  ChatBubbleLeftIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "../hooks/contextConsume";
export default function Sidebar() {
  const { user } = useAuthContext();
  const IconClass = "h-8 w-8 text-white lg:h-10 lg:w-10";
  const activeLinkClass =
    "self-center border-l-4 border-l-orange-600/50 bg-linear-to-r from-orange-300/20 to-orange-500/60 p-2 ";
  const inactiveLinkClass = "cursor-pointer self-center";
  return (
    <aside className="h-content flex w-full cursor-pointer gap-x-6 bg-gray-900 pr-2 pl-2 lg:h-full lg:flex-col lg:gap-y-4 lg:p-0 lg:pt-2 lg:pb-2">
      <Logo classname="w-10 h-10 self-center" />
      <nav className="flex w-full justify-between lg:h-full lg:flex-col">
        <div className="flex gap-x-4 lg:flex-col lg:gap-y-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? `${activeLinkClass}` : `${inactiveLinkClass}`
            }
          >
            <ChatBubbleLeftIcon className={`${IconClass} `} />
          </NavLink>
          <NavLink
            to={`/profile/${user?.id}`}
            className={({ isActive }) =>
              isActive ? `${activeLinkClass}` : `${inactiveLinkClass}`
            }
          >
            <UserIcon className={`${IconClass}`} />
          </NavLink>
        </div>
        <div className="flex gap-x-4 lg:flex-col lg:gap-y-4">
          <NavLink
            className={({ isActive }) =>
              isActive ? `${activeLinkClass}` : `${inactiveLinkClass}`
            }
            to="/logout"
          >
            <ArrowLeftStartOnRectangleIcon className={`${IconClass}`} />
          </NavLink>
          <NavLink to={`/profile/${user?.id}`}>Profile</NavLink>
        </div>
      </nav>
    </aside>
  );
}
