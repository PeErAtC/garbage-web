import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './firebase';

const ExpensesSummary = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const currentYear = new Date().getFullYear() + 543; // Convert to Thai year
  const [selectedYear, setSelectedYear] = useState(currentYear); // Set initial year to current year

  useEffect(() => {
    // Fetch data from 'payment' collection
    const unsubscribe = onSnapshot(
      collection(db, 'payment'),
      (querySnapshot) => {
        const payments = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          payments.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date() // Ensure correct date format
          });
        });
        setPaymentData(payments);
      },
      (error) => {
        console.error("Error fetching payment data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (month) => {
    const expensesForMonth = paymentData.filter(
      (payment) => payment.month === month && payment.year === selectedYear && payment.status === "ชำระแล้ว"
    );
    setSelectedExpenses(expensesForMonth);
    setSelectedMonth(month);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedMonth(null);
    setIsModalVisible(false);
  };

  const getMonthlyTotal = (month, year) => {
    const monthlyPayments = paymentData.filter(
      (payment) => payment.month === month && payment.year === year && payment.status === "ชำระแล้ว"
    );
    return monthlyPayments.reduce((total, payment) => total + parseFloat(payment.garbagerate), 0);
  };

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Generate year options dynamically
  const yearOptions = [];
  for (let year = currentYear; year >= 2565; year--) {
    yearOptions.push(
      <option key={year} value={year}>{year}</option>
    );
  }

  return (
    <div className="container">
      <h2>สรุปรายจ่ายในแต่ละเดือน</h2>
      
      {/* Dropdown for selecting year */}
      <div className="year-selector">
        <select id="year-select" value={selectedYear} onChange={handleYearChange} className="year-dropdown">
          {yearOptions}
        </select>
      </div>

      <table className="expenses-summary-table">
        <thead>
          <tr>
            <th>เดือน</th>
            <th>รายจ่ายทั้งหมด (บาท)</th>
            <th>รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {monthNames.map((monthName, index) => (
            <tr key={index + 1}>
              <td>{monthName}</td>
              <td>{getMonthlyTotal(monthName, selectedYear).toLocaleString()} บาท</td>
              <td>
                <button
                  className="view-details-button"
                  onClick={() => handleViewDetails(monthName)}
                >
                  ดูรายละเอียด
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && selectedMonth && (
        <Modal
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          centered
        >
          <h2>รายละเอียดรายจ่ายสำหรับเดือน {selectedMonth} ปี {selectedYear}</h2>
          <table className="expenses-details-table">
            <thead>
              <tr>
                <th>วันที่จ่าย</th>
                <th>ประจำเดือน/ปี</th>
                <th>รายละเอียด</th>
                <th>จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {selectedExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.createdAt.toLocaleDateString('th-TH')}</td>
                  <td>{expense.month} {expense.year}</td>
                  <td>{expense.additionalNote || '-'}</td>
                  <td>{parseFloat(expense.garbagerate).toLocaleString()} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          background-color: #ffffff;
          position: relative;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .year-selector {
          margin-bottom: 20px;
          text-align: right;
          position: absolute;
          top: 0;
          right: 0;
        }
        .year-dropdown {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
          width: 150px;
          color: #000000;
        }
        .expenses-summary-table,
        .expenses-details-table {
          width: 100%;
          border-collapse: collapse;
        }
        .expenses-summary-table th,
        .expenses-summary-table td,
        .expenses-details-table th,
        .expenses-details-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .expenses-summary-table th {
          background-color: #f2f2f2;
        }
        .view-details-button {
          padding: 8px 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .view-details-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ExpensesSummary;
