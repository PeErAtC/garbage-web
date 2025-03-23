import React from 'react';
import Sidebar from './components/sidebar'; // Import Sidebar Component จากโฟลเดอร์ components
import Announcement from './Announcement'; // Import Main Content Component
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules

const adminAnnouncement = () => {
  return (
    <div className="grid-container" style={{ backgroundColor : "white"}}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={`${styles.container} main-content`}> 
        <Announcement />
      </div>
      <style jsx>{`
      .grid-container {
        display: grid;
        grid-template-columns: auto 1fr; 
        width: auto;
      }
      .sidebar {
        position: fixed;
        height: 100vh; /* ความสูงเต็มหน้าจอ */
        top: 0; /* ด้านบนติดกับขอบหน้าจอ */
        left: 0; /* ด้านซ้ายติดกับขอบหน้าจอ */
        z-index: 1000; /* เพื่อให้ Sidebar อยู่บนสุดเมื่อมีการซ้อนทับกัน */
      }
      .main-content {
        padding: 10px 20px;
        margin-left: 290px; /* ปรับขนาดให้พอดีกับความกว้างของ Sidebar */
      }
    `}</style>
    </div>
  );
};

export default adminAnnouncement;