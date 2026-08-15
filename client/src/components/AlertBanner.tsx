import { useState } from "react";
import { cn } from "../utils/schemas/cn";
import type { Banner } from "../types/componentTypes";
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type BannerProps = {
  type: Banner;
  message: string;
  className?: string;
  iconClass?: string;
  xMarkClass?: string;
};

function AlertBanner({
  type,
  message,
  className,
  iconClass,
  xMarkClass,
}: BannerProps) {
  const [isFadeOut, setIsFadeOut] = useState(false);
  const icons = {
    none: <ExclamationCircleIcon className="h-5 w-5" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5" />,
    success: <CheckCircleIcon className="h-5 w-5" />,
    negative: <ExclamationTriangleIcon className="h-5 w-5" />,
  };

  return (
    <p
      className={cn(
        "relative items-center justify-center gap-x-1 rounded-sm p-2 transition-[display,opacity] transition-discrete duration-500 ease-in-out",
        className,
        isFadeOut ? "pointer-events-none hidden opacity-0" : "flex opacity-100",
      )}
    >
      <span className={iconClass}>{icons[type]}</span>
      {message}
      <span
        title="close"
        onClick={() => setIsFadeOut(!isFadeOut)}
        className="absolute right-2 hover:cursor-pointer"
      >
        <XMarkIcon className={cn("h-4 w-4", xMarkClass)} />
      </span>
    </p>
  );
}

export function NeutralMessage({ message }: { message: string }) {
  return (
    <AlertBanner
      message={message}
      type="none"
      className="bg-gray-500 text-white"
      iconClass="text-white"
      xMarkClass="text-white"
    />
  );
}

export function SuccessMessage({ message }: { message: string }) {
  return (
    <AlertBanner
      message={message}
      type="success"
      className="bg-green-700 text-white"
      iconClass="text-white"
      xMarkClass="text-white"
    />
  );
}

export function WarningMessage({ message }: { message: string }) {
  return (
    <AlertBanner
      message={message}
      type="warning"
      className="bg-yellow-700 text-gray-900"
      iconClass="text-gray-900"
      xMarkClass="text-gray-900"
    />
  );
}

export function AlertMessage({ message }: { message: string }) {
  return (
    <AlertBanner
      message={message}
      type="negative"
      className="bg-red-800 text-white"
      iconClass="text-white"
      xMarkClass="text-white"
    />
  );
}
