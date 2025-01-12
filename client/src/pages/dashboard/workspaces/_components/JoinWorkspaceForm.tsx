import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvitePageWorkspaceAvatar } from "./InvitePageWorkspaceAvatar";
import { useJoinWorkspace } from "@/hooks/useWorkspaces";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
    imageUrl: string;
  };
  code: string;
  workspaceId: string;
}

export const JoinWorkspaceForm = ({
  initialValues,
  code: inviteCode,
  workspaceId,
}: JoinWorkspaceFormProps) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        workspaceId,
        inviteCode,
      },
      {
        onSuccess: ({ data }) => {
          navigate(`/workspaces/${data.workspace.id}`);
        },
      },
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7 flex flex-row items-center gap-3">
        <InvitePageWorkspaceAvatar
          name={initialValues.name}
          image={initialValues.imageUrl}
          className="mt-2"
        />
        <div>
          <CardTitle className="text-xl font-bold">Join workspace</CardTitle>

          <CardDescription>
            You&apos;ve been invited to join{" "}
            <strong>{initialValues.name}</strong> workspace
          </CardDescription>
        </div>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button
            className="w-full lg:w-fit"
            disabled={isPending}
            variant="outline"
            type="button"
            size="lg"
            asChild
          >
            <Link to="/">Cancel</Link>
          </Button>

          <Button
            className="w-full lg:w-fit"
            disabled={isPending}
            onClick={onSubmit}
            type="button"
            size="lg"
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
