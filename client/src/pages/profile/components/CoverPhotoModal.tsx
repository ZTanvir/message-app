import { useState, type Ref } from "react";
import Modal from "../../../components/Modal";
import type { DialogHandle } from "../../../types/types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

type CoverPhotoModalProps = {
  ref: Ref<DialogHandle>;
  imageUrl: string;
};

export default function CoverPhotoModal({
  ref,
  imageUrl,
}: CoverPhotoModalProps) {
  const [imgSrc, setImgSrc] = useState<null | string>(imageUrl);

  const handleRemoveImage = () => {
    setImgSrc(null);
  };
  return (
    <Modal ref={ref} title="Edit cover image">
      <div>
        <div className="relative mt-3 mb-3 rounded-sm border border-dotted border-gray-200 p-3">
          {imgSrc ? (
            <img src={imageUrl} />
          ) : (
            <p className="text-center">Not image added</p>
          )}
          {imgSrc && (
            <XMarkIcon
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 h-8 w-8 rounded-full bg-gray-100 p-1"
            />
          )}
        </div>
        <div className="flex flex-col justify-between gap-y-2 md:flex-row">
          <div>
            <button className="w-full rounded-sm border border-orange-600 font-bold hover:cursor-pointer">
              <label
                className="flex justify-center gap-2 px-5 py-2"
                htmlFor="myfile"
              >
                <span>
                  <PlusIcon className="h-5 w-5 text-orange-600" />
                </span>{" "}
                Upload Image
              </label>
            </button>
            <input className="hidden" type="file" id="myfile" name="myfile" />
          </div>

          <button className="rounded-sm bg-orange-600 px-5 py-2 font-bold text-white hover:cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
