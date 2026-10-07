import { LayoutGrid, MessagesSquare, Users, Plus, FileText, Boxes, UserCog, MailPlus, Settings } from "lucide-react";

const overview = { key: "overview", label: "Overview", to: "/app", icon: LayoutGrid, match: (p) => p === "/app" || p === "/app/" };
const interviews = { key: "interviews", label: "Interviews", to: "/app/interviews", icon: MessagesSquare, match: (p) => p.startsWith("/app/interviews") && p !== "/app/interviews/new" };
const newInterview = { key: "new", label: "New Interview", to: "/app/interviews/new", icon: Plus, perm: "interview:create", denied: "disable" };
const workspaces = { key: "workspaces", label: "Workspaces", to: "/app/workspaces", icon: Boxes };

export const NAVIGATION = {
  individual: [
    { section: "Personal", items: [overview, interviews, newInterview, { key: "resume", label: "Resume", to: "/app/resume", icon: FileText }, workspaces] },
    { section: "Account", items: [{ key: "settings", label: "Profile & Settings", to: "/app/settings", icon: Settings }] },
  ],
  organization: [
    { section: "Hiring", items: [overview, interviews, { key: "candidates", label: "Candidates", to: "/app/candidates", icon: Users }, newInterview, workspaces] },
    {
      section: "Organization",
      items: [
        { key: "members", label: "Members", to: "/app/members", icon: UserCog, perm: "members:view", denied: "hide" },
        { key: "invitations", label: "Invitations", to: "/app/invitations", icon: MailPlus, perm: "invitations:manage", denied: "hide" },
        { key: "settings", label: "Settings", to: "/app/settings", icon: Settings },
      ],
    },
  ],
};
