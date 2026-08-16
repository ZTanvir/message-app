import { cn } from "../utils/schemas/cn";
type SpinnerProps = {
  classname?: string;
};
export default function Spinner({ classname }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-orange-300 border-t-transparent",
        classname,
      )}
    ></span>
  );
}
