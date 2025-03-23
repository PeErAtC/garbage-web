import React from 'react';
import Sidebar from './components/sidebar'; // Import Sidebar Component จากโฟลเดอร์ components
import Complaints from './Complaints'; // Import Main Content Component
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules

const adminComplaints = () => {
  return (
    <div className="grid-container" style={{ backgroundColor : "white"}}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={`${styles.container} main-content`}> 
        <Complaints />
      </div>
      <style jsx>{`
        .grid-container {
          display: grid;
          grid-template-columns: auto auto; 
          width: auto;
        }
        .main-content { 
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
};

export default adminComplaints;
