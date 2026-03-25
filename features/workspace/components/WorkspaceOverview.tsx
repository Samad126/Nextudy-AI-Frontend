"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BookOpen, FileText, Shuffle, Layers, Users, Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useGetWorkspaces } from "../queries/use-get-workspaces"
import { useGetMembers } from "../queries/use-get-members"
import { useGetWorkspaceOverview } from "../queries/use-get-workspace-overview"
import { WorkspaceTutorial } from "./WorkspaceTutorial"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  colorClass,
}: {
  label: string
  value: number | undefined
  icon: React.ElementType
  href: string
  colorClass: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <div className={cn("rounded-lg p-2.5", colorClass)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tabular-nums text-foreground">
          {value ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <ArrowRight className="ml-auto size-4 text-transparent transition-colors group-hover:text-muted-foreground" />
    </Link>
  )
}

function RecentItem({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="ml-2 size-3.5 shrink-0 text-transparent transition-colors group-hover:text-muted-foreground" />
    </Link>
  )
}

function RecentSection({
  title,
  href,
  children,
}: {
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Link
          href={href}
          className="text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          View all
        </Link>
      </div>
      <div className="px-1 pb-3">{children}</div>
    </div>
  )
}

function EmptyRow({ label }: { label: string }) {
  return (
    <p className="px-3 py-2 text-xs text-muted-foreground">{label}</p>
  )
}

export function WorkspaceOverview() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const base = `/workspaces/${id}`

  const { data: workspaces } = useGetWorkspaces()
  const { data: members } = useGetMembers(workspaceId)
  const { data: overview } = useGetWorkspaceOverview(workspaceId)

  const workspace = workspaces?.find((ws) => ws.id === workspaceId)

  const recentWorkbenches = overview?.recentWorkbenches ?? []
  const recentQuizzes = overview?.recentQuizzes ?? []
  const recentFlashcardSets = overview?.recentFlashcardSets ?? []

  return (
    <>
      <WorkspaceTutorial />

      <div className="flex flex-col gap-8">
        {/* Workspace header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {workspace?.name ?? "Workspace"}
          </h1>
          {workspace?.description && (
            <p className="mt-1 text-muted-foreground">{workspace.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {members !== undefined && (
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                {members.length} member{members.length !== 1 ? "s" : ""}
              </span>
            )}
            {workspace?.created_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Created {format(new Date(workspace.created_at), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Resources"
            value={overview?.counts.resources}
            icon={FileText}
            href={`${base}/resources`}
            colorClass="bg-sky-500/10 text-sky-500"
          />
          <StatCard
            label="Workbenches"
            value={overview?.counts.workbenches}
            icon={BookOpen}
            href={`${base}/workbenches`}
            colorClass="bg-teal-500/10 text-teal-500"
          />
          <StatCard
            label="Quizzes"
            value={overview?.counts.quizzes}
            icon={Shuffle}
            href={`${base}/quizzes`}
            colorClass="bg-green-500/10 text-green-500"
          />
          <StatCard
            label="Flashcard Sets"
            value={overview?.counts.flashcardSets}
            icon={Layers}
            href={`${base}/flashcards`}
            colorClass="bg-amber-500/10 text-amber-500"
          />
        </div>

        {/* Recent sections */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RecentSection title="Recent Workbenches" href={`${base}/workbenches`}>
            {recentWorkbenches.length > 0 ? (
              recentWorkbenches.map((wb) => (
                <RecentItem
                  key={wb.id}
                  title={wb.name}
                  subtitle={format(new Date(wb.created_at), "MMM d, yyyy")}
                  href={`${base}/workbenches/${wb.id}`}
                />
              ))
            ) : (
              <EmptyRow label="No workbenches yet" />
            )}
          </RecentSection>

          <RecentSection title="Recent Quizzes" href={`${base}/quizzes`}>
            {recentQuizzes.length > 0 ? (
              recentQuizzes.map((q) => (
                <RecentItem
                  key={q.id}
                  title={q.title}
                  subtitle={format(new Date(q.created_at), "MMM d, yyyy")}
                  href={`${base}/quizzes/${q.id}`}
                />
              ))
            ) : (
              <EmptyRow label="No quizzes yet" />
            )}
          </RecentSection>

          <RecentSection title="Recent Flashcard Sets" href={`${base}/flashcards`}>
            {recentFlashcardSets.length > 0 ? (
              recentFlashcardSets.map((fs) => (
                <RecentItem
                  key={fs.id}
                  title={fs.title}
                  subtitle={format(new Date(fs.created_at), "MMM d, yyyy")}
                  href={`${base}/flashcards/${fs.id}`}
                />
              ))
            ) : (
              <EmptyRow label="No flashcard sets yet" />
            )}
          </RecentSection>
        </div>
      </div>
    </>
  )
}
