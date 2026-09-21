import avatarImg from "../assets/images/avatar.svg";
import { cn } from "../utils/schemas/cn";
type ProfileImgProps = {
  imageUrl: string | null;
  className?: string;
};
export default function ProfileImg({ imageUrl, className }: ProfileImgProps) {
  return (
    <img
      className={cn("bg-gray-00 h-40 w-40", className)}
      src={imageUrl ? `${imageUrl}` : `${avatarImg}`}
      alt="avatar image"
    />
  );
}
