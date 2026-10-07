import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { can as canFn } from "@/lib/permissions";

const KEY = "intervia.session.v1";
const SessionContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

export function SessionProvider({ children }) {
  const [session, setSession] = useState(load);

  useEffect(() => {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  }, [session]);

  const value = useMemo(() => {
    const user = session?.user || null;
    const org = user?.organizations.find((o) => o.id === session.orgId) || null;
    const context = session?.context || "organization";
    const role = session?.role || org?.role || null;
    return {
      user, org, role, context,
      isAuthenticated: !!session,
      orgs: user?.organizations || [],
      scope: { context, orgId: org?.id },
      can: (perm) => canFn(context, role, perm),
      signIn: (u, ctx = "organization") => {
        const first = u.organizations[0];
        setSession({ user: u, context: ctx, orgId: first?.id, role: first?.role });
      },
      signOut: () => setSession(null),
      switchToIndividual: () => setSession((s) => ({ ...s, context: "individual" })),
      switchOrg: (orgId) =>
        setSession((s) => ({ ...s, context: "organization", orgId, role: s.user.organizations.find((o) => o.id === orgId)?.role })),
      setRole: (r) => setSession((s) => ({ ...s, role: r })),
      updateUser: (patch) => setSession((s) => ({ ...s, user: { ...s.user, ...patch } })),
    };
  }, [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
