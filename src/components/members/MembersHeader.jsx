export default function MembersHeader({ total }) {
  return (
    <div className="mb-7">
      <h1 className="text-[32px] font-bold text-gray-900">Members</h1>
      <p className="mt-1 text-[15px] text-gray-500">
        {total} {total === 1 ? "person" : "people"} across your workspace.
        New accounts are created by an admin.
      </p>
    </div>
  );
}