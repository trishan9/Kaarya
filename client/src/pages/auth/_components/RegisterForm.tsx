import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { CustomAxiosError } from "@/api/axiosInstance";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerFormSchema } from "../_schemas";

type TRegisterFormProps = {
  mutate: UseMutateFunction<
    AxiosResponse<unknown, unknown>,
    CustomAxiosError,
    {
      name: string;
      email: string;
      password: string;
    },
    unknown
  >;
  isPending: boolean;
};

const RegisterForm = ({ mutate, isPending }: TRegisterFormProps) => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerFormSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Enter your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Creating your account..." : "Register"}
          {isPending && <Loader2 className="w-14 h-14 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
