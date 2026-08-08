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
      const mapped = data.map((d) => ({
        id: d.id,
        workspaceId: d.workspace_id,
        title: d.title,
        category: d.category,
        author: d.author,
        updated: d.updated,
        fileType: d.file_type,
        fileName: d.file_name,
        fileSize: d.file_size,
        body: d.body,
      }));
      setDocs(mapped);
    }
    setLoading(false);
  }

  async function addDoc(doc) {
    const { error } = await supabase.from("docs").insert({
      id: doc.id,
      workspace_id: doc.workspaceId,
      title: doc.title,
      category: doc.category,
      author: doc.author,
      updated: doc.updated,
      file_type: doc.fileType,
      file_name: doc.fileName,
      file_size: doc.fileSize,
      body: doc.body ?? null,
    });

    if (error) {
      console.error("Error creating doc:", error);
      return;
    }

    setDocs((prev) => [doc, ...prev]);

    createNotification({
      workspaceId: doc.workspaceId,
      type: "doc_uploaded",
      message: `New document: "${doc.title}"`,
    });
  }

  return (
    <DocsContext.Provider value={{ docs, addDoc, loading }}>
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