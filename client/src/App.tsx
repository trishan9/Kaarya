import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from 'nuqs/adapters/react'
import AppRoutes from "./Routes";
import ToastProvider from "./components/providers/ToastProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
      <AppRoutes />

      <ToastProvider />
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

export default App;
