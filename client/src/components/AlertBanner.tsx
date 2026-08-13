import { cn } from "../utils/schemas/cn";
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
type BannerProps = {
  type: "none" | "success" | "warning" | "negative";
  message: string;
  className: string;
};

function AlertBanner({ type, message, className }: BannerProps) {
  const icons = {
    none: <ExclamationCircleIcon className="h-5 w-5 text-white" />,
    warning: <ExclamationTriangleIcon />,
    success: <CheckCircleIcon />,
    negative: <ExclamationTriangleIcon />,
  };
  return (
    <p
      className={cn(
        "relative flex items-center justify-center gap-x-1 rounded-lg p-2",
        className,
      )}
    >
      {icons[type]}
      {message}
      <span className="absolute top-0 right-0">
        <XMarkIcon className="h-5 w-5" />
      </span>
    </p>
  );
}

export function NeutralMessage({ message }: { message: string }) {
  return <AlertBanner message={message} type="none" className="bg-gray-500" />;
}
