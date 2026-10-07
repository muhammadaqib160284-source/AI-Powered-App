import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/common/Badges";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ResumeDocument({ resume, name, contact, className }) {
  return (
    <article className={cn("mx-auto w-full max-w-[640px] bg-white px-8 py-9 text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-200", className)} data-testid="resume-document">
      <h3 className="font-display text-2xl font-semibold text-slate-950">{name}</h3>
      <p className="mt-0.5 text-sm text-slate-600">{resume.headline}</p>
      {contact && <p className="mt-2 text-xs text-slate-500">{contact}</p>}
      <hr className="my-5 border-slate-200" />
      <p className="text-[13px] leading-relaxed text-slate-700">{resume.summary}</p>
      <h4 className="mb-3 mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">Experience</h4>
      <div className="space-y-4">
        {resume.experience.map((e) => (
          <div key={e.company + e.period}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{e.title} · <span className="font-medium text-slate-600">{e.company}</span></p>
              <span className="font-mono text-[11px] text-slate-500">{e.period}</span>
            </div>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] text-slate-600">{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        ))}
      </div>
      <h4 className="mb-2 mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">Education</h4>
      <p className="text-[13px] text-slate-700">{resume.education}</p>
      <h4 className="mb-2 mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">Skills</h4>
      <p className="text-[13px] text-slate-700">{resume.skills.join(" · ")}</p>
    </article>
  );
}

export const downloadResume = (resume) => toast.success(`Downloading ${resume.fileName}`, { description: "Demo only — file storage isn't connected yet." });

export function ResumeModal({ open, onOpenChange, resume, candidate }) {
  if (!resume) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0" data-testid="resume-modal">
        <div className="grid max-h-[90vh] md:grid-cols-[1fr_280px]">
          <div className="overflow-y-auto bg-slate-100 p-4 sm:p-8 scrollbar-thin">
            <ResumeDocument resume={resume} name={candidate.name} contact={`${candidate.email} · ${candidate.phone} · ${candidate.location}`} />
          </div>
          <aside className="overflow-y-auto border-l border-slate-200 p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-slate-500" /> Resume</DialogTitle>
              <DialogDescription className="break-all text-xs">{resume.fileName}</DialogDescription>
            </DialogHeader>
            <dl className="mt-5 space-y-3 text-sm">
              {[["Uploaded", formatDate(resume.uploadedAt)], ["Size", `${resume.sizeKb} KB · ${resume.pages} page${resume.pages > 1 ? "s" : ""}`], ["Experience", candidate.experience]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>
              ))}
            </dl>
            <p className="mb-2 mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-500">Parsed skills</p>
            <div className="flex flex-wrap gap-1.5">{resume.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            <Button className="mt-7 w-full" onClick={() => downloadResume(resume)} data-testid="resume-modal-download-button"><Download className="mr-2 h-4 w-4" /> Download resume</Button>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
