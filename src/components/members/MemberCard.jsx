import { Mail } from "lucide-react";
import { ROLE_STYLES, STATUS_STYLES } from "../../data/members";

export default function MemberCard({ member }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-300">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
              {member.initials}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${STATUS_STYLES[member.status]}`}
            />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-gray-900">
              {member.name}
            </p>
            <p className="text-xs text-gray-400">{member.department}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[member.role]}`}
        >
          {member.role}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail size={13} />
          {member.email}
        </div>
        <span className="text-xs text-gray-400">Joined {member.joinedDate}</span>
      </div>
    </div>
  );
}