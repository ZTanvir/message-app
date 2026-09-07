import { useState } from "react";
import type { Profile } from "../../../types/api";
import { PencilIcon } from "@heroicons/react/24/outline";
import { EditProfileSchema } from "@message-app/shared/zodSchemas/validationSchema";
import * as z from "zod";

type ProfessionProps = {
  profile: Profile;
};
type EditProfessionFormProps = {
  profile: Profile;
  handleCloseForm: () => void;
};

function EditProfessionForm({
  profile,
  handleCloseForm,
}: EditProfessionFormProps) {
  const [profileFormData, setProfileFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    profession: profile.profession || "",
    location: profile.location || "",
  });

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Db will have null value instead of empty string
    const profileFormValues: Record<string, string> = {};
    for (const [key, value] of Object.entries(profileFormData)) {
      if (value) {
        profileFormValues[key] = value;
      }
    }

    const result = EditProfileSchema.safeParse(profileFormValues);
    if (!result.success) {
      console.log(z.flattenError(result.error));
    }

    console.log(result.data);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-y-4"
      id="editProfile"
    >
      <div className="space-x-2">
        <label htmlFor="firstName">First name:</label>
        <input
          type="text"
          id="firstName"
          className="rounded-lg border border-gray-400/40 p-2"
          value={profileFormData["firstName"]}
          onChange={(e) =>
            setProfileFormData((prev) => ({
              ...prev,
              [e.target.id]: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-x-2">
        <label htmlFor="lastName">Last name:</label>
        <input
          type="text"
          id="lastName"
          className="rounded-lg border border-gray-400/40 p-2"
          value={profileFormData["lastName"]}
          onChange={(e) =>
            setProfileFormData((prev) => ({
              ...prev,
              [e.target.id]: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-x-2">
        <label htmlFor="profession">Profession:</label>
        <input
          type="text"
          id="profession"
          className="rounded-lg border border-gray-400/40 p-2"
          value={profileFormData["profession"]}
          onChange={(e) =>
            setProfileFormData((prev) => ({
              ...prev,
              [e.target.id]: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-x-2">
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          className="rounded-lg border border-gray-400/40 p-2"
          value={profileFormData["location"]}
          onChange={(e) =>
            setProfileFormData((prev) => ({
              ...prev,
              [e.target.id]: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-x-4">
        <button
          className="rounded-lg bg-gray-300/40 px-5 py-2 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-300"
          onClick={handleCloseForm}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-blue-700 px-5 py-2 text-white transition-colors duration-300 hover:cursor-pointer hover:bg-blue-700/80"
          type="submit"
        >
          Edit
        </button>
      </div>
    </form>
  );
}

export default function Profession({ profile }: ProfessionProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const fullName = profile.firstName + " " + profile.lastName;
  return (
    <section className="flex flex-1 items-start justify-between p-4 md:pl-50 lg:pl-54">
      {isEditingProfile ? (
        <EditProfessionForm
          profile={profile}
          handleCloseForm={() => setIsEditingProfile(false)}
        />
      ) : (
        <div className="mt-20 p-4 text-center md:mt-0 md:text-left">
          <h2 className="text-4xl font-bold">{fullName}</h2>
          {profile.profession ? (
            <p>{profile.profession}</p>
          ) : (
            <p className="opacity-80">Profession not added yet.</p>
          )}
          {profile.profession ? (
            <p>{profile.location}</p>
          ) : (
            <p className="opacity-80">Location not added yet.</p>
          )}
        </div>
      )}

      <button
        onClick={() => setIsEditingProfile((prev) => !prev)}
        title="edit"
        className="cursor-pointer"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
    </section>
  );
}
