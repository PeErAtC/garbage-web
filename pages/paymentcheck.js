import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import styles from './main.module.css';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

const PaymentCheck = () => {
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      const db = getFirestore();
      const paymentCollection = collection(db, 'payment');
      const paymentSnapshot = await getDocs(paymentCollection);
      const paymentList = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentList);
    };

    fetchPayments();
  }, []);

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment); 
    setPaymentStatus(payment.status); 
  };

  const handleImageClick = (src) => {
    setImageSrc(src);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleConfirmPayment = async () => {
    if (selectedPayment) {
      const db = getFirestore();
      const paymentRef = doc(db, 'payment', selectedPayment.id);
      await updateDoc(paymentRef, { status: paymentStatus });

      const invoiceQuery = query(collection(db, 'invoice'), where('invoiceNumber', '==', selectedPayment.invoiceNumber));
      const invoiceSnapshot = await getDocs(invoiceQuery);

      if (!invoiceSnapshot.empty) {
        const invoiceDoc = invoiceSnapshot.docs[0];
        const invoiceRef = doc(db, 'invoice', invoiceDoc.id);

        if (paymentStatus === 'ชำระแล้ว') {
          await updateDoc(invoiceRef, { status: 'ชำระแล้ว' });
        } else if (paymentStatus === 'ชำระไม่สำเร็จ') {
          await updateDoc(invoiceRef, { status: 'ค้างชำระ' });
        }
      } else {
        console.log("ไม่พบเอกสารใน collection invoice");
      }

      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === selectedPayment.id ? { ...payment, status: paymentStatus } : payment
        )
      );

      setSelectedPayment(null);
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
            <option value="1">มกราคม</option>
            <option value="2">กุมภาพันธ์</option>
            <option value="3">มีนาคม</option>
            <option value="4">เมษายน</option>
            <option value="5">พฤษภาคม</option>
            <option value="6">มิถุนายน</option>
            <option value="7">กรกฎาคม</option>
            <option value="8">สิงหาคม</option>
            <option value="9">กันยายน</option>
            <option value="10">ตุลาคม</option>
            <option value="11">พฤศจิกายน</option>
            <option value="12">ธันวาคม</option>
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="select-box">
            <option value="">ปี</option>
            <option value="">2567</option>
            <option value="">2568</option>
            <option value="">2569</option>
            <option value="">2570</option>
          </select>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>เลขบัตรประชาชน</th>
                <th>หมายเลขใบแจ้งหนี้</th>
                <th>สถานะ</th>
                <th>เดือน</th> {/* เพิ่มคอลัมน์เดือน */}
                <th>ปี</th> {/* เพิ่มคอลัมน์ปี */}
                <th>รูปภาพ</th>
                <th>ยืนยัน</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter(payment =>
                  (selectedMonth === '' || (new Date(payment.transferDate).getMonth() + 1).toString() === selectedMonth) &&
                  (selectedYear === '' || (new Date(payment.transferDate).getFullYear() + 543).toString() === selectedYear)
                )
                .map((payment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{`${payment.firstName}`}</td>
                    <td>{`${payment.lastName}`}</td>
                    <td>{payment.idCardNumber}</td>
                    <td>{payment.invoiceNumber}</td>
                    <td>{payment.status}</td>
                    <td>{payment.month}</td> 
                    <td>{payment.year}</td>
                    <td>
                      {payment.file ? (
                        <img
                          src={payment.file}
                          alt="หลักฐานการโอน"
                          style={{ width: '100px', cursor: 'pointer' }}
                          onClick={() => handleImageClick(payment.file)}
                        />
                      ) : (
                        'ไม่มีรูปภาพ'
                      )}
                    </td>
                    <td>
                      <button
                        className={payment.status === 'ชำระแล้ว' ? 'btn-success' : payment.status === 'ชำระไม่สำเร็จ' ? 'btn-failed' : 'btn-pending'}
                        onClick={() => handleSelectPayment(payment)}
                      >
                        {payment.status === 'ชำระแล้ว' ? 'ชำระแล้ว' : payment.status === 'ชำระไม่สำเร็จ' ? 'ชำระไม่สำเร็จ' : 'รอตรวจสอบ'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {isImageModalOpen && (
          <div className="image-modal" onClick={handleCloseImageModal}>
            <div className="modal-content">
              <img src={imageSrc} alt="หลักฐานการโอน" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {selectedPayment && (
          <div className="modal">
            <div className="modal-content">
              <h3>รายละเอียดการชำระเงิน</h3>
              <div className="details">
                <div className="detail-item">
                  <span><strong>ชื่อ:</strong></span>
                  <span>{selectedPayment.firstName} {selectedPayment.lastName}</span>
                </div>
                <div className="detail-item">
                  <span><strong>เลขบัตรประชาชน:</strong></span>
                  <span>{selectedPayment.idCardNumber}</span>
                </div>
                <div className="detail-item">
                  <span><strong>หมายเลขใบแจ้งหนี้:</strong></span>
                  <span>{selectedPayment.invoiceNumber}</span>
                </div>
                <div className="detail-item">
                  <span><strong>วันที่โอน:</strong></span> 
                  <span>{new Date(selectedPayment.transferDate).toLocaleDateString('th-TH')}</span>
                </div>
                <div className="detail-item">
                  <span><strong>เวลาที่โอน:</strong></span>
                  <span>{new Date(selectedPayment.transferTime).toLocaleTimeString('th-TH')}</span>
                </div>
                <div className="detail-item">
                  <span><strong>เดือน:</strong></span>
                  <span>{selectedPayment.month}</span> {/* แสดงเดือนใน modal */}
                </div>
                <div className="detail-item">
                  <span><strong>ปี:</strong></span>
                  <span>{selectedPayment.year}</span> {/* แสดงปีใน modal */}
                </div>
                <div className="detail-item">
                  <span><strong>สถานะ:</strong></span>
                  <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="select-box">
                    <option value="ชำระแล้ว">ชำระแล้ว</option>
                    <option value="ชำระไม่สำเร็จ">ชำระไม่สำเร็จ</option>
                  </select>
                </div>
                <div className="detail-item image-container">
                  <span><strong>รูปภาพหลักฐาน:</strong></span>
                  {selectedPayment.file ? (
                    <img src={selectedPayment.file} alt="หลักฐานการโอน" className="proof-image" />
                  ) : (
                    'ไม่มีรูปภาพ'
                  )}
                </div>
              </div>
              <div className="buttons">
                <button
                  onClick={handleConfirmPayment}
                  className={paymentStatus === 'ชำระแล้ว' ? 'btn-success' : 'btn-failed'}
                >
                  {paymentStatus === 'ชำระแล้ว' ? 'ยืนยันการชำระเงิน' : 'ยืนยันการชำระไม่สำเร็จ'}
                </button>
                <button onClick={() => setSelectedPayment(null)} className="btn-cancel">ยกเลิก</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        html, body {
          background-color: #ffffff;
          min-height: 100%;
        }

        .grid-container {
          min-height: 100vh;
          background-color: #ffffff;
        }

        main {
          background-color: #ffffff;
        }

        footer {
          background-color: #ffffff;
        }

        .sidebar {
          position: fixed;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 1000;
        }
        .main-content {
          padding: 20px 50px;
          margin-left: 250px;
          background-color: white !important;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .header {
          text-align: center;
          margin-bottom: 20px; 
        }
        h2 {
          font-size: 30px;
          font-weight: 600;
          color: #333333;
          writing-mode: horizontal-tb;
          text-align: center;
          white-space: nowrap;
        }
        .filter-container {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-bottom: 20px;
          margin-left: 1800px;
        }
        .select-box {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
          width: 150px;
          color: #000000;
        }
        .table-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-left: 60px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
          color: #333333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        th {
          background-color: #f2f2f2;
        }
        .btn-success {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-failed {
          background-color: #FF0000;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-pending {
          background-color: #ffc107;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
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
        .btn-success:hover, .btn-failed:hover, .btn-pending:hover, .btn-cancel:hover {
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
          margin: 5px 0;
        }
        .buttons {
          margin-top: 20px;
        }

        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .image-modal .modal-content {
          max-width: 90%;
          max-height: 90%;
        }

        .details {
          margin-top: 20px;
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .image-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .proof-image {
          width: 182px;
          margin-top: 10px;
          border-radius: 8px;
        }

        .select-box {
          width: 150px;
          padding: 8px;
          font-size: 16px;
        }

        img {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default PaymentCheck;
