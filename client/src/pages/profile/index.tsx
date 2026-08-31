import { useParams } from "react-router";
import Card from "./components/Card";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/outline";
import ProfileImg from "../../components/ProfileImg";
import { useQuery } from "@tanstack/react-query";
import profileService from "../../services/profileService";
import Spinner from "../../components/Spinner";
import ErrorMessage from "../../components/ErrorMessage";
import CoverPhotoModal from "./components/CoverPhotoModal";
import { useRef } from "react";
import type { DialogHandle } from "../../types/types";

export default function ProfilePage() {
  const { userId } = useParams();
  const { isPending, isError, data, refetch, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
    retry: 1,
  });
  const coverPhotoDialog = useRef<DialogHandle>(null);
  console.log(error);

  if (isPending) {
    return <Spinner classname="w-15 h-15 border-4 fixed inset-0 m-auto" />;
  }
  if (isError) {
    return <ErrorMessage message={error.message} refetch={refetch} />;
  }
  const fullName = data.user.firstName + " " + data.user.lastName;

  const handleOpenCoverPhotoDialog = () => {
    coverPhotoDialog.current?.openModal();
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex justify-between bg-white p-6 text-xl shadow-sm">
        <span className="">My Messaging Profile</span>
        <div className="capitalize">{data.user.firstName}</div>
      </header>
      <main className="grid flex-1 auto-rows-auto grid-rows-[max-content] gap-y-4 bg-gray-200/50 p-4 lg:grid-cols-[3fr_1fr] lg:gap-x-4">
        {/* profile and about me */}
        <div className="space-y-4">
          {/* profile */}
          <Card className="relative flex h-150 flex-col overflow-hidden p-0">
            <div className="relative flex-1 bg-linear-to-b from-slate-50 via-gray-100 to-gray-300">
              <button
                onClick={handleOpenCoverPhotoDialog}
                className="absolute top-5 right-5 flex items-center gap-x-2 rounded-lg bg-gray-400 p-2 text-white transition-colors duration-300 hover:cursor-pointer hover:bg-gray-400/50"
              >
                <CameraIcon className="h-5 w-5" />
                <span>Edit cover image</span>
              </button>
            </div>
            <section className="flex-1 md:pl-50 lg:pl-54">
              <div className="mt-20 p-4 text-center md:mt-0 md:text-left">
                <h2 className="text-4xl font-bold">{fullName}</h2>
                {data.user.profession ? (
                  <p>{data.user.profession}</p>
                ) : (
                  <p className="opacity-80">Profession not added yet.</p>
                )}
                {data.user.profession ? (
                  <p>{data.user.location}</p>
                ) : (
                  <p className="opacity-80">Location not added yet.</p>
                )}

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
          <Card className="flex flex-col justify-between">
            <div className="flex justify-between">
              <h2 className="text-xl">About me</h2>
              <button className="cursor-pointer">
                <PencilIcon className="h-6 w-6 cursor-pointer" />
              </button>
            </div>
            {data.user.profession ? (
              <p>{data.user.about}</p>
            ) : (
              <p className="opacity-80">About me not added yet.</p>
            )}
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
      <CoverPhotoModal ref={coverPhotoDialog} imageUrl="" />
    </div>
  );
}
