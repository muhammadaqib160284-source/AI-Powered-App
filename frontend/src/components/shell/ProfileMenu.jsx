import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, LogOut, Settings, User, Building2, Shield } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/common/Avatar";
import { RoleBadge } from "@/components/common/Badges";
import { useSession } from "@/context/SessionContext";
import { ROLES, ROLE_META } from "@/lib/permissions";

export function ContextOptions({ onDone }) {
  const { orgs, org, context, switchOrg, switchToIndividual } = useSession();
  const navigate = useNavigate();
  const pick = (fn, label) => { fn(); navigate("/app"); toast.success(`Switched to ${label}`); onDone?.(); };
  return (
    <>
      <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Individual</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => pick(switchToIndividual, "your personal account")} data-testid="context-option-individual">
        <User className="mr-2 h-4 w-4 text-slate-500" /> Personal account
        {context === "individual" && <Check className="ml-auto h-4 w-4" />}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Organizations</DropdownMenuLabel>
      {orgs.map((o) => (
        <DropdownMenuItem key={o.id} onClick={() => pick(() => switchOrg(o.id), o.name)} data-testid={`context-option-${o.slug}`}>
          <Building2 className="mr-2 h-4 w-4 text-slate-500" />
          <span className="flex-1">{o.name}</span>
          <RoleBadge role={o.role} className="ml-2" />
          {context === "organization" && org?.id === o.id && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function ProfileMenu() {
  const { user, org, role, context, setRole, signOut } = useSession();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-600" data-testid="profile-menu-trigger">
        <Avatar name={user.name} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900" data-testid="profile-menu-name">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mx-2 mb-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
          {context === "individual" ? "Using your personal account" : <span className="flex items-center justify-between">{org?.name}<RoleBadge role={role} /></span>}
        </div>
        <DropdownMenuSeparator />
        <ContextOptions />
        {context === "organization" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="profile-role-submenu"><Shield className="mr-2 h-4 w-4 text-slate-500" /> Demo role: {role}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                <DropdownMenuRadioGroup value={role} onValueChange={(r) => { setRole(r); toast(`Previewing as ${r}`, { description: ROLE_META[r].description }); }}>
                  {ROLES.map((r) => (
                    <DropdownMenuRadioItem key={r} value={r} data-testid={`profile-role-option-${r.toLowerCase()}`}>
                      <div><p className="text-sm font-medium">{ROLE_META[r].label}</p><p className="text-[11px] text-slate-500">{ROLE_META[r].description}</p></div>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/app/settings")} data-testid="profile-settings-link"><Settings className="mr-2 h-4 w-4 text-slate-500" /> Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { signOut(); navigate("/login"); toast("You've been signed out"); }} className="text-rose-600 focus:text-rose-700" data-testid="profile-logout-button">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
