import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/hooks/useAuth";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./_components/LoginForm";
import { supabase } from "@/lib/supabase";

export const LoginPage = () => {
  const { mutate, isPending } = useLogin();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flexx items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <LoginForm mutate={mutate} isPending={isPending} />
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          onClick={handleGoogleLogin}
          disabled={isPending}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="size-5 mr-2" />
          Login with Google
        </Button>

        <Button
          onClick={handleGithubLogin}
          disabled={isPending}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FaGithub className="size-5 mr-2" />
          Login with Github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?
          <Link to="/register">
            <span className="text-primaryGreen font-semibold">
              &nbsp;Register
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
