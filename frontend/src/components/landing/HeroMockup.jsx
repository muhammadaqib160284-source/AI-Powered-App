import { useEffect, useState } from "react";
import { Mic, Video, Captions, PhoneOff, Circle, Check, Loader2, Minus } from "lucide-react";
import { Waveform, CandidateFeed } from "@/components/media/VideoPlayer";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  "Tell me about your backend development experience and the largest system you've owned.",
  "How would you design a scalable API for a multi-tenant SaaS platform?",
  "A query on a 400M-row table has become slow. Walk me through your investigation.",
];
const SIGNALS = [
  { skill: "Node.js", state: "done", note: "3 evidence points" },
  { skill: "REST API Design", state: "done", note: "2 evidence points" },
  { skill: "System Design", state: "active", note: "Evaluating answer" },
  { skill: "PostgreSQL", state: "todo", note: "Next" },
];

function useTyping() {
  const [q, setQ] = useState(1);
  const [n, setN] = useState(0);
  useEffect(() => {
    const text = QUESTIONS[q];
    if (n < text.length) { const t = setTimeout(() => setN(n + 1), 28); return () => clearTimeout(t); }
    const t = setTimeout(() => { setQ((q + 1) % QUESTIONS.length); setN(0); }, 4200);
    return () => clearTimeout(t);
  }, [n, q]);
  return { text: QUESTIONS[q].slice(0, n), index: q };
}

export function HeroMockup() {
  const { text, index } = useTyping();
  const [sec, setSec] = useState(1122);
  useEffect(() => { const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t); }, []);

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#0E1422] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]" data-testid="hero-interview-mockup">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] text-rose-400"><Circle className="h-1.5 w-1.5 animate-pulse fill-current" />LIVE</span>
        <span className="text-[13px] font-medium text-slate-200">Senior Backend Engineer</span>
        <span className="hidden text-xs text-slate-500 sm:inline">· Northwind Labs</span>
        <span className="ml-auto font-mono text-xs tabular text-slate-400">{formatClock(sec)}</span>
      </div>
      <div className="flex items-center gap-1 px-3 pb-3">
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className={cn("h-1 flex-1 rounded-full", i < index + 2 ? "bg-blue-500" : i === index + 2 ? "bg-blue-500/40" : "bg-slate-800")} />)}
        <span className="ml-2 whitespace-nowrap font-mono text-[10px] text-slate-500">Q{index + 3}/8</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0B0F17] p-4" data-testid="hero-ai-interviewer-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">AI Interviewer</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300"><span className="h-1 w-1 rounded-full bg-blue-400" />Speaking</span>
          </div>
          <div className="my-5 flex items-center gap-3">
            <span className="relative flex h-14 w-14 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-blue-500/30" />
              <span className="absolute inset-1.5 rounded-full border border-blue-400/40" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600"><Waveform bars={4} className="h-3 gap-[2px]" color="bg-white" /></span>
            </span>
            <div><p className="text-sm font-semibold text-white">Ava</p><p className="text-[11px] text-slate-500">Intervia interviewer · Backend track</p></div>
          </div>
          <p className="caret min-h-[66px] text-[14px] leading-relaxed text-slate-200">“{text}</p>
          <Waveform bars={28} className="mt-4 h-5 opacity-70" color="bg-blue-500/70" />
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-slate-800" data-testid="hero-candidate-panel">
          <CandidateFeed name="Sarah Khan" />
          <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Candidate</div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium text-rose-300"><Circle className="h-1.5 w-1.5 fill-rose-500 text-rose-500" />Recording</span>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg bg-black/50 px-3 py-2">
            <div><p className="text-[13px] font-medium text-white">Sarah Khan</p><p className="text-[10.5px] text-slate-400">Toronto · 8 yrs experience</p></div>
            <Waveform bars={6} className="h-3.5" color="bg-emerald-400" />
          </div>
        </div>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-slate-800 bg-[#0B0F17] px-4 py-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Skill coverage</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {SIGNALS.map((s) => (
              <div key={s.skill} className="flex items-center gap-2 text-[12px]">
                {s.state === "done" ? <Check className="h-3 w-3 text-emerald-400" /> : s.state === "active" ? <Loader2 className="h-3 w-3 animate-spin text-blue-400" /> : <Minus className="h-3 w-3 text-slate-600" />}
                <span className={s.state === "todo" ? "text-slate-500" : "text-slate-200"}>{s.skill}</span>
                <span className="ml-auto hidden text-[10.5px] text-slate-500 md:inline">{s.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-[#0B0F17] px-3 py-3">
          {[Mic, Video, Captions].map((I, i) => <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-slate-300"><I className="h-3.5 w-3.5" /></span>)}
          <span className="flex h-8 w-10 items-center justify-center rounded-lg bg-rose-600 text-white"><PhoneOff className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </div>
  );
}
