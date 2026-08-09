import { useState } from "react";
import { X, RotateCcw } from "lucide-react";

export default function RequestChangesModal({ task, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!note.trim()) {
      setError("Describe what changes need to be made.");
      return;
    }

    onSubmit(task.id, note.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Request Changes</h2>
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
          {error.length > 0 ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              What changes are needed? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="e.g. Please update the color scheme and fix the responsive layout on mobile."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
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
              className="flex h-10 items-center gap-1.5 rounded-lg bg-amber-600 px-4 text-sm font-medium text-white hover:bg-amber-700"
            >
              <RotateCcw size={14} />
              Send Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}