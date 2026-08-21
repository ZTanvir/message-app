import avatarImg from "../assets/images/avatar.svg";
import { cn } from "../utils/schemas/cn";
type ProfileImgProps = {
  imageUrl?: string;
  className?: string;
};
export default function ProfileImg({ imageUrl, className }: ProfileImgProps) {
  return (
    <img
      className={cn("h-40 w-40 rounded-full bg-gray-200", className)}
      src={imageUrl ? `${imageUrl}` : `${avatarImg}`}
      alt="avatar image"
    />
  );
}
