import { useState } from "react";
import { X, UploadCloud, FileText } from "lucide-react";

export default function SubmitTaskModal({ task, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!note.trim()) {
      setError("Add a short note describing what you finished.");
      return;
    }

    onSubmit(task.id, {
      note: note.trim(),
      fileName: file?.name ?? null,
      submittedAt: "Just now",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Submit Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
          {task.title}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              What did you finish?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Finished the onboarding flow, ready for review"
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Attach a file (optional)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-200 px-3 py-2.5 text-sm text-gray-500 hover:border-gray-300">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <>
                  <FileText size={16} className="text-blue-600" />
                  {file.name}
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Click to attach
                </>
              )}
            </label>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}