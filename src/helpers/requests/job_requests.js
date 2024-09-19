import { toast } from "react-toastify";
import { UPDATE_JOB_CATEGORIES } from "../../store/actions/jobActions";
import { axiosInstance } from "../axios/axios";
import {
  applyJobUrl,
  createJobUrl,
  jobCategoriesUrl,
} from "../endpoints/api_endpoints";

export const getJobCategories = async (dispatch) => {
  try {
    const response = await axiosInstance.get(`${jobCategoriesUrl}`);
    dispatch({
      type: UPDATE_JOB_CATEGORIES,
      payload: response.data.results,
    });
  } catch (error) {
    return console.log(error);
  }
};

export const handleJobPosting = async (
  data,
  loadStateFunc,
  navigateFunc,
  navigateUrl
) => {
  try {
    if (typeof loadStateFunc === "function") {
      loadStateFunc(true);
    }
    const response = axiosInstance.post(`${createJobUrl}`, data);

    if (typeof loadStateFunc === "function") {
      loadStateFunc(false);
    }

    if (typeof navigateFunc === "function") {
      navigateFunc(navigateUrl);
    }
    return response;
  } catch (err) {
    console.log(err);
    if (typeof loadStateFunc === "function") {
      loadStateFunc(false);
    }
    return "error";
  }
};

export const handleVendorJobAppicationPosting = async (
  data,
  jobId,
  closeModalFunc,
  files
) => {
  try {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("request_message", data.request_message);

    if (files && files.length > 0) {
      formData.append("document", files[0]);
    }

    const response = await axiosInstance.post(
      `${applyJobUrl}${jobId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("posted job >>>", response.data);
    toast.success(
      "Congratulations! Your job proposal has been sent successfully. Now sit back and relax while a buyer connects with you",
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );

    if (typeof closeModalFunc === "function") {
      closeModalFunc();
    }
  } catch (error) {
    // console.log(error);
    if (error.response) {
      toast.error(
        `An error occurred while submitting your job proposal: ${error.response.data.detail}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } else {
      toast.error(
        "An error occurred while submitting your job proposal. Please try again later.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }
};
