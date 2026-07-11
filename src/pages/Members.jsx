import { useMemo, useState } from "react";
import MembersHeader from "../components/members/MembersHeader";
import MembersToolbar from "../components/members/MembersToolbar";
import MembersGrid from "../components/members/MembersGrid";
import { members } from "../data/members";

export default function Members() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const matchesFilter = filter === "All" || member.role === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="px-8 py-8">
      <MembersHeader total={filtered.length} />
      <MembersToolbar
        query={query}
        onQueryChange={setQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <MembersGrid members={filtered} />
    </div>
  );
}