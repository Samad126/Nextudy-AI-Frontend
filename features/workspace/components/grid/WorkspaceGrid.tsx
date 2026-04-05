import { Skeleton } from "@/shared/ui/skeleton"
import { useGetWorkspaces } from "../../queries/use-get-workspaces"
import WorkspaceItem from "./WorkspaceItem"
import NewWorkspaceCard from "./NewWorkspaceCard"

function WorkspaceGrid() {
  const { data, isLoading } = useGetWorkspaces()

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      {!isLoading && data?.map((ws) => <WorkspaceItem ws={ws} key={ws.id} />)}

      <NewWorkspaceCard />
    </div>
  )
}

export default WorkspaceGrid
