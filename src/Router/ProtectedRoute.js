import { useSelector } from "react-redux";
import { Navigate } from "react-router";


const ProtectedRoute = ({ children, user, is_client, is_staff }) => {
  // const loggedUser = JSON.parse(localStorage.getItem("user"))
  const { isClient, isStaff } = useSelector((state) => state.account);

  let content =
    isClient === is_client || isStaff === is_staff ? (
      children
    ) : (
      <Navigate to="/" />
    );
  //   console.log(JSON.parse(loggedUser));
  return <>{content}</>;
};

export default ProtectedRoute;
