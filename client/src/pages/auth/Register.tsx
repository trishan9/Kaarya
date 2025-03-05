import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSignup } from "@/hooks/useAuth";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./_components/RegisterForm";
import { supabase } from "@/lib/supabase";

export const RegisterPage = () => {
  const { mutate, isPending } = useSignup();

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Create your account</CardTitle>

        <CardDescription>
          By signing up, you agree to our{" "}
          <Link to="/privacy">
            <span className="text-primaryGreen">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link to="/terms">
            <span className="text-primaryGreen">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <RegisterForm mutate={mutate} isPending={isPending} />
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-2">
        <Button
          onClick={handleGoogleSignup}
          disabled={isPending}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="size-5 mr-2" />
          Signup with Google
        </Button>

        <Button
          onClick={handleGithubSignup}
          disabled={isPending}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FaGithub className="size-5 mr-2" />
          Signup with Github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?
          <Link to="/login">
            <span className="text-primaryGreen font-semibold">&nbsp;Login</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
