import { useRef, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import profileService from "../../../services/profileService";
import { ApiError } from "../../../services/apiError";
import Spinner from "../../../components/Spinner";
import { cn } from "../../../utils/schemas/cn";
import type { ApiEndPath } from "../../../types/api";

type PhotoModalProps = {
  onChangePhoto: () => void;
  imageUrl: string | null;
  apiEndPath: ApiEndPath;
  fileName: string;
};

type ServerResponseMessage = {
  message: string;
  type: "success" | "failed";
};

export default function PhotoEditContainer({
  imageUrl,
  onChangePhoto,
  apiEndPath,
  fileName,
}: PhotoModalProps) {
  const [imgSrc, setImgSrc] = useState<null | string>(imageUrl);
  const fileInputEl = useRef<HTMLInputElement>(null);
  const [responseMessage, setResponseMessage] =
    useState<ServerResponseMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    formData.append(`${fileName}`, file);
    try {
      setResponseMessage(null);
      setIsLoading(true);
      const data = await profileService.uploadAvatarImg(formData, apiEndPath);
      if (data.success) {
        setResponseMessage({ message: data.message, type: "success" });
        onChangePhoto();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setResponseMessage({ message: error.message, type: "failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {responseMessage && (
        <p
          className={cn(
            "my-2",
            responseMessage.type === "success"
              ? "text-green-600"
              : "text-red-500",
          )}
        >
          {responseMessage.message}
        </p>
      )}
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
              htmlFor="demoImg"
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
            id="demoImg"
            name={fileName}
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-x-2 rounded-sm bg-orange-600 px-5 py-2 font-bold text-white hover:cursor-pointer"
        >
          {isLoading && <Spinner />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
