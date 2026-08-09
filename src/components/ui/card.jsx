import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("mb-5", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h2 className={cn("text-lg font-bold text-gray-900", className)}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn("mt-1 text-sm text-gray-500", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }) {
  return <div className={className}>{children}</div>;
}
