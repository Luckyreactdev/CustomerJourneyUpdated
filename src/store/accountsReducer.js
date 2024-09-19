// action - state management

import { LOGIN, LOGOUT } from "./actions/accountsActions";

export const initialState = {
  accessToken: "",
  refreshToken: "",
  isClient: "",
  isVendor: "",
  isStaff: "",
  profile: null,
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      const { isClient, isVendor, accessToken, refreshToken, isStaff } =
        action.payload;
      return {
        ...state,
        isClient,
        isVendor,
        isStaff,
        accessToken,
        refreshToken,
      };
    }
    case LOGOUT: {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("clientProfile");
      localStorage.removeItem("vendorProfile");
      localStorage.removeItem("user_type");

      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        user: null,
        isClient: null,
        isVendor: null,
        isStaff: null,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default accountReducer;
