import { useState } from "react";
import { cn } from "../utils/schemas/cn";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { SignUpFormErrors } from "../types/componentTypes";

type PasswordInputProps = {
  formErrors: SignUpFormErrors | null;
  value: string;
  setPassword: (value: string) => void;
};

export default function PasswordInput({
  formErrors,
  value,
  setPassword,
}: PasswordInputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const iconClass = "absolute top-10 right-5 hover:cursor-pointer select-none";
  return (
    <>
      <input
        className={cn(
          "input-custom",
          formErrors?.password && "outline-1 outline-red-400",
        )}
        type={isPasswordVisible ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Enter your password"
        value={value}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span
        onClick={() => {
          setPasswordVisible((prev) => !prev);
        }}
      >
        {isPasswordVisible ? (
          <EyeSlashIcon className={cn("h-5 w-5", iconClass)} />
        ) : (
          <EyeIcon className={cn("h-5 w-5", iconClass)} />
        )}
      </span>
    </>
  );
}
