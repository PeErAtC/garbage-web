import React from 'react';
import Sidebar2 from './components/sidebar2'; // Import Sidebar Component จากโฟลเดอร์ components
import ExpensesSummary from './ExpensesSummary'; // Import Main Content Component
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules

const ManagerExpensesSummary = () => {
  return (
    <div className="grid-container" style={{ backgroundColor : "white"}}>
      <div className="sidebar2">
        <Sidebar2 />
      </div>
      <div className={`${styles.container} main-content`}> 
        <ExpensesSummary />
      </div>
      <style jsx>{`
      .grid-container {
        display: grid;
        grid-template-columns: auto 1fr; 
        width: 100vw; /* ขยายเต็มความกว้างของหน้าจอ */
        height: 110vh; /* ขยายเต็มความสูงของหน้าจอ */
        background-color: white; /* ทำให้พื้นหลังเป็นสีขาว */
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
        background-color: white; /* ทำให้พื้นหลังของ content เป็นสีขาว */
        height: 100vh; /* ปรับความสูงเต็มหน้าจอ */
      }
    `}</style>
    </div>
  );
};

export default ManagerExpensesSummary;
