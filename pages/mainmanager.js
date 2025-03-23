import React from 'react';
import Sidebar2 from './components/sidebar2'; // Import Sidebar Component จากโฟลเดอร์ components
import DashboardNoTotal from './DashboardNoTotal'; // Import Main Content Component
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules

const GarbageTable = () => {
  return (
    <div className="grid-container" style={{ backgroundColor: "white" }}>
      <div className="sidebar2">
        <Sidebar2 />
      </div>
      <div className={`${styles.container} main-content`} style={{ backgroundColor: 'white', minHeight: '100vh' }}> 
        <DashboardNoTotal />
      </div>
      <style jsx>{`
        .grid-container {
          display: grid;
          grid-template-columns: auto 1fr; 
          width: auto;
        }
        .sidebar2 {
          position: fixed;
          height: 100vh; /* ความสูงเต็มหน้าจอ */
          top: 0; /* ด้านบนติดกับขอบหน้าจอ */
          left: 0; /* ด้านซ้ายติดกับขอบหน้าจอ */
          z-index: 1000; /* เพื่อให้ Sidebar อยู่บนสุดเมื่อมีการซ้อนทับกัน */
        }
        .main-content {
          padding: 10px 20px;
          margin-left: 290px; /* ปรับขนาดให้พอดีกับความกว้างของ Sidebar */
          background-color: white; /* เพิ่ม background สีขาว */
          min-height: 100vh; /* ตั้งค่าให้ความสูงเต็มหน้าจอ */
        }
      `}</style>
    </div>
  );
};

export default GarbageTable;
