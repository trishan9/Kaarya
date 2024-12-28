import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import {
  type CreateWorkspaceSchema,
  createWorkspaceSchema,
} from "@/pages/dashboard/workspaces/_schemas";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
};

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });
  const { mutate, isPending } = useCreateWorkspace();

  const onSubmit = (values: CreateWorkspaceSchema) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const typedKey = key as keyof CreateWorkspaceSchema;
      if (typedKey === "image" && values[typedKey] instanceof File) {
        formData.append("image", values[typedKey] as File);
      } else {
        formData.append(typedKey, values[typedKey] as string);
      }
    });

    mutate(
      {
        data: values,
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          console.log(data);
          // router push data.workspace.id
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create new workspace
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
                            className="absolute inset-0 w-full h-full object-cover"
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
                            className="w-fit mt-2 h-8 bg-red-100 text-red-500 hover:bg-red-100/80 border border-red-200 text-sm font-medium"
                            disabled={isPending}
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) inputRef.current.value = "";
                            }}
                          >
                            Remove Icon
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            type="button"
                            variant="default"
                            className="w-fit mt-2 h-8 bg-green-100 text-green-500 hover:bg-green-100/80 border border-green-200 text-sm font-medium"
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
                size="default"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>

              <Button
                disabled={isPending}
                type="submit"
                size="lg"
                className="px-7"
              >
                Create workspace
                {isPending && <Loader2 className="w-14 h-14 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
