import React, { useState, useEffect } from 'react';
import { MdFace } from 'react-icons/md'; // Import Material Icons
import { AiOutlineHome, AiOutlineUser, AiOutlineFileText, AiOutlineUpload, AiOutlineInbox } from 'react-icons/ai'; // Import Icons from Ant Design
import Link from 'next/link';

const Sidebar = ({ username }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedMenu = localStorage.getItem('selectedMenu');
    if (savedMenu) {
      setSelectedMenu(savedMenu);
    }
  }, []);

  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
    localStorage.setItem('selectedMenu', menuItem);
  };

  const handleLogout = () => {
    console.log('Logout');
    window.location.href = '/';
  };

  return (
    <div className="container h-full lg:h-full">
      <div className="sidebar h-full">
        <div className="divider left-aligned" style={{ marginBottom: '0px' }}></div>
        <div className="user">
          <div className="user" style={{ display: 'flex', alignItems: 'center' }}>
            <MdFace size={50} color="#FF4081" onClick={() => setShowModal(true)} style={{ cursor: 'pointer', marginRight: '10px', marginTop: '1px' }} />
            <span className="username">{username}</span>
          </div>
        </div>
        <div className="divider" style={{ marginTop: '0px' }}></div>
        <div className="menu h-full lg:h-full">
          <ul>
            <Link href="/homepage">
              <button onClick={() => handleMenuClick('หน้าแรก')} className={selectedMenu === 'หน้าแรก' ? 'active' : ''}>
                <AiOutlineHome size={24} />
                <span className="menu-text">หน้าแรก</span>
              </button>
            </Link>
            <Link href="/maintable">
              <button onClick={() => handleMenuClick('ข้อมูลผู้ใช้งาน')} className={selectedMenu === 'ข้อมูลผู้ใช้งาน' ? 'active' : ''}>
                <AiOutlineUser size={24} />
                <span className="menu-text">ข้อมูลผู้ใช้งาน</span>
              </button>
            <Link href="/garbagetable">
              <button onClick={() => handleMenuClick('เพิ่มอัตราค่าขยะ')} className={selectedMenu === 'เพิ่มอัตราค่าขยะ' ? 'active' : ''}>
                <AiOutlineUpload size={24} />
                <span className="menu-text">เพิ่มอัตราค่าขยะ</span>
              </button>
            </Link>
            <Link href="/invoicestatus">
              <button onClick={() => handleMenuClick('ส่งใบแจ้งหนี้')} className={selectedMenu === 'ส่งใบแจ้งหนี้' ? 'active' : ''}>
                <AiOutlineInbox size={24} />
                <span className="menu-text">ส่งใบแจ้งหนี้</span>
              </button>
            </Link>
            </Link>
            <Link href="/paymentcheck">
              <button onClick={() => handleMenuClick('สถานะการชำระ')} className={selectedMenu === 'สถานะการชำระ' ? 'active' : ''}>
                <AiOutlineFileText size={24} />
                <span className="menu-text">สถานะการชำระ</span>
              </button>
            </Link>
            <Link href="/adminComplaints">
              <button onClick={() => handleMenuClick('รายการร้องเรียน')} className={selectedMenu === 'รายการร้องเรียน' ? 'active' : ''}>
                <AiOutlineInbox size={24} />
                <span className="menu-text">รายการร้องเรียน</span>
              </button>
            </Link>
            <Link href="/adminAnnouncement">
              <button onClick={() => handleMenuClick('เพิ่มข่าวประชาสัมพันธ์')} className={selectedMenu === 'เพิ่มข่าวประชาสัมพันธ์' ? 'active' : ''}>
                <AiOutlineInbox size={24} />
                <span className="menu-text">เพิ่มข่าวประชาสัมพันธ์</span>
              </button>
            </Link>
          </ul>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <div className="modal-body">
                <MdFace size={50} color="#FF4081" />
                <h2>ตั้งค่า</h2>
                <Link href="/AdminResetpassword">
                  <button
                    onClick={() => handleMenuClick('เปลี่ยนรหัสผ่าน')}
                    className="modal-button"
                  >
                    แจ้งปัญหา
                  </button>
                </Link>
                <button className="modal-button logout-button" onClick={handleLogout}>ออกจากระบบ</button>
              </div>
            </div>
          </div>
          
        )}
        <div className="logout-container">
        </div>
      </div>
      <style jsx>{`
        .logout-container {
          padding: 20px;
        }
        .logout-button {
          width: 100%;
          padding: 10px 0;
          cursor: pointer;
          transition: background-color 0.3s, border-color 0.3s;
          border: none;
          background-color: #ff0000; /* สีแดง */
          color: #fff;
          font-size: 18px;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logout-button:hover {
          background-color: #cc0000;
        }
        .menu ul button.active {
          background-color: #007bff;
          border-color: #00f;
          color: #fff;
        }
        .container {
          display: flex;
          height: 900px;
          box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.3));
        }
        .sidebar {
          width: 300px;
          background-color: #fff;
          color: #000;
          padding-top: 30px;
        }
        .user {
          padding: 20px;
          text-align: center;
        }
        .user p {
          display: flex;
          align-items: center;
          padding: 5px;
        }
        .divider {
          height: 2px;
          background-color: #ccc;
          margin: 20px 0;
        }
        .menu {
          margin-top: 40px;
          padding: 5px;
        }
        .menu ul {
          list-style-type: none;
          padding: 0;
        }
        .menu ul button {
          padding: 10px 0;
          cursor: pointer;
          transition: background-color 0.3s, border-color 0.3s;
          border: none;
          background-color: transparent;
          color: #000;
          width: 100%;
          text-align: left;
          font-size: 18px;
          margin-top: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          padding-left: 50px;
          padding-right: 20px;
        }
        .menu-text {
          margin-left: 10px;
        }
        .username {
          font-size: 20px;
          font-weight: bold;
          color: #ff4081;
        }
        .menu ul button:hover {
          background-color: #007bff;
          border-color: #00f;
          color: #fff;
        }
        .menu ul button:focus {
          outline: 2px solid #007bff;
        }
        .modal {
          display: flex;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: flex-start;
          padding-top: 140px; /* เพิ่มระยะห่างจากด้านบน */
        }
        .modal-content {
          background-color: #fefefe;
          padding: 20px;
          border-radius: 5px;
          width: 230px; /* ลดขนาดของ modal */
          text-align: center;
          position: relative;
        }
        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
        }
        .modal-body {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .modal-body h2 {
          margin-top: 10px;
        }
        .modal-button {
          width: 200px;
          padding: 10px 0;
          margin-top: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
          border: none;
          background-color: #f0f0f0;
          color: #000;
          font-size: 18px;
          border-radius: 5px;
        }
        .modal-button.logout-button {
          background-color: #ff0000; /* สีแดง */
          color: #fff;
        }
        .modal-button.logout-button:hover {
          background-color: #cc0000; /* สีแดงเข้ม */
        }
        .modal-button:hover {
          background-color: #d0d0d0;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .modal-buttons button {
          cursor: pointer;
          padding: 10px 20px;
          margin: 0 10px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
          transition: background-color 0.3s;
          width: 100px;
        }
        .modal-buttons button:hover {
          background-color: #0056b3;
        }
        .modal-buttons button.yes {
          background-color: #4caf50;
        }
        .modal-buttons button.no {
          background-color: #f44336;
        }
      `}</style>
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <Sidebar username="สวัสดีคุณ แอดมิน" />
    </div>
  );
};

export default HomePage;
