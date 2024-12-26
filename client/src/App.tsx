import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./Routes";
import ToastProvider from "./components/providers/ToastProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />

      <ToastProvider />
    </QueryClientProvider>
  );
}

export default App;
