import React from 'react';
import "./AdminDashboard.css";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='adminFooter text-center'>
      <p>© R Singhania | HABOT {currentYear}</p>
    </div>
  );
}

export default AdminFooter;
