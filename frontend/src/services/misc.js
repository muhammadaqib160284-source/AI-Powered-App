import { resumes, users, notifications, interviews, candidates } from "@/data";
import { respond, reject } from "./client";
import { scopeInterviews, withCandidate } from "./interviews";

export const resumesService = {
  getCurrent(userId) {
    return respond(resumes[users[userId].resumeId] || null);
  },
  getById(id) {
    return respond(resumes[id] || null);
  },
  upload(file, userId) {
    if (!file) return reject("Choose a PDF or DOCX file to upload.");
    if (file.size > 10 * 1024 * 1024) return reject("Files must be smaller than 10 MB.");
    const base = resumes[users[userId].resumeId];
    const next = { ...base, fileName: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), uploadedAt: new Date().toISOString() };
    resumes[base.id] = next;
    return respond(next, { latency: 1600, mutation: true });
  },
};

export const notificationsService = {
  list() {
    return respond(notifications);
  },
  markAllRead() {
    notifications.forEach((n) => (n.read = true));
    return respond(notifications, { latency: 200, mutation: true });
  },
};

export const searchService = {
  getIndex(scope) {
    const ivs = scopeInterviews(scope).map(withCandidate);
    const candIds = [...new Set(ivs.map((i) => i.candidateId))];
    return respond({
      interviews: ivs.map((i) => ({ id: i.id, title: i.title, candidate: i.candidate.name, role: i.role, status: i.status, score: i.overallScore })),
      candidates: candIds.map((id) => {
        const c = candidates.find((x) => x.id === id);
        return { id: c.id, name: c.name, email: c.email, role: interviews.find((i) => i.candidateId === id)?.role };
      }),
      roles: [...new Set(ivs.map((i) => i.role))],
    }, { latency: 150 });
  },
};
