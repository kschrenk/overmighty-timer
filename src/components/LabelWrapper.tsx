import { cn } from "@/lib/utils";

export function LabelWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}
