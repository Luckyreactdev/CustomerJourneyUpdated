import { toast } from "react-toastify";
import { LOGOUT } from "../../store/actions/accountsActions";
import { axiosInstance } from "../axios/axios";
import { baseURL, logoutUrl } from "../endpoints/api_endpoints";
import axios from "axios";

// export const handleLogout = (dispatch, navigate) => {
//   const token = localStorage.getItem("refreshToken");
//   const data = {
//     refresh_token: token,
//   };

//   axiosInstance
//     .post(`${logoutUrl}`, data)
//     .then((response) => {
//       // console.log(response.data);
//       if (response.data) {
//         dispatch({ type: LOGOUT });
//         document.cookie.split(";").forEach(function (c) {
//           document.cookie = c
//             .replace(/^ +/, "")
//             .replace(
//               /=.*/,
//               "=;expires=" + new Date().toUTCString() + ";path=/"
//             );
//         });
//         navigate("/");
//         toast.success("Log out Successful");
//       }
//     })
//     .catch((err) => console.log(err));
// };

// New handleHabotechLogout function
export const handleHabotechLogout = (dispatch, navigate) => {
  const token = localStorage.getItem("refreshToken");
  const data = {
    refresh_token: token,
  };
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Token ${accessToken}`,
    "Content-Type": "application/json",
  };
  axios
    .post(`${baseURL}${logoutUrl}`, data, { headers })
    .then((response) => {
      console.log(response.data);
      navigate("/");
      toast.success("Log out Successful");
      if (response.data) {
        dispatch({ type: LOGOUT });
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      }
    })
    .catch((err) => console.log(err));
};
