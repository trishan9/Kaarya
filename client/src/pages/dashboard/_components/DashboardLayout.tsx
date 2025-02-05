import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CreateWorkspaceModal } from "../workspaces/_components/CreateWorkspaceModal";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { PageLoader } from "@/components/PageLoader";
import { PageError } from "@/components/PageError";
import { CreateProjectModal } from "../projects/_components/CreateProjectModal";
import { CreateTaskModal } from "../tasks/_components/CreateTaskModal";
import { EditTaskModal } from "../tasks/_components/EditTaskModal";
import { CreateLogModal } from "../projects/_components/CreateLogModal";
import { EditLogModal } from "../projects/_components/EditLogModal";

const DashboardLayout = () => {
  const workspaceId: string = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ workspaceId });
  const workspace = data?.data?.workspace;

  if (isLoading) return <PageLoader />;
  if (!workspace) return <PageError message="Failed to load workspace data" />;

  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <EditLogModal />
      <CreateLogModal />

      <div className="flex h-full w-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>

        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-3xl h-full">
            <Navbar />

            <main className="h-[90%] py-8 px-6 flex flex-col">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
