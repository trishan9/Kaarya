import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";

const NuqsProvider = ({ children }: { children: ReactNode }) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export default NuqsProvider;
