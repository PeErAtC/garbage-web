import React from 'react';
import Sidebar from './components/sidebar'; // Import Sidebar Component จากโฟลเดอร์ components
import Dashboard from './Dashboard'; // Import Main Content Component
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules

const Homepage = () => {
  return (
    <div className="grid-container" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={`${styles.container} main-content`}>
        <Dashboard />
      </div>
      <style jsx global>{`
        html, body, #__next {
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .grid-container {
          display: grid;
          grid-template-columns: 200px 1fr; 
          width: 100%;
          min-height: 100vh;
          background-color: #f9f9f9; /* เพื่อให้แน่ใจว่าพื้นหลังเป็นสี #f9f9f9 */
        }
        .sidebar {
          position: fixed;
          height: 100vh; /* ความสูงเต็มหน้าจอ */
          top: 0; /* ด้านบนติดกับขอบหน้าจอ */
          left: 0; /* ด้านซ้ายติดกับขอบหน้าจอ */
          z-index: 1000; /* เพื่อให้ Sidebar อยู่บนสุดเมื่อมีการซ้อนทับกัน */
          width: 300px; /* ความกว้างของ Sidebar */
        }
        .main-content {
          padding: 10px 10px;
          margin-left: 300px; /* ปรับขนาดให้พอดีกับความกว้างของ Sidebar */
          min-height: 100vh;
          background-color: #f9f9f9; /* เพื่อให้แน่ใจว่าพื้นหลังเป็นสี #f9f9f9 */
        }
      `}</style>
    </div>
  );
};

export default Homepage;
