import React, { useEffect, useRef, useState } from "react";
import "../../Habotech/HabotAppBar/ProfileDropdown.css";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  handleHabotechLogout,
  handleLogout,
} from "../../../helpers/requests/accounts_requests";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  accountProfile,
  baseURL,
} from "../../../helpers/endpoints/api_endpoints";

export default function HabotProfileDrop({ vendorInfo, isVendor, userinfo }) {
  const [profileData, setProfileData] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [category, setCategory] = useState([]);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  // console.log(profileData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsActive(!isActive);
  };

  const handleOptionClick = (option) => {
    // onSelect(option);
    setIsActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("menu-trigger")
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${accountProfile}`, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data);
        reset(response.data);
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  }, [reset]);
  return (
    <div>
      <div className="menu-container ">
        <button
          onClick={(event) => toggleDropdown(event)}
          className="menu-trigger"
        >
          <img
            src={
              profileData?.profile_photo
                ? profileData?.profile_photo
                : "https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/default_user.png"
            }
            alt="User avatar-Habot"
          />
          <b className="hide-name ">
            {" "}
            {profileData?.full_name ? profileData?.full_name : "loading..."}
          </b>

          <i className="fa fa-angle-down"></i>
        </button>
        <nav
          ref={dropdownRef}
          className={`menu ${isActive ? "active" : "inactive"}`}
        >
          <div className="user-email">
            <div>{savedUserInfo?.user_profile?.user?.email}</div>
          </div>

          <ul onClick={handleOptionClick}>
            <li>
              <Link
                to={{
                  pathname: "/customer-journey",
                }}
              >
                <i className="fa-regular fa-circle-user"></i>My Profile
              </Link>
            </li>
            {/* <li>
              <Link
                to={{
                  pathname: "/habotech-ask-question",
                }}
              >
                <i className="far fa-question-circle"></i>Ask A Question
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/habotech-summary",
                }}
              >
                <i className="far fa-file-alt"></i>Summary
              </Link>
            </li> */}
          </ul>

          <div
            onClick={() => handleHabotechLogout(dispatch, navigate)}
            className="signout-button"
          >
            Sign Out
          </div>
        </nav>
      </div>
    </div>
  );
}
