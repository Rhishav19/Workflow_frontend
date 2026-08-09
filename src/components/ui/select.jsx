import { cn } from "../../lib/utils";

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
