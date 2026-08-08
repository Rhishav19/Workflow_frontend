import { useMemo, useState } from "react";
import MembersHeader from "../components/members/MembersHeader";
import MembersToolbar from "../components/members/MembersToolbar";
import MembersGrid from "../components/members/MembersGrid";
import MemberModal from "../components/members/MemberModal";
import { useMembers } from "../context/MembersContext";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Members() {
  const { workspaceId } = useWorkspace();
  const { members, saveMember } = useMembers();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newAccountInfo, setNewAccountInfo] = useState(null);

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const matchesWorkspace = member.workspaceId === workspaceId;
      const matchesFilter = filter === "All" || member.role === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q);
      return matchesWorkspace && matchesFilter && matchesQuery;
    });
  }, [members, workspaceId, query, filter]);

  function handleAddClick() {
    setEditingMember(null);
    setModalOpen(true);
  }

  function handleEditClick(member) {
    setEditingMember(member);
    setModalOpen(true);
  }

  async function handleSave(memberData) {
    const { tempPassword, isNewAccount } = await saveMember({ ...memberData, workspaceId });
    if (isNewAccount) {
      setNewAccountInfo({ email: memberData.email, tempPassword });
    }
  }

return (
    <div className="px-8 py-8">
      {newAccountInfo && (
        <div className="mb-5 flex items-start justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
          <p>
            Account created for <strong>{newAccountInfo.email}</strong>.<br />
            Temporary password: <code className="font-mono">{newAccountInfo.tempPassword}</code>
          </p>
          <button
            onClick={() => setNewAccountInfo(null)}
            className="ml-4 shrink-0 text-emerald-600 hover:text-emerald-800"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <MembersHeader total={filtered.length} onAddMember={handleAddClick} />
      <MembersToolbar
        query={query}
        onQueryChange={setQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <MembersGrid members={filtered} onEdit={handleEditClick} />

      {modalOpen && (
        <MemberModal
          member={editingMember}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
