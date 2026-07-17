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

  function handleSave(memberData) {
    saveMember({ ...memberData, workspaceId });
  }

  return (
    <div className="px-8 py-8">
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