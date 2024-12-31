import { Navigate } from "react-router";
import { PageLoader } from "@/components/PageLoader";
import { useGetWorkspaces } from "@/hooks/useWorkspaces";

const Home = () => {
  const { data, isPending } = useGetWorkspaces();
  const workspaces = data?.data?.workspaces;

  if (isPending) {
    return <PageLoader />;
  }

  if (workspaces?.length == 0) {
    return <Navigate to="/workspaces/create" replace />;
  } else {
    return <Navigate to={`/workspaces/${workspaces[0].id}`} replace />;
  }
};

export default Home;
