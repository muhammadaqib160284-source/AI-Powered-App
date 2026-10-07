import { ArrowLeft, Mail, Phone, MapPin, Briefcase, CalendarDays, Clock, FileText, Share2, ChevronDown, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/common/Avatar";
import { StatusBadge, RecommendationBadge } from "@/components/common/Badges";
import { ScoreRing } from "@/components/common/ScoreRing";
import { KeyValue } from "@/components/common/Layout";
import { useSession } from "@/context/SessionContext";
import { formatDate, formatTime } from "@/lib/format";

function DecisionMenu({ name }) {
  const { can } = useSession();
  const allowed = can("decision:record");
  const decide = (label) => toast.success(`${name}: ${label}`, { description: "Decision saved to this demo session." });
  if (!allowed)
    return (
      <Tooltip>
        <TooltipTrigger asChild><span><Button size="sm" disabled data-testid="record-decision-button">Record decision</Button></span></TooltipTrigger>
        <TooltipContent>Viewers can't record hiring decisions</TooltipContent>
      </Tooltip>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" data-testid="record-decision-button">Record decision <ChevronDown className="ml-1.5 h-3.5 w-3.5" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={() => decide("advanced to next round")} data-testid="decision-advance"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Advance to next round</DropdownMenuItem>
        <DropdownMenuItem onClick={() => decide("placed on hold")} data-testid="decision-hold"><PauseCircle className="mr-2 h-4 w-4 text-amber-600" /> Put on hold</DropdownMenuItem>
        <DropdownMenuItem onClick={() => decide("rejected")} data-testid="decision-reject"><XCircle className="mr-2 h-4 w-4 text-rose-600" /> Reject</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CandidateHeader({ interview, onBack, onOpenResume, hasResume }) {
  const { candidate: c } = interview;
  const { context } = useSession();
  const share = () => { navigator.clipboard?.writeText(window.location.href); toast.success("Report link copied"); };
  return (
    <section className="rounded-xl border border-slate-200 bg-white" data-testid="candidate-header">
      <div className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          {onBack && (
            <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 lg:hidden" data-testid="detail-back-button">
              <ArrowLeft className="h-4 w-4" /> All interviews
            </button>
          )}
          <div className="flex items-start gap-4">
            <Avatar name={c.name} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold text-slate-950" data-testid="candidate-name">{c.name}</h1>
                <StatusBadge status={interview.status} data-testid="candidate-status" />
              </div>
              <p className="mt-1 text-[15px] text-slate-600" data-testid="candidate-role">{interview.role} <span className="text-slate-400">· {interview.title.split("—")[1]?.trim() || interview.company}</span></p>
              <p className="mt-1 font-mono text-[11px] text-slate-400">{interview.id.toUpperCase()} · created by {interview.createdBy}</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-5 sm:grid-cols-3 xl:grid-cols-4">
            <KeyValue label="Email" icon={Mail}>{c.email}</KeyValue>
            <KeyValue label="Phone" icon={Phone}>{c.phone}</KeyValue>
            <KeyValue label="Location" icon={MapPin}>{c.location}</KeyValue>
            <KeyValue label="Experience" icon={Briefcase}>{c.experience}</KeyValue>
            <KeyValue label="Interview date" icon={CalendarDays}>{interview.interviewDate ? `${formatDate(interview.interviewDate)}, ${formatTime(interview.interviewDate)}` : "Not started"}</KeyValue>
            <KeyValue label="Duration" icon={Clock}>{interview.durationMin ? `${interview.durationMin} min` : "—"}</KeyValue>
            <KeyValue label="Current role" icon={Briefcase}>{c.currentTitle}</KeyValue>
            <KeyValue label="Resume" icon={FileText}>
              {hasResume ? <button onClick={onOpenResume} className="text-blue-600 hover:underline" data-testid="header-view-resume-button">View resume</button> : "Not provided"}
            </KeyValue>
          </dl>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-5 rounded-lg border border-slate-100 bg-slate-50/60 p-4 md:w-[200px] md:flex-col md:text-center">
          <ScoreRing score={interview.overallScore} size={112} stroke={9} testId="header-score-ring" />
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Overall score</p>
            {interview.recommendation ? <RecommendationBadge value={interview.recommendation} data-testid="header-recommendation" /> : <p className="text-xs font-medium text-slate-500">Awaiting evaluation</p>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-3 sm:px-6">
        <Button variant="outline" size="sm" onClick={share} data-testid="share-report-button"><Share2 className="mr-1.5 h-3.5 w-3.5" /> Share</Button>
        {hasResume && <Button variant="outline" size="sm" onClick={onOpenResume} data-testid="open-resume-modal-button"><FileText className="mr-1.5 h-3.5 w-3.5" /> Resume</Button>}
        {context === "organization" && interview.status === "completed" && <DecisionMenu name={c.name} />}
      </div>
    </section>
  );
}
