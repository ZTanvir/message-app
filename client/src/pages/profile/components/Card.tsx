import { cn } from "../../../utils/schemas/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <section className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
      {children}
    </section>
  );
}
