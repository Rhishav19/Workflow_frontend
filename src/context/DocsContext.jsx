import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const DocsContext = createContext(null);
const BUCKET = "documents";

function guessFileType(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["xls", "xlsx", "csv"].includes(ext)) return "Sheet";
  return "Doc";
}

export function DocsProvider({ children }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();

    const channel = supabase
      .channel("docs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "docs" },
        () => {
          fetchDocs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDocs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("docs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching docs:", error);
    } else {
      const mapped = data.map((d) => ({
        id: d.id,
        workspaceId: d.workspace_id,
        title: d.title,
        category: d.category,
        author: d.author,
        fileName: d.file_name,
        fileSize: d.file_size,
        fileType: d.file_type,
        filePath: d.file_path,
        fileUrl: supabase.storage.from(BUCKET).getPublicUrl(d.file_path).data.publicUrl,
        createdAt: d.created_at,
      }));
      setDocs(mapped);
    }
    setLoading(false);
  }

  async function uploadDoc({ file, workspaceId, title, category, author }) {
    const path = `${workspaceId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { error: uploadError };
    }

    const { error: insertError } = await supabase.from("docs").insert({
      id: `doc-${Date.now()}`,
      workspace_id: workspaceId,
      title,
      category,
      author,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      file_type: guessFileType(file.name),
    });

    if (insertError) {
      console.error("Error saving document metadata:", insertError);
      await supabase.storage.from(BUCKET).remove([path]);
      return { error: insertError };
    }

    await fetchDocs();
    return { error: null };
  }

 async function deleteDoc(id, filePath) {
    if (filePath) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove([filePath]);
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue anyway — better to remove the metadata row than leave a
        // dangling entry the user can never delete.
      }
    }

    const { error } = await supabase.from("docs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting doc:", error);
      return { error };
    }

    setDocs((prev) => prev.filter((d) => d.id !== id));
    return { error: null };
  }

  return (
    <DocsContext.Provider value={{ docs, loading, uploadDoc, deleteDoc }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error("useDocs must be used within a DocsProvider");
  }
  return context;
}