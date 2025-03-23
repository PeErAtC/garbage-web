import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar'; // Import Sidebar Component จากโฟลเดอร์ components
import styles from './main.module.css'; // เรียกใช้ไฟล์ CSS Modules
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import Firebase Firestore

const PaymentCheck = () => {
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(''); // State สำหรับเดือน
  const [selectedYear, setSelectedYear] = useState(''); // State สำหรับปี
  const [selectedPayment, setSelectedPayment] = useState(null); // State สำหรับรายการที่ถูกเลือก

  useEffect(() => {
    const fetchPayments = async () => {
      const db = getFirestore(); // เรียกใช้ Firestore
      const paymentCollection = collection(db, 'payment');
      const paymentSnapshot = await getDocs(paymentCollection);
      const paymentList = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentList);
    };

    fetchPayments();
  }, []);

  

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment); // ตั้งค่า state ของรายการที่ถูกเลือก
  };

  const handleConfirmPayment = async () => {
    if (selectedPayment) {
      const db = getFirestore();
      const paymentRef = doc(db, 'payment', selectedPayment.id);
      await updateDoc(paymentRef, { status: 'ชำระแล้ว' });
  
      // อัปเดตสถานะใน UI และลบรายการที่ถูกยืนยันการชำระเงินออกจาก state
      setPayments(prevPayments =>
        prevPayments.filter(payment => payment.id !== selectedPayment.id)
      );
  
      setSelectedPayment(null); // ปิด modal หลังจากยืนยันการชำระเงินแล้ว
    }
  };


  return (
    <div className="grid-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={`${styles.container} main-content`}>
        <div className="header">
          <h2>ตรวจสอบหลักฐานการชำระเงิน</h2>
        </div>
        <div className="filter-container">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="select-box">
              <option value="">เดือน</option>
              <option value="01">มกราคม</option>
              <option value="02">กุมภาพันธ์</option>
              <option value="03">มีนาคม</option>
              <option value="04">เมษายน</option>
              <option value="05">พฤษภาคม</option>
              <option value="06">มิถุนายน</option>
              <option value="07">กรกฎาคม</option>
              <option value="08">สิงหาคม</option>
              <option value="09">กันยายน</option>
              <option value="10">ตุลาคม</option>
              <option value="11">พฤศจิกายน</option>
              <option value="12">ธันวาคม</option>
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="select-box">
              <option value="">ปี</option>
              <option value="2567">2567</option>
              <option value="2566">2566</option>
              <option value="2565">2565</option>
              {/* เพิ่มปีที่ต้องการเพิ่มเติมได้ */}
            </select>
          </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>เลขบัตรประชาชน</th>
                <th>หมายเลขใบแจ้งหนี้</th>
                <th>วันที่โอน</th>
                <th>เวลาที่โอน</th>
                <th>สถานะ</th>
                <th>ยืนยัน</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter(payment => 
                  (selectedMonth === '' || new Date(payment.transferDate).getMonth() + 1 === parseInt(selectedMonth)) &&
                  (selectedYear === '' || new Date(payment.transferDate).getFullYear() === parseInt(selectedYear))
                )
                .map((payment, index) => (
                  <tr key={index}>
                    <td>{`${payment.firstName}`}</td>
                    <td>{`${payment.lastName}`}</td>
                    <td>{payment.idCardNumber}</td>
                    <td>{payment.invoiceNumber}</td>
                    <td>{new Date(payment.transferDate).toLocaleDateString('th-TH')}</td>
                    <td>{new Date(payment.transferTime).toLocaleTimeString('th-TH')}</td>
                    <td>{payment.status}</td>
                    <td>
                      {payment.status === 'ชำระแล้ว' ? (
                        <button className="btn-success">ชำระแล้ว</button>
                      ) : (
                        <button className="btn-pending" onClick={() => handleSelectPayment(payment)}>
                          รอตรวจสอบ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal สำหรับแสดงรายละเอียด */}
        {selectedPayment && (
          <div className="modal">
            <div className="modal-content">
              <h3>รายละเอียดการชำระเงิน</h3>
              <div className="details">
                <p><strong>ชื่อ:</strong> {selectedPayment.firstName} {selectedPayment.lastName}</p>
                <p><strong>เลขบัตรประชาชน:</strong> {selectedPayment.idCardNumber}</p>
                <p><strong>หมายเลขใบแจ้งหนี้:</strong> {selectedPayment.invoiceNumber}</p>
                <p><strong>วันที่โอน:</strong> {new Date(selectedPayment.transferDate).toLocaleDateString('th-TH')}</p>
                <p><strong>เวลาที่โอน:</strong> {new Date(selectedPayment.transferTime).toLocaleTimeString('th-TH')}</p>
                <p><strong>สถานะ:</strong> {selectedPayment.status}</p>
              </div>
              <div className="buttons">
                <button onClick={handleConfirmPayment} className="btn-success">ยืนยันการชำระเงิน</button>
                <button onClick={() => setSelectedPayment(null)} className="btn-cancel">ยกเลิก</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        body, html {
          background-color: #ffffff; /* กำหนดพื้นหลังสีขาวให้ทั้งหน้า */
          color: #000000; /* กำหนดสีตัวอักษรเป็นสีดำ */
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 250px 1fr; 
          width: 100%;
          background-color: #ffffff; /* กำหนดพื้นหลังสีขาว */
        }
        .sidebar {
          position: fixed;
          height: 100vh; /* ความสูงเต็มหน้าจอ */
          top: 0; /* ด้านบนติดกับขอบหน้าจอ */
          left: 0; /* ด้านซ้ายติดกับขอบหน้าจอ */
          z-index: 1000; /* เพื่อให้ Sidebar อยู่บนสุดเมื่อมีการซ้อนทับกัน */
        }
        .main-content {
          padding: 20px 50px; /* ขยาย padding ให้กว้างขึ้น */
          margin-left: 250px; /* ปรับขนาดให้พอดีกับความกว้างของ Sidebar */
          background-color: white !important; /* เปลี่ยนพื้นหลังเป็นสีขาว */
          display: flex;
          flex-direction: column;
          align-items: center; /* จัดให้ตารางและส่วนประกอบอื่นๆ อยู่ตรงกลาง */
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          margin-left: 1250px;  
        }
        h2 {
          font-size: 30px; /* ขยายขนาดตัวอักษรของหัวข้อ */
          font-weight: 600;
          color: #333333; /* เปลี่ยนสีหัวข้อเป็นสีเทาเข้ม */
          writing-mode: horizontal-tb; /* กำหนดการเขียนเป็นแนวนอน */
          text-align: center;
          white-space: nowrap; /* ป้องกันไม่ให้ข้อความตัดไปบรรทัดใหม่ */
        }
        .filter-container {
          display: flex;
          gap: 10px;
          width: 100%; /* ให้ filter-container ขยายเต็มความกว้าง */
          margin-bottom: 20px;
          margin-left: 2000px;
        }
        .select-box {
          padding: 8px; /* ขยาย padding ให้ dropdown ใหญ่ขึ้น */
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
          width: 150px; /* ขยายความกว้างของ dropdown */
          color: #000000;
        }
        .table-container {
          width: 100%;
          display: flex;
          justify-content: center; /* จัดตารางให้อยู่ตรงกลาง */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-left: 1250px;
         }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
          color: #333333;
          white-space: nowrap; /* ทำให้ข้อความอยู่บรรทัดเดียวกัน */
          text-overflow: ellipsis; /* แสดง ... เมื่อข้อความยาวเกินไป */
          overflow: hidden;
        }

        th {
          background-color: #f2f2f2;
        }
        .btn-success {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 15px; /* ขยายขนาดปุ่ม */
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-pending {
          background-color: #ffc107;
          color: white;
          border: none;
          padding: 10px 15px; /* ขยายขนาดปุ่ม */
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-success:hover, .btn-pending:hover {
          opacity: 0.8;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          text-align: center;
        }
        .details p {
          display: inline-block;
          margin: 5px 0; /* กำหนดระยะห่างด้านบนและด้านล่าง */
        }
        .buttons {
          margin-top: 20px;
        }
        .btn-cancel {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default PaymentCheck;
