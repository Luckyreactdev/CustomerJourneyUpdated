import { useSelector } from "react-redux";

export const IsSeomanager = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "SEO_MANAGER";
};
