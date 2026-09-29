import { Link, useLocation } from "react-router";
import viteEnv from "../../../../env";
import ProfileImg from "../../../components/ProfileImg";
import {
  EllipsisVerticalIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Chat() {
  const location = useLocation();
  const { email, avatarImg, firstName, lastName } = location.state || {};
  const fullName = firstName + " " + lastName;
  const profileImgUrl = avatarImg
    ? `${viteEnv.VITE_SUPABASE_PUBLIC_URL}/message_app/${avatarImg}`
    : null;
  return (
    <section className="w-full md:w-6/10">
      <header className="flex h-20 border-b border-b-gray-200 px-4 py-6">
        <div className="flex flex-1 items-center gap-x-2">
          <Link to="/messages" className="inline md:hidden">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <ProfileImg
            className="h-12 w-12 rounded-full"
            imageUrl={profileImgUrl}
          />
          <div>
            <h3 className="font-bold">{fullName}</h3>
            <p className="text-xs text-gray-600">{email}</p>
          </div>
        </div>

        <button>
          <EllipsisVerticalIcon className="h-7 w-7" />
          <span className="sr-only">Chat options</span>
        </button>
      </header>
      <p></p>
      <Link to="/messages">Back</Link>
    </section>
  );
}
