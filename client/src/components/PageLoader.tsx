import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#F5F7F6]">
      <Loader2 className="animate-spin size-6" />
    </div>
  );
};
