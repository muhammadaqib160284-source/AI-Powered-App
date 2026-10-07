import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { interviewsService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { DetailSkeleton, ErrorState } from "@/components/common/States";
import { VideoModal } from "@/components/media/VideoModal";
import { ResumeModal } from "@/components/media/Resume";
import { CandidateHeader } from "./CandidateHeader";
import { OverviewTab, SkillsTab, TranscriptTab, ReportTab, RecordingTab } from "./DetailTabs";

const TABS = [
  { key: "overview", label: "Overview", C: OverviewTab },
  { key: "skills", label: "Skills", C: SkillsTab },
  { key: "transcript", label: "Interview", C: TranscriptTab },
  { key: "report", label: "Report", C: ReportTab },
  { key: "recording", label: "Recording", C: RecordingTab },
];

export function InterviewDetail({ id, onBack }) {
  const { data, loading, error, reload } = useAsync(() => interviewsService.getDetail(id), [id]);
  const [tab, setTab] = useState("overview");
  const [video, setVideo] = useState({ open: false, at: 0 });
  const [resumeOpen, setResumeOpen] = useState(false);

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const Active = TABS.find((t) => t.key === tab).C;
  const openVideo = (at = 0) => data.recording?.status === "ready" && setVideo({ open: true, at });

  return (
    <div className="space-y-5" data-testid="interview-detail">
      <CandidateHeader interview={data.interview} onBack={onBack} hasResume={!!data.resume} onOpenResume={() => setResumeOpen(true)} />
      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mx-1 overflow-x-auto px-1">
          <TabsList className="h-10 bg-slate-100/80">
            {TABS.map((t) => <TabsTrigger key={t.key} value={t.key} className="px-3.5 text-[13px]" data-testid={`interview-tab-${t.key}`}>{t.label}</TabsTrigger>)}
          </TabsList>
        </div>
      </Tabs>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <Active detail={data} goTab={setTab} onOpenVideo={openVideo} onOpenResume={() => setResumeOpen(true)} />
        </motion.div>
      </AnimatePresence>
      <VideoModal open={video.open} startAt={video.at} onOpenChange={(o) => setVideo((v) => ({ ...v, open: o }))} recording={data.recording} interview={data.interview} />
      <ResumeModal open={resumeOpen} onOpenChange={setResumeOpen} resume={data.resume} candidate={data.interview.candidate} />
    </div>
  );
}
