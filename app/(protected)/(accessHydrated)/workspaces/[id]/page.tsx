"use client"

import { EmptyRow } from "@/features/workspace/components/overview/EmptyRow"
import { RecentItem } from "@/features/workspace/components/overview/RecentItem"
import { RecentSection } from "@/features/workspace/components/overview/RecentSection"
import { StatCard } from "@/features/workspace/components/overview/StatCard"
import { WorkspaceTutorial } from "@/features/workspace/components/overview/WorkspaceTutorial"
import { useGetMembers } from "@/features/workspace/queries/use-get-members"
import { useGetWorkspaceOverview } from "@/features/workspace/queries/use-get-workspace-overview"
import { useGetWorkspaces } from "@/features/workspace/queries/use-get-workspaces"
import { PageError } from "@/shared/components/page-error"
import { Skeleton } from "@/shared/ui/skeleton"
import { format } from "date-fns"
import { BookOpen, Calendar, FileText, Layers, Shuffle, Users } from "lucide-react"
import { useParams } from "next/navigation"

export default function WorkspaceHome() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = Number(id)
  const base = `/workspaces/${id}`

  const { data: workspaces } = useGetWorkspaces()
  const { data: members } = useGetMembers(workspaceId)
  const { data: overview, isLoading: overviewLoading, error: overviewError, refetch } = useGetWorkspaceOverview(workspaceId)

  const workspace = workspaces?.find((ws) => ws.id === workspaceId)

  const recentWorkbenches = overview?.recentWorkbenches ?? []
  const recentQuizzes = overview?.recentQuizzes ?? []
  const recentFlashcardSets = overview?.recentFlashcardSets ?? []

  if (overviewError) {
    return <PageError error={overviewError} onRetry={refetch} />
  }

  return (
    <>
      <WorkspaceTutorial />

      <div className="container flex flex-col gap-8">
        {/* Workspace header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {workspace?.name ?? "Workspace"}
          </h1>
          {workspace?.description && (
            <p className="mt-1 text-muted-foreground">
              {workspace.description}
            </p>
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
          {overviewLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Recent sections */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {overviewLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            <>
              <RecentSection
                title="Recent Workbenches"
                href={`${base}/workbenches`}
              >
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

              <RecentSection
                title="Recent Flashcard Sets"
                href={`${base}/flashcards`}
              >
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
