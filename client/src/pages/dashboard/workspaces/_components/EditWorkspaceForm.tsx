import { useRef } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CopyIcon, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useConfirm } from "@/hooks/useConfirm";
import { type UpdateWorkspaceSchema, updateWorkspaceSchema } from "../_schemas";
import {
  useDeleteWorkspace,
  useResetInviteCode,
  useUpdateWorkspace,
} from "@/hooks/useWorkspaces";
import type { TWorkspace } from "@/components/WorkspaceSwitcher";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: TWorkspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: deletingWorkspace } =
    useDeleteWorkspace();

  const [DeleteWorkspaceDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "Are you sure you want to delete this workspace?",
    "destructive",
  );

  const { mutate: resetInviteCode, isPending: resetingInviteCode } =
    useResetInviteCode();
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive",
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateWorkspaceSchema>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: UpdateWorkspaceSchema) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const typedKey = key as keyof UpdateWorkspaceSchema;
      if (typedKey === "image" && values[typedKey] instanceof File) {
        formData.append("image", values[typedKey] as File);
      } else {
        formData.append(typedKey, values[typedKey] as string);
      }
    });

    mutate({
      data: values,
      workspaceId: initialValues.id,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        workspaceId: initialValues.id,
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode({
      workspaceId: initialValues.id,
    });
  };

  const absoluteInviteLink = `${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteWorkspaceDialog />

      <ResetDialog />

      <Card className="border shadow-none size-full">
        <CardHeader className="flex flex-row items-center space-y-0 gap-x-4">
          <Button
            variant="outline"
            onClick={
              onCancel
                ? onCancel
                : () => navigate(`/workspaces/${initialValues.id}`)
            }
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>

          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <img
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Workspace Icon"
                              className="absolute inset-0 object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPEG, PNG, SVG, or JPEG, max 1 mb
                          </p>
                          <input
                            hidden
                            type="file"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            accept=".jpg, .jpeg, .png, .svg"
                          />
                          {field.value ? (
                            <Button
                              size="sm"
                              type="button"
                              variant="default"
                              className="h-8 mt-2 text-sm font-medium text-red-500 bg-red-100 border border-red-200 w-fit hover:bg-red-100/80"
                              disabled={isPending}
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current)
                                  inputRef.current.value = "";
                              }}
                            >
                              Remove Icon
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              type="button"
                              variant="default"
                              className="h-8 mt-2 text-sm font-medium text-green-500 bg-green-100 border border-green-200 w-fit hover:bg-green-100/80"
                              disabled={isPending}
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Icon
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>

              <DottedSeparator className="py-7" />

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>

                <Button
                  disabled={isPending || deletingWorkspace || resetingInviteCode}
                  type="submit"
                  size="sm"
                  className="px-5"
                >
                  Save Changes
                  {isPending && <Loader2 className="w-14 h-14 animate-spin" />}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border shadow-none size-full">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={absoluteInviteLink} readOnly />

                <Button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(absoluteInviteLink)
                      .then(() => toast.success("Copied to clipboard"));
                  }}
                  variant="outline"
                  className="size-10"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <Button
              className="px-4 mt-6 ml-auto border w-fit"
              size="sm"
              variant="secondary"
              disabled={isPending || deletingWorkspace || resetingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite link
              {resetingInviteCode && <Loader2 className="w-14 h-14 animate-spin" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-none size-full">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>

            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data
            </p>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 ml-auto w-fit"
              size="sm"
              variant="destructive"
              disabled={isPending || deletingWorkspace}
              onClick={handleDelete}
            >
              Delete workspace
              {deletingWorkspace && <Loader2 className="w-14 h-14 animate-spin" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
