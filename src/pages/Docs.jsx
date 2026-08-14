import { useMemo, useState } from "react";
import DocsHeader from "../components/docs/DocsHeader";
import DocsToolbar from "../components/docs/DocsToolbar";
import DocsGrid from "../components/docs/DocsGrid";
import UploadDocModal from "../components/docs/UploadDocModal";
import { useDocs } from "../context/DocsContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";

export default function Docs() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { docs, uploadDoc, deleteDoc } = useDocs();
  const { logActivity } = useActivity();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const filtered = useMemo(() => {
    return docs.filter((doc) => {
      const matchesWorkspace = doc.workspaceId === workspaceId;
      const matchesCategory = category === "All" || doc.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        doc.title.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q);
      return matchesWorkspace && matchesCategory && matchesQuery;
    });
  }, [docs, workspaceId, query, category]);

  async function handleUpload({ file, title, category: docCategory }) {
    setUploading(true);
    setUploadError("");
    const actor = user?.name ?? "Unknown";

    const { error } = await uploadDoc({
      file,
      workspaceId,
      title,
      category: docCategory,
      author: actor,
    });

    setUploading(false);

    if (error) {
      setUploadError("Upload failed. Please try again.");
      return false;
    }

    logActivity({
      workspaceId,
      actor,
      verb: "uploaded a document",
      target: title,
    });
    return true;
  }

  function handleDelete(id, filePath) {
    deleteDoc(id, filePath);
  }

  return (
    <div className="px-8 py-8">
      <DocsHeader onUploadClick={() => setModalOpen(true)} />
      <DocsToolbar
        query={query}
        onQueryChange={setQuery}
        activeCategory={category}
        onCategoryChange={setCategory}
      />
      <DocsGrid docs={filtered} onDelete={handleDelete} />

      {modalOpen && (
        <UploadDocModal
          onClose={() => {
            setModalOpen(false);
            setUploadError("");
          }}
          onUpload={handleUpload}
          uploading={uploading}
          uploadError={uploadError}
        />
      )}
    </div>
  );
}