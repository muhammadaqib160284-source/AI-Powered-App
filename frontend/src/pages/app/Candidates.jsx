import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MoreHorizontal, ArrowUpDown, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/Layout";
import { Restricted } from "@/components/common/Restricted";
import { TableSkeleton, ErrorState, EmptyState } from "@/components/common/States";
import { Avatar } from "@/components/common/Avatar";
import { StatusBadge, Chip } from "@/components/common/Badges";
import { ScorePill } from "@/components/common/ScoreRing";
import { candidatesService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { useSession } from "@/context/SessionContext";
import { formatDate } from "@/lib/format";

function RowActions({ c }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" onClick={(e) => e.stopPropagation()} data-testid={`candidate-actions-${c.id}`}><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/app/candidates/${c.id}`)}>View profile</DropdownMenuItem>
        {c.latestInterview && <DropdownMenuItem onClick={() => navigate(`/app/interviews/${c.latestInterview.id}`)}>Open interview</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(c.email)}>Copy email</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function CandidatesPage() {
  const { scope, org } = useSession();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => candidatesService.list(scope), [scope.orgId]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sortScore, setSortScore] = useState(false);

  const rows = useMemo(() => {
    let r = (data || []).filter((c) => (status === "all" || c.latestInterview?.status === status) && `${c.name} ${c.email} ${c.latestInterview?.role}`.toLowerCase().includes(q.toLowerCase()));
    if (sortScore) r = [...r].sort((a, b) => (b.latestInterview?.score ?? -1) - (a.latestInterview?.score ?? -1));
    return r;
  }, [data, q, status, sortScore]);

  return (
    <Restricted perm="candidate:view">
      <PageHeader eyebrow={org?.name} title="Candidates" description="Everyone who has been invited to an AI interview, with their latest evaluation." />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search candidates" className="bg-white pl-9" data-testid="candidate-search-input" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full bg-white sm:w-44" data-testid="candidate-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[["all", "All statuses"], ["completed", "Completed"], ["in_progress", "In progress"], ["pending", "Pending"], ["expired", "Expired"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {loading && <TableSkeleton cols={5} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && data.length === 0 && <EmptyState icon={Users} title="No candidates yet" description="Candidates appear here as soon as you send them an interview." action={<Link className="text-sm font-medium text-blue-600" to="/app/interviews/new">Create an interview</Link>} />}
      {data && data.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block" data-testid="candidates-table">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead>Candidate</TableHead><TableHead>Role</TableHead><TableHead className="hidden xl:table-cell">Interview</TableHead>
                  <TableHead><button onClick={() => setSortScore((s) => !s)} className="inline-flex items-center gap-1 hover:text-slate-900" data-testid="sort-by-score-button">Score <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead className="hidden lg:table-cell">Skills</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/app/candidates/${c.id}`)} data-testid={`candidate-row-${c.id}`}>
                    <TableCell><div className="flex items-center gap-3"><Avatar name={c.name} size="sm" /><div className="min-w-0"><p className="truncate font-medium text-slate-900">{c.name}</p><p className="truncate text-xs text-slate-500">{c.email}</p></div></div></TableCell>
                    <TableCell className="text-slate-700">{c.latestInterview?.role}</TableCell>
                    <TableCell className="hidden max-w-[220px] truncate text-slate-500 xl:table-cell">{c.latestInterview?.title}</TableCell>
                    <TableCell><ScorePill score={c.latestInterview?.score} /></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="flex gap-1">{c.latestInterview?.skills.slice(0, 2).map((s) => <Chip key={s}>{s}</Chip>)}{c.latestInterview?.skills.length > 2 && <Chip className="text-slate-400">+{c.latestInterview.skills.length - 2}</Chip>}</div></TableCell>
                    <TableCell><StatusBadge status={c.latestInterview?.status} /></TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">{formatDate(c.latestInterview?.date)}</TableCell>
                    <TableCell><RowActions c={c} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No candidates match your filters.</p>}
          </div>
          <div className="space-y-2 md:hidden" data-testid="candidates-mobile-list">
            {rows.map((c) => (
              <Link key={c.id} to={`/app/candidates/${c.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <Avatar name={c.name} size="sm" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{c.name}</p><p className="truncate text-xs text-slate-500">{c.latestInterview?.role}</p><StatusBadge status={c.latestInterview?.status} className="mt-1.5" /></div>
                <ScorePill score={c.latestInterview?.score} />
              </Link>
            ))}
          </div>
        </>
      )}
    </Restricted>
  );
}
