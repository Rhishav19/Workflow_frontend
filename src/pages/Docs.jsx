import { useMemo, useState } from "react";
import DocsHeader from "../components/docs/DocsHeader";
import DocsToolbar from "../components/docs/DocsToolbar";
import DocsGrid from "../components/docs/DocsGrid";
import UploadDocModal from "../components/docs/UploadDocModal";
import { docs as initialDocs } from "../data/docs";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Docs() {
  const { workspaceId } = useWorkspace();
  const [docs, setDocs] = useState(initialDocs);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

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

  function handleUpload(newDoc) {
    setDocs((prev) => [{ ...newDoc, workspaceId }, ...prev]);
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
      <DocsGrid docs={filtered} />

      {modalOpen && (
        <UploadDocModal onClose={() => setModalOpen(false)} onUpload={handleUpload} />
      )}
    </div>
  );
}