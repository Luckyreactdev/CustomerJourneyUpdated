import { useSelector } from "react-redux";

export const IsContentmanager = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "CONTENT_MANAGER";
};
