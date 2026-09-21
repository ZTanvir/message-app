import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { EditAboutMeSchema } from "@message-app/shared/zodSchemas/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import profileService from "../../../services/profileService";
import type { AboutFormData } from "../../../types/componentTypes";
import { useParams } from "react-router";

type AboutMeProps = {
  about: string | null | undefined;
};

type AboutMeFormProps = {
  aboutData: string | null | undefined;
  handleCloseForm: () => void;
};

function AboutMeForm({ aboutData, handleCloseForm }: AboutMeFormProps) {
  const [about, setAbout] = useState(aboutData || "");
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const editAboutMeMutation = useMutation({
    mutationFn: (newAboutMe: AboutFormData) => {
      return profileService.editAboutMe(newAboutMe);
    },
    onSuccess: () => {
      handleCloseForm();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const aboutData: AboutFormData = about ? { about } : {};
    const result = EditAboutMeSchema.safeParse(aboutData);
    if (result.success) {
      editAboutMeMutation.mutate(result.data);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-y-4"
      id="editAboutMe"
    >
      <div className="space-x-2">
        {editAboutMeMutation.isError && (
          <p className="py-2 text-red-400">
            {editAboutMeMutation.error.message}
          </p>
        )}
        <textarea
          name="about"
          id="about"
          className="w-full rounded-lg border border-gray-400/40 p-2"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>
      <div className="flex gap-x-4">
        <button
          className="rounded-lg bg-gray-300/40 px-5 py-2 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-300"
          onClick={handleCloseForm}
          type="button"
        >
          Cancel
        </button>
        <button
          className="inline-flex items-center gap-x-2 rounded-lg bg-blue-700 px-5 py-2 text-white transition-colors duration-300 hover:cursor-pointer hover:bg-blue-700/80"
          type="submit"
        >
          {editAboutMeMutation.isPending && (
            <Spinner classname="border-white border-t-transparent" />
          )}
          Edit
        </button>
      </div>
    </form>
  );
}

export default function AboutMe({ about }: AboutMeProps) {
  const [showAboutForm, setShowAboutForm] = useState(false);
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl">About me</h2>
        <button
          className="cursor-pointer"
          onClick={() => setShowAboutForm((prev) => !prev)}
        >
          <PencilIcon className="h-5 w-5 cursor-pointer" />
        </button>
      </div>
      {showAboutForm ? (
        <AboutMeForm
          aboutData={about}
          handleCloseForm={() => setShowAboutForm(false)}
        />
      ) : about ? (
        <p className="opacity-80">{about}</p>
      ) : (
        <p className="opacity-80">About me not added yet.</p>
      )}
    </>
  );
}
