import { useRef, useState, type Ref } from "react";
import Modal from "../../../components/Modal";
import type { DialogHandle } from "../../../types/types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import viteEnv from "../../../../env";
import profileService from "../../../services/profileService";

type CoverPhotoModalProps = {
  ref: Ref<DialogHandle>;
  imageUrl: string;
};

export default function CoverPhotoModal({
  ref,
  imageUrl,
}: CoverPhotoModalProps) {
  const [imgSrc, setImgSrc] = useState<null | string>(imageUrl);
  const fileInputEl = useRef<HTMLInputElement>(null);

  const handleClearImage = () => {
    if (!fileInputEl.current) return;
    setImgSrc(null);
    // user canceled image will not set as cover image
    fileInputEl.current.value = "";
  };

  const handleUploadImage = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImgSrc(objectUrl);
  };
  const handleSaveImage = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputEl.current) return;
    const file = fileInputEl.current.files?.[0] || "";
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const data = await profileService.uploadAvatarImg(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal ref={ref} title="Edit cover image">
      <div>
        <div className="relative mt-3 mb-3 rounded-sm border border-dotted border-gray-200 p-3">
          {imgSrc ? (
            <>
              <img
                className="m-auto h-50 w-50 rounded-full object-cover"
                alt="demo profile"
                src={imgSrc}
              />
              <XMarkIcon
                onClick={handleClearImage}
                title="clear"
                className="absolute top-1 right-1 h-8 w-8 rounded-full bg-gray-100 p-1 hover:cursor-pointer"
              />
            </>
          ) : (
            <p className="text-center">Not image added</p>
          )}
        </div>
        <form
          onSubmit={handleSaveImage}
          className="flex flex-col justify-between gap-y-2 md:flex-row"
          method="post"
          encType="multipart/form-data"
        >
          <div>
            <button
              type="button"
              className="w-full rounded-sm border border-orange-600 font-bold"
            >
              <label
                className="flex justify-center gap-2 px-5 py-2 opacity-80 hover:cursor-pointer hover:opacity-100"
                htmlFor="cover"
              >
                <span>
                  <PlusIcon className="h-5 w-5 text-orange-600" />
                </span>{" "}
                Upload Image
              </label>
            </button>
            <input
              onChange={handleUploadImage}
              ref={fileInputEl}
              accept="image/*"
              className="hidden"
              type="file"
              id="cover"
              name="cover"
            />
          </div>

          <button
            type="submit"
            className="rounded-sm bg-orange-600 px-5 py-2 font-bold text-white hover:cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Modal>
  );
}
