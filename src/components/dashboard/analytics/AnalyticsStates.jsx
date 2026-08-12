import { AlertTriangle, Database } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";

export function ChartLoading({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ChartEmpty({ title, message }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 text-center">
      <Database size={24} className="text-gray-300" />
      <p className="mt-3 text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-gray-400">{message}</p>
    </div>
  );
}

export function ChartError({ message }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 text-center">
      <AlertTriangle size={24} className="text-red-500" />
      <p className="mt-3 text-sm font-semibold text-red-700">
        Analytics data could not be loaded.
      </p>
      <p className="mt-1 max-w-sm text-sm text-red-500">{message}</p>
    </div>
  );
}
