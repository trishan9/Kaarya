import { Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./Routes";
import ToastProvider from "./components/providers/ToastProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p className="p-6">Loading...</p>}>
        <AppRoutes />

        <ToastProvider />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
