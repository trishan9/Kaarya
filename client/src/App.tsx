import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import AppRoutes from "./Routes";
import ToastProvider from "./components/providers/ToastProvider";
import { useAuthStore } from "./state-stores/auth";
import { useGetMe } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AuthWrapper = () => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isLoading } = useGetMe();

  if (user) {
    console.log(user.data);
    setUser(user?.data?.data);
    setIsAuthenticated(true);
  }

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#F5F7F6]">
        <Loader2 className="animate-spin" />
      </div>
    );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper />

      <AppRoutes />

      <ToastProvider />
    </QueryClientProvider>
  );
}

export default App;
