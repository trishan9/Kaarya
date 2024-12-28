import { useNavigate } from "react-router";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/pages/dashboard/workspaces/_components/WorkspaceAvatar";
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkspaceModal";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();
  const { open } = useCreateWorkspaceModal();
  const workspaces = [
    {
      id: "W-1234",
      name: "Trishan's Workspace",
      imageUrl: "",
    },
    {
      id: "W-1244",
      name: "Nischay's Workspace",
      imageUrl: "https://cdn.worldvectorlogo.com/logos/react-1.svg",
    },
  ];

  const onSelect = (id: string) => {
    navigate(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>

        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 py-6">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.map((workspace) => (
            <SelectItem value={workspace.id} key={workspace.id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
