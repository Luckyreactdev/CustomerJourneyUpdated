import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
// import Appbar from "../../Shared/Navbar/Appbar";
// import Footer from "../../Shared/Footer/Footer";
// import FooterMobileNav from "../../Shared/FooterMobileNav/FooterMobileNav";
import { Helmet } from "react-helmet";
import AdminFooter from "../Footer/AdminFooter";
import HabotAppBar from "../Habotech/HabotAppBar/HabotAppBar";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Err. Something went wrong!</title>
        <meta name="description" content="" />
        {/* Add more meta tags as needed */}
      </Helmet>
      <HabotAppBar />
      <div className="not-found-container">
        <div className="not-found-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="100"
              fill="#072f57"
              stroke="#fff"
              strokeWidth="20"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="30"
              fontWeight="bold"
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                dur="1.5s"
                repeatCount="indefinite"
                values="1;0;1"
              />
              Ooops! 404
            </text>
          </svg>

          <h1> Page Not Found</h1>
          <p>Oops! The page you are looking for does not exist.</p>
          <Link to="/" className="return-button">
            Return to Home
          </Link>
        </div>
      </div>
      {/* <div>
        <Footer />
      </div> */}
      <div className="admin-mob-top-mob mobile-admin-to-mar">
          <AdminFooter />
        </div>
      {/* <FooterMobileNav /> */}
    </>
  );
};

export default NotFound;
