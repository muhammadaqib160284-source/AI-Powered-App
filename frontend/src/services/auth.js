import { users, organizations } from "@/data";
import { respond, reject } from "./client";

const hydrateUser = (user) => ({
  ...user,
  organizations: user.memberships.map((m) => ({ ...organizations.find((o) => o.id === m.orgId), role: m.role })),
});

export const authService = {
  login({ email, password }) {
    if (!email || !password) return reject("Enter your email and password.");
    return respond(hydrateUser(users.usr_hreyes), { latency: 900, mutation: true });
  },
  signupIndividual({ name, email }) {
    return respond({ ...hydrateUser(users.usr_hreyes), name: name || users.usr_hreyes.name, email: email || users.usr_hreyes.email }, { latency: 1200, mutation: true });
  },
  signupOrganization({ name, email, organizationName }) {
    const user = hydrateUser(users.usr_hreyes);
    const orgs = organizationName
      ? [{ ...user.organizations[0], name: organizationName }, ...user.organizations.slice(1)]
      : user.organizations;
    return respond({ ...user, name: name || user.name, email: email || user.email, organizations: orgs }, { latency: 1400, mutation: true });
  },
  requestPasswordReset(email) {
    return respond({ email }, { latency: 800, mutation: true });
  },
  logout() {
    return respond(true, { latency: 200, mutation: true });
  },
};
