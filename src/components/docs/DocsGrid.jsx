import DocCard from "./DocCard";

export default function DocsGrid({ docs }) {
  if (docs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-gray-600">
          No documents match your search.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Try a different keyword or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {docs.map((doc) => (
        <DocCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}