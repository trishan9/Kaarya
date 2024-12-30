import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
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
import { loginFormSchema } from "../_schemas";

type TLoginFormProps = {
  mutate: UseMutateFunction<
    AxiosResponse<unknown, unknown>,
    CustomAxiosError,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  isPending: boolean;
};

const LoginForm = ({ mutate, isPending }: TLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    mutate(values);
  };

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormItem className="relative">
              <FormControl>
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />
              </FormControl>

              <button
                type="button"
                className="absolute right-0 mr-2 top-0"
                onClick={handleShowPassword}
              >
                {showPassword ? (
                  <EyeIcon className="w-4" />
                ) : (
                  <EyeOffIcon className="w-4" />
                )}
              </button>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
          {isPending && <Loader2 className="w-14 h-14 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
