import React, { useCallback } from "react";
import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { LOGIN } from "../../../store/actions/accountsActions";
import { axiosInstance } from "../../../helpers/axios/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import "../../CustomerJourney/Signin/Signin.css"
import "../../CustomerJourney/Signin/ResetPassword.css";
import "../../Habotech//Habotech.css";
import AdminFooter from "../../Footer/AdminFooter";
import {
  baseURL,
  accountLogin,
} from "../../../helpers/endpoints/api_endpoints";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";

function Signup() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { register, handleSubmit } = useForm({});

  const authenticateUser = (data) => {
    const accessToken = data.token;
    const userInfo = data.user_profile;
    const payload = {
      accessToken,
      userInfo,
    };
    dispatch({ type: LOGIN, payload: payload });
    localStorage.setItem("accessToken", accessToken);
    setIsLoggingIn(false);
    navigate("/customer-journey");
  };

  const handleUserLogin = useCallback((data) => {
    // console.log(data);
    setIsLoggingIn(true);
    axiosInstance
      .post(`${accountLogin}`, data)
      .then((response) => {
        // console.log(response.data);
        toast.success("Log in Successful");
        const responseData = response.data;
        authenticateUser(responseData);
        setIsLoggingIn(false);
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          toast.error(
            `${error.response?.data?.message}.Please check your email...`
          );

          navigate(`/otp/${data?.email}`);
        }
        if (error.response?.data?.refresh) {
          toast.error(`Invalid email or password`);
        }

        setIsLoggingIn(false);
        console.log("login error >>>", error);
      });
  }, []);

  const togglePassword = (field) => {
    if (field === "password") {
      setPasswordShown(!passwordShown);
    } else if (field === "confirmPassword") {
      setConfirmPasswordShown(!confirmPasswordShown);
    }
  };
  return (
    <div>
      <Helmet>
        <title>Customer Journey</title>
        <meta
          name="description"
          content="Customer Journey."
        />
      </Helmet>
      <HabotAppBar/>
      <div className="signin-page habotech-signin">
        <div className="signin-container">
          <div className="signinBox p-3 p-md-5">
            <div>
              <div className="white-continer">
                <div className="wlcHeader">
                  <p className="wlc-sign">
                    Welcome <span className="habot">HABOTECH</span>
                  </p>
                </div>
              </div>
              <div className="login-container mt-3">
                <form
                  onSubmit={handleSubmit(handleUserLogin)}
                  className="login-frm"
                >
                  <p className="fw-bold fontEighteen m-auto mb-2">
                    Full Name
                    <span className="text-danger fs-3 fw-bold asterisk">*</span>
                  </p>
                  <input
                    type="text"
                    placeholder="eg. Jamie Claine"
                    className="login-field"
                    {...register("name", { required: true })}
                  />

                  <p className="fw-bold fontEighteen m-auto mb-2">
                    Email Address{" "}
                    <span className="text-danger fs-3 fw-bold asterisk">*</span>
                  </p>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="login-field"
                    {...register("email", { required: true })}
                  />

                  <p className="fw-bold fontEighteen m-auto mt-3  mb-2">
                    Password{" "}
                    <span className="text-danger fs-3 fw-bold asterisk">*</span>
                  </p>

                  <div className="password-eye">
                    <input
                      type={passwordShown ? "text" : "password"}
                      className="login-field"
                      {...register("password", { required: true })}
                    />
                    <button
                      className="hide-btn-signin signHideBtn"
                      onClick={() => togglePassword("password")}
                    >
                      <i className="fa-sharp fa-regular fa-eye-slash"></i>
                    </button>
                  </div>

                  <p className="fw-bold fontEighteen m-auto mt-3  mb-2">
                    Confirm Password{" "}
                    <span className="text-danger fs-3 fw-bold asterisk">*</span>
                  </p>

                  <div className="password-eye">
                    <input
                      type={confirmPasswordShown ? "text" : "password"}
                      className="login-field"
                      {...register("confirmPassword", { required: true })}
                    />
                    <button
                      className="hide-btn-signin signHideBtn"
                      onClick={() => togglePassword("confirmPassword")}
                    >
                      <i className="fa-sharp fa-regular fa-eye-slash"></i>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="signin fw-semibold mb-4"
                  >
                    {isLoggingIn ? "Signing up..." : "Sign up"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default Signup;
