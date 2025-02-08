import {
  TanstackQueryProvider,
  NuqsProvider,
  ToastProvider,
} from "./components/providers";
import AppRoutes from "./Routes";

function App() {
  return (
    <TanstackQueryProvider>
      <NuqsProvider>
        <AppRoutes />

        <ToastProvider />
      </NuqsProvider>
    </TanstackQueryProvider>
  );
}

export default App;
