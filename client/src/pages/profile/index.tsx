import { useParams } from "react-router";
import Card from "./components/Card";
import {
  PencilSquareIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import ProfileImg from "../../components/ProfileImg";
import { useQuery } from "@tanstack/react-query";
import profileService from "../../services/profileService";

export default function ProfilePage() {
  const { userId } = useParams();
  const { isPending, isError, data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
  });
  console.log(data);
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex justify-between bg-white p-6 text-xl shadow-sm">
        <span className="">My Messaging Profile</span>
        <div className="">profile name</div>
      </header>
      <main className="grid flex-1 auto-rows-auto grid-rows-[max-content] gap-y-4 bg-gray-200/50 p-4 lg:grid-cols-[3fr_1fr] lg:gap-x-4">
        {/* profile and about me */}
        <div className="space-y-4">
          {/* profile */}
          <Card className="relative flex h-150 flex-col overflow-hidden p-0">
            <div className="relative flex-1 bg-linear-to-b from-slate-50 via-gray-100 to-gray-300">
              <button className="absolute top-5 right-5 flex cursor-pointer items-center gap-x-2 rounded-lg bg-gray-400 p-2 text-white hover:cursor-pointer">
                <PencilIcon className="h-4 w-4" />
                <span>Edit cover image</span>
              </button>
            </div>
            <section className="flex-1 md:pl-50 lg:pl-54">
              <div className="mt-20 p-4 text-center md:mt-0 md:text-left">
                <h2 className="text-4xl font-bold">Hamza</h2>
                <p>Profession</p>
                <p>Location</p>
                <p>
                  Main skills <span>Ux design</span>
                </p>
              </div>
            </section>
            <div className="absolute top-1/2 left-1/2 -translate-1/2 md:left-25 md:-translate-y-1/2">
              <ProfileImg className="h-40 w-40" />
              <button className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-gray-300 p-2">
                <CameraIcon className="h-8 w-8" />
              </button>
            </div>
          </Card>
          {/* about me */}
          <Card className="flex justify-between">
            <div>
              <h2 className="text-xl">About me</h2>
            </div>
            <button className="cursor-pointer">
              <PencilSquareIcon className="h-6 w-6 cursor-pointer" />
            </button>
          </Card>
        </div>
        {/* similar profile */}
        <div className="">
          <Card>
            <h3>Similar profiles</h3>
            {/* profiles */}
          </Card>
        </div>
      </main>
    </div>
  );
}
