import { useSelector } from "react-redux";

export const useIsActivityexecutor = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "ACTIVITY_EXECUTOR";
};

