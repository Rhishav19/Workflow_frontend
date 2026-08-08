import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { createNotification } from "../data/notificationsApi";

const DocsContext = createContext(null);

export function DocsProvider({ children }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
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
      const mapped = data.map((d) => {
        const { data: publicUrlData } = supabase.storage
          .from("documents")
          .getPublicUrl(d.file_path);

        return {
          id: d.id,
          workspaceId: d.workspace_id,
          title: d.title,
          category: d.category,
          author: d.author,
          fileType: d.file_type,
          fileName: d.file_name,
          fileSize: d.file_size,
          filePath: d.file_path,
          fileUrl: publicUrlData.publicUrl,
        };
      });
      setDocs(mapped);
    }
    setLoading(false);
  }

  async function uploadDoc({ file, workspaceId, title, category, author }) {
    const id = `doc-${Date.now()}`;
    const filePath = `${workspaceId}/${id}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (storageError) {
      console.error("Error uploading file:", storageError);
      return { error: storageError };
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const doc = {
      id,
      workspaceId,
      title,
      category,
      author,
      fileType: file.type || file.name.split(".").pop() || "Doc",
      fileName: file.name,
      fileSize: file.size,
      filePath,
      fileUrl: publicUrlData.publicUrl,
    };

    const { error: insertError } = await supabase.from("docs").insert({
      id: doc.id,
      workspace_id: doc.workspaceId,
      title: doc.title,
      category: doc.category,
      author: doc.author,
      file_type: doc.fileType,
      file_name: doc.fileName,
      file_size: doc.fileSize,
      file_path: doc.filePath,
    });

    if (insertError) {
      console.error("Error creating doc row:", insertError);
      return { error: insertError };
    }

    setDocs((prev) => [doc, ...prev]);

    createNotification({
      workspaceId: doc.workspaceId,
      type: "doc_uploaded",
      message: `New document: "${doc.title}"`,
    });

    return { error: null };
  }

  return (
    <DocsContext.Provider value={{ docs, uploadDoc, loading }}>
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