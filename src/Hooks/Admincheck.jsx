import { useSelector } from "react-redux";

export const useIsAdmin = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "TRACK_MANAGER";
};
