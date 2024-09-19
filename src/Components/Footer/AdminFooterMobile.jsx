import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminFooterMobile = () => {
  const currentRoute = useLocation();

  const { accessToken } = useSelector((state) => state.account);

  return (
    <div>
      <div className="footer-icon-nav">
        <Link className="icon-text text-dark" to="/">
          <i
            className={`fa-sharp fa-solid fa-house   ${
              currentRoute?.pathname === "/" ? "home" : ""
            }`}
          ></i>
          <span className="footerNavItem">Home</span>
        </Link>

        <Link className="icon-text text-dark" to="/admin-dashboard">
          <i
            className={`fa-sharp fa-solid fa-chart-line ${
              currentRoute?.pathname === "/admin-dashboard" ? "home" : ""
            }`}
          ></i>
          <span className="footerNavItem">Dashboard</span>
        </Link>

        <Link
          className="icon-text text-dark"
          to={accessToken ? "/profile" : "/signin"}
        >
          <i
            className={`${
              accessToken ? "fa-solid fa-user " : "fas fa-sign-in-alt"
            } ${currentRoute?.pathname === "/profile" ? "home" : ""}`}
          ></i>
          <span className="footerNavItem">
            {accessToken ? "User" : "Sign In"}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminFooterMobile;
