import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  accountProfile,
  changePassUrl,
  baseURL,
} from "../../../helpers/endpoints/api_endpoints";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { followCursor } from "tippy.js";
import "react-phone-number-input/style.css";
import "./ProfilePage.css";
import "./WelcomePage.css";
import "./AvatarCard.css";
import "./Overview.css";
import "./PostJobOne.css";
import "../../Habotech/Habotech.css";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import CountryList from "react-select-country-list";
import Select from "react-select";

function AccountProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { handleSubmit, control, reset, setValue, watch } = useForm();
  const dispatch = useDispatch();

  const watchProfilePhoto = watch("profile_photo"); // Watch profile_photo for display
  const watchCountry = watch("country");
  // Get country list options (full names)
  const countryOptions = CountryList().getData();

  // Handler for country selection change
  const handleCountryChange = (selectedOption) => {
    // Use setValue to update the 'country' field in the form data
    setValue("country", selectedOption.value);
    console.log("Country selected:", selectedOption);
  };

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

  const getChangedFields = (original, updated) => {
    const changedFields = {};
    Object.keys(updated).forEach((key) => {
      if (original[key] !== updated[key]) {
        changedFields[key] = updated[key];
      }
    });
    return changedFields;
  };

  const onSubmit = (data) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
    };

    const formData = new FormData();
    const changedData = getChangedFields(profileData, data);

    Object.keys(changedData).forEach((key) => {
      if (key === "profile_photo" && changedData[key] instanceof File) {
        formData.append(key, changedData[key]);
      } else if (key !== "profile_photo") {
        formData.append(key, changedData[key]);
      }
    });

    axios
      .patch(`${baseURL}${accountProfile}`, formData, { headers })
      .then((response) => {
        toast.success("Profile updated successfully");
        setEditProfile(false);
        setProfileData(response.data);
      })
      .catch((error) => {
        toast.error("Failed to update profile");
        console.error("Error updating profile:", error);
      });
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const passwordData = {
      new_password1: currentPassword,
      new_password2: newPassword,
    };

    if (newPassword.length < 8) {
      toast.error(
        "Password is too short. It must contain at least 8 characters."
      );
      return;
    }

    const commonPasswords = ["password"];
    if (commonPasswords.includes(newPassword.toLowerCase())) {
      toast.error("Password is too common.");
      return;
    }

    if (!isNaN(newPassword)) {
      toast.error("Password is entirely numeric.");
      return;
    }

    if (currentPassword !== newPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    axios
      .post(`${baseURL}${changePassUrl}`, passwordData, { headers })
      .then((response) => {
        console.log(response.data);
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((error) => {
        toast.error("Failed to change password");
        console.error("Error changing password:", error);
        if (error?.response?.data?.new_password2) {
          toast.error(error?.response?.data?.new_password2?.[0]);
        }
      });
  };

  return (
    <div>
      <div className="profile-right-pane">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-lg">
              <div className="profile-info-section habotech-profile-dashboard habot-side-title">
                <div className="mobile-only">
                  {/* Display selected profile image */}
                  <img
                    src={
                      watchProfilePhoto && watchProfilePhoto instanceof File
                        ? URL.createObjectURL(watchProfilePhoto)
                        : profileData?.profile_photo
                    }
                    alt="User avatar-Habot"
                  />
                </div>
                <div className="pro-data">
                  <div className="card-container1 habotech-web-pro">
                    <div className="upper-container habotech-upper-cont">
                      <div
                        title={
                          !editProfile
                            ? "Click on Edit Profile"
                            : "change image "
                        }
                        className="image-container"
                      >
                        {/* Display selected profile image in the main section */}
                        <img
                          src={
                            watchProfilePhoto &&
                            watchProfilePhoto instanceof File
                              ? URL.createObjectURL(watchProfilePhoto)
                              : profileData?.profile_photo
                              ? profileData.profile_photo
                              : "https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/default_user.png"
                          }
                          alt="User avatar-Habot"
                        />
                      </div>
                      {editProfile && (
                        <div className="icon-container">
                          <label
                            htmlFor="upload-photo"
                            title="Change Profile Photo"
                          >
                            <i className="fa-solid fa-pencil"></i>
                          </label>
                          <input
                            id="upload-photo"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              setValue("profile_photo", e.target.files[0])
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {!editProfile && (
                    <Tippy
                      plugins={[followCursor]}
                      followCursor={true}
                      content="Edit Your profile"
                      placement="top-end"
                    >
                      <button
                        className="edit-profile-btn"
                        onClick={() => setEditProfile(true)}
                      >
                        Edit profile <i className="fa-solid fa-pencil"></i>
                      </button>
                    </Tippy>
                  )}
                </div>
              </div>
            </div>

            <div className="p-0 col-lg">
              <div className="mobile-only info-section-heading mobile-heading">
                General Information
              </div>
              <div
                className={editProfile ? "edit-enabled" : "profile-personal"}
              >
                <div className="profile-data">
                  <i className="fa-solid fa-user">&nbsp;</i>
                  <Controller
                    name="full_name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        type="text"
                        disabled={!editProfile}
                        placeholder="Full Name"
                      />
                    )}
                  />
                </div>
                <div className="profile-data">
                  <i className="fa-solid fa-envelope"></i>
                  <Controller
                    name="user.email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        placeholder="Email Address"
                        disabled
                      />
                    )}
                  />
                </div>
                <div className="profile-data">
                  <i className="fa-solid fa-location-dot"> </i>
                  <Select
                    isDisabled={!editProfile}
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === watchCountry // Use watch to get the current country value
                    )}
                    onChange={handleCountryChange}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "300px", // Set your custom width
                        height: "45px", // Set your custom height
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "300px", // Menu width matches control width
                      }),
                    }}
                  />
                </div>
                <div className="profile-data">
                  <Controller
                    name="phone_number"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        defaultCountry="US"
                        className="form-control"
                        disabled={!editProfile}
                        international
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg profile-gallery-detail">
              {editProfile ? (
                <div className="flex p-auto">
                  <button type="submit" className="save-profile-change">
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProfile(false)}
                    className="cancel-profile-change"
                  >
                    Discard
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
        <div className="mt-3">
          <form onSubmit={handlePasswordChange}>
            {editProfile && (
              <>
                <div className="row change-password-section">
                  <div className="col-lg">
                    <div className="profile-org-info">
                      <div className="profile-info-heading mobile-heading">
                        Change Password
                      </div>
                      <div className="profile-info-subtext desktop-only">
                        You can change your password at any time.
                      </div>
                    </div>
                  </div>
                  <div className="col-lg">
                    <div
                      className={`profile-org-details ${
                        editProfile && "edit-enabled"
                      }`}
                    >
                      <div className="profile-data">
                        <i className="fa-solid fa-lock"></i>
                        <input
                          id="current_password"
                          name="current_password"
                          placeholder="New Password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <i
                          className={`fa-solid ${
                            showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        />
                      </div>
                      <div className="profile-data">
                        <i className="fa-solid fa-lock"></i>
                        <input
                          id="new_password1"
                          name="new_password1"
                          placeholder="Confirm Password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <i
                          className={`fa-solid ${
                            showNewPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="save-password-button mb-5"
                      >
                        Save Password
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountProfile;
