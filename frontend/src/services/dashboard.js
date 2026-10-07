import { reports, candidates, resumes, users } from "@/data";
import { respond } from "./client";
import { scopeInterviews, withCandidate } from "./interviews";

const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

const stats = (ivs) => {
  const done = ivs.filter((i) => i.status === "completed");
  return {
    total: ivs.length,
    completed: done.length,
    pending: ivs.filter((i) => i.status === "pending" || i.status === "in_progress").length,
    averageScore: avg(done.map((i) => i.overallScore)),
  };
};

const weeklyTrend = [
  { week: "Aug 24", interviews: 4, avgScore: 71 }, { week: "Aug 31", interviews: 6, avgScore: 74 },
  { week: "Sep 7", interviews: 5, avgScore: 69 }, { week: "Sep 14", interviews: 8, avgScore: 76 },
  { week: "Sep 21", interviews: 7, avgScore: 72 }, { week: "Sep 28", interviews: 9, avgScore: 78 },
  { week: "Oct 5", interviews: 11, avgScore: 80 },
];

export const dashboardService = {
  getOrgOverview(scope) {
    const ivs = scopeInterviews(scope);
    const skillMap = {};
    ivs.forEach((iv) => (reports[iv.id]?.skills || []).forEach((s) => (skillMap[s.name] = [...(skillMap[s.name] || []), s.score])));
    const skillPerformance = Object.entries(skillMap)
      .map(([name, scores]) => ({ name, score: avg(scores), samples: scores.length }))
      .sort((a, b) => b.samples - a.samples || b.score - a.score)
      .slice(0, 7);
    const candIds = [...new Set(ivs.map((i) => i.candidateId))];
    return respond({
      stats: { ...stats(ivs), candidates: candIds.length },
      recentInterviews: ivs.slice(0, 6).map(withCandidate),
      recentCandidates: candIds.slice(0, 5).map((id) => {
        const iv = ivs.find((i) => i.candidateId === id);
        return { ...candidates.find((c) => c.id === id), role: iv.role, score: iv.overallScore, status: iv.status, interviewId: iv.id };
      }),
      skillPerformance,
      weeklyTrend: ivs.length ? weeklyTrend : [],
    });
  },
  getIndividualOverview(userId) {
    const ivs = scopeInterviews({ context: "individual" });
    const user = users[userId];
    return respond({
      stats: stats(ivs),
      recentInterviews: ivs.map(withCandidate),
      resume: resumes[user.resumeId] || null,
      progress: ivs.filter((i) => i.status === "completed").reverse().map((i) => ({ label: i.role, score: i.overallScore })),
    });
  },
};
