import LogoImg from "../assets/images/logo.png";
import { cn } from "../utils/schemas/cn";
export default function Logo({ classname }: { classname?: string }) {
  return <img className={cn(classname)} src={LogoImg} alt="logo" />;
}
