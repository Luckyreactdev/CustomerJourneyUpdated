import { useSelector } from "react-redux";

export const useTrackmanager = () => {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  return savedUserInfo?.user_profile?.user?.type === "TRACK_MANAGER";

};

