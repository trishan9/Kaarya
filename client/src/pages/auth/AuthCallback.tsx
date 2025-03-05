import { api } from "@/api";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/state-stores/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setStreamToken = useAuthStore((state) => state.setStreamToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("No session found");
        }

        const response = await api.post("/auth/supabase", {
          email: session.user.email,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0],
          providerId: session.user.id,
          provider: session.user.app_metadata.provider,
        });

        const { accessToken, streamToken } = response.data;
        setAccessToken(accessToken);
        setStreamToken(streamToken);

        const userResponse = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(userResponse.data.data);

        toast.success("You have logged in successfully. Welcome back!");
        navigate("/");
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
      }
    }

    handleAuthCallback();
  }, [navigate, setAccessToken, setStreamToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}
