import { useSelector } from "react-redux";

export const useIsContentManager = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "CONTENT_MANAGER";
};
