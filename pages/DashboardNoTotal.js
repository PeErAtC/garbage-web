import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [houses, setHouses] = useState([]);
  const [unpaidHouses, setUnpaidHouses] = useState([]);
  const [paidHouses, setPaidHouses] = useState([]);
  const [invoiceUnpaid, setInvoiceUnpaid] = useState([]);
  const [selectedStat, setSelectedStat] = useState('paid');
  const [selectedPaidMonth, setSelectedPaidMonth] = useState('');
  const [selectedUnpaidMonth, setSelectedUnpaidMonth] = useState('');
  const [viewHouseModalVisible, setViewHouseModalVisible] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [monthlySummary, setMonthlySummary] = useState({});

  useEffect(() => {
    const unsubscribeHouses = onSnapshot(collection(db, 'item'), (querySnapshot) => {
      const housesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHouses(housesData);
    }, (error) => {
      console.error("Error getting houses: ", error);
    });

    const unsubscribePayments = onSnapshot(collection(db, 'payment'), (querySnapshot) => {
      const paidData = [];
      const pendingData = [];
      const summary = {};

      querySnapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        const month = data.month;

        if (data.status === 'ชำระแล้ว') {
          paidData.push(data);
          summary[month] = summary[month] || { paid: 0, unpaid: 0 };
          summary[month].paid++;
        } else if (data.status === 'รอตรวจสอบ') {
          pendingData.push(data);
        }
      });

      setPaidHouses(paidData);
      setUnpaidHouses(pendingData);
      setMonthlySummary(summary);
    }, (error) => {
      console.error("Error getting payments: ", error);
    });

    const unsubscribeInvoices = onSnapshot(collection(db, 'invoice'), (querySnapshot) => {
      const unpaidData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(invoice => invoice.status === 'ค้างชำระ');

      const summary = { ...monthlySummary };

      unpaidData.forEach(invoice => {
        const month = invoice.month;
        summary[month] = summary[month] || { paid: 0, unpaid: 0 };
        summary[month].unpaid++;
      });

      setInvoiceUnpaid(unpaidData);
      setMonthlySummary(summary);
    }, (error) => {
      console.error("Error getting invoices: ", error);
    });

    return () => {
      unsubscribeHouses();
      unsubscribePayments();
      unsubscribeInvoices();
    };
  }, []);

  useEffect(() => {
    const countPaidHouses = paidHouses.filter(house => 
      !selectedPaidMonth || house.month === selectedPaidMonth // เช็คฟิลด์ month โดยตรง
    ).length;

    const countUnpaidHouses = invoiceUnpaid.filter(invoice => 
      !selectedUnpaidMonth || invoice.month === selectedUnpaidMonth
    ).length;

    setPaidCount(countPaidHouses);
    setUnpaidCount(countUnpaidHouses);
  }, [paidHouses, invoiceUnpaid, selectedPaidMonth, selectedUnpaidMonth]);

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
  };

  const handlePaidMonthChange = (event) => {
    setSelectedPaidMonth(event.target.value);
  };

  const handleUnpaidMonthChange = (event) => {
    setSelectedUnpaidMonth(event.target.value);
  };

  const handleViewHouse = (house) => {
    setCurrentHouse(house);
    setViewHouseModalVisible(true);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <div className={styles.stat} onClick={() => handleStatClick('paid')}>
          <div className={styles.iconPaid}>
            <FaCheckCircle className={styles.icon} />
          </div>
          <div className={styles.statContent}>
            <p>จำนวนบ้านที่ชำระค่าขยะแล้ว</p>
            <h3>{paidCount} หลังคาเรือน</h3>
          </div>
        </div>
        <div className={styles.stat} onClick={() => handleStatClick('unpaid')}>
          <div className={styles.iconUnpaid}>
            <FaExclamationCircle className={styles.icon} />
          </div>
          <div className={styles.statContent}>
            <p>จำนวนบ้านที่ค้างชำระค่าขยะ</p>
            <h3>{unpaidCount} หลังคาเรือน</h3>
          </div>
        </div>
      </div>

      {selectedStat === 'unpaid' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className={styles.tableTitleunpaid}>
              จำนวนบ้านที่ค้างชำระค่าขยะ
            </h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="unpaidMonthSelect" style={{ marginRight: '10px', fontWeight: 'bold', color: '#333' }}>
                เลือกเดือน:
              </label>
              <select
                id="unpaidMonthSelect"
                value={selectedUnpaidMonth}
                onChange={handleUnpaidMonthChange}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #9e9e9e',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  fontSize: '16px',
                  transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 4px rgba(0, 123, 255, 0.25)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
                onMouseOver={(e) => e.target.style.borderColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.borderColor = '#9e9e9e'}
              >
                <option value="">ทั้งหมด</option>
                <option value="มกราคม">มกราคม</option>
                <option value="กุมภาพันธ์">กุมภาพันธ์</option>
                <option value="มีนาคม">มีนาคม</option>
                <option value="เมษายน">เมษายน</option>
                <option value="พฤษภาคม">พฤษภาคม</option>
                <option value="มิถุนายน">มิถุนายน</option>
                <option value="กรกฎาคม">กรกฎาคม</option>
                <option value="สิงหาคม">สิงหาคม</option>
                <option value="กันยายน">กันยายน</option>
                <option value="ตุลาคม">ตุลาคม</option>
                <option value="พฤศจิกายน">พฤศจิกายน</option>
                <option value="ธันวาคม">ธันวาคม</option>
              </select>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>สถานะ</th>
                <th>เดือน</th>
                <th>ปี</th>
              </tr>
            </thead>
            <tbody>
              {invoiceUnpaid
                .filter(invoice => !selectedUnpaidMonth || invoice.month === selectedUnpaidMonth)
                .map((invoice, index) => (
                  <tr key={invoice.id}>
                    <td>{index + 1}</td>
                    <td>{invoice.firstName || 'N/A'}</td>
                    <td>{invoice.lastName || 'N/A'}</td>
                    <td>{invoice.status || 'ค้างชำระ'}</td>
                    <td>{invoice.month || 'N/A'}</td>
                    <td>{invoice.year || 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

      {selectedStat === 'paid' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className={styles.tableTitlepaid}>
              จำนวนบ้านที่ชำระค่าขยะแล้ว
            </h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="paidMonthSelect" style={{ marginRight: '10px', fontWeight: 'bold', color: '#333' }}>
                เลือกเดือน:
              </label>
              <select
                id="paidMonthSelect"
                value={selectedPaidMonth}
                onChange={handlePaidMonthChange}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #9e9e9e',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  fontSize: '16px',
                  transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 4px rgba(0, 123, 255, 0.25)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
                onMouseOver={(e) => e.target.style.borderColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.borderColor = '#9e9e9e'}
              >
                <option value="">ทั้งหมด</option>
                <option value="มกราคม">มกราคม</option>
                <option value="กุมภาพันธ์">กุมภาพันธ์</option>
                <option value="มีนาคม">มีนาคม</option>
                <option value="เมษายน">เมษายน</option>
                <option value="พฤษภาคม">พฤษภาคม</option>
                <option value="มิถุนายน">มิถุนายน</option>
                <option value="กรกฎาคม">กรกฎาคม</option>
                <option value="สิงหาคม">สิงหาคม</option>
                <option value="กันยายน">กันยายน</option>
                <option value="ตุลาคม">ตุลาคม</option>
                <option value="พฤศจิกายน">พฤศจิกายน</option>
                <option value="ธันวาคม">ธันวาคม</option>
              </select>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>สถานะ</th>
                <th>เดือน</th>
                <th>ปี</th>
                <th>วันที่โอน</th>
                <th>เวลาที่โอน</th>
              </tr>
            </thead>
            <tbody>
              {paidHouses
                .filter(house => !selectedPaidMonth || house.month === selectedPaidMonth)
                .map((house, index) => (
                  <tr key={house.id}>
                    <td>{index + 1}</td>
                    <td>{house.firstName || 'N/A'}</td>
                    <td>{house.lastName || 'N/A'}</td>
                    <td>{house.status || 'N/A'}</td>
                    <td>{house.month || 'N/A'}</td>
                    <td>{house.year || 'N/A'}</td>
                    <td>{new Date(house.transferDate).toLocaleDateString() || 'N/A'}</td>
                    <td>{new Date(house.transferTime).toLocaleTimeString() || 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

    </div>
  );
};

export default Dashboard;
