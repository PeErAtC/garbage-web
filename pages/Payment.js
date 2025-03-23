import React, { useState } from 'react';

const PaymentCheck = () => {
  const [month, setMonth] = useState('มกราคม');
  const [year, setYear] = useState('2567');

  return (
    <div className="payment-check-container">
      <h1>ตรวจสอบหลักฐานการชำระเงิน</h1>
      <div className="filter-container">
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="select-white">
          <option value="มกราคม">เดือน</option>
          <option value="มกราคม">มกราคม</option>
          <option value="กุมภาพันธ์">กุมภาพันธ์</option>
          <option value="มีนาคม">มีนาคม</option>
          <option value="เมษายน">เมษายน</option>
          <option value="พฤษภาคม">พฤษภาคม</option>
          <option value="มิถุนายน">มิถุนายน</option>
          <option value="กรกฏาคม">กรกฏาคม</option>
          <option value="สิงหาคม">สิงหาคม</option>
          <option value="กันยายน">กันยายน</option>
          <option value="ตุลาคม">ตุลาคม</option>
          <option value="พฤศจิกายน">พฤศจิกายน</option>
          <option value="ธันวาคม">ธันวาคม</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="select-white">
          <option value="2574">2574</option>
          <option value="2573">2573</option>
          <option value="2572">2572</option>
          <option value="2571">2571</option>
          <option value="2570">2570</option>
          <option value="2569">2569</option>
          <option value="2568">2568</option>
          <option value="2567">2567</option>
          <option value="2566">2566</option>
          <option value="2565">2565</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>บ้านเลขที่</th>
            <th>ยอดชำระของเดือน</th>
            <th>ยอดชำระ</th>
            <th>สลิป</th>
            <th>วันเวลาที่ชำระ</th>
            <th>ยืนยัน</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.name}</td>
              <td>{payment.houseNumber}</td>
              <td>{payment.month}</td>
              <td>{payment.amountDue}</td>
              <td><img src={payment.slip} alt="Slip" className="slip-image" /></td>
              <td>{payment.paymentDate}</td>
              <td>
                <button className={payment.status === 'สำเร็จ' ? 'success' : 'pending'}>
                  {payment.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        html, body {
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .payment-check-container {
          padding: 20px;
          background-color: #ffffff;
          min-height: 100vh;
          box-sizing: border-box;
        }

        h1 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .filter-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        select.select-white {
          padding: 5px;
          margin-left: 10px;
          font-size: 16px;
          background-color: #ffffff;
          color: #000;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          color: #333;
        }

        table th,
        table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }

        table th {
          background-color: #f2f2f2;
        }

        .slip-image {
          width: 50px;
          height: auto;
        }

        .success {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .pending {
          background-color: #ff9800;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};
export default PaymentCheck;
