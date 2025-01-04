import { useParams } from "react-router";

export const useInviteCode = () => {
    const params = useParams();
    return params.inviteCode as string;
};