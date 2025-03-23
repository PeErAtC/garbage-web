import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { FaHome, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [houses, setHouses] = useState([]);
  const [unpaidHouses, setUnpaidHouses] = useState([]);
  const [paidHouses, setPaidHouses] = useState([]);
  const [invoiceUnpaid, setInvoiceUnpaid] = useState([]);
  const [selectedStat, setSelectedStat] = useState('total');
  const [selectedMoo, setSelectedMoo] = useState('');
  const [selectedPaidMonth, setSelectedPaidMonth] = useState('');
  const [selectedUnpaidMonth, setSelectedUnpaidMonth] = useState('');
  const [viewHouseModalVisible, setViewHouseModalVisible] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [filteredHouseCount, setFilteredHouseCount] = useState(houses.length);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [formData, setFormData] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    idCardNumber: '',
    phoneNumber: '',
    houseNumber: '',
    moo: '',
    subDistrict: '',
    district: '',
    province: '',
    location: '',
    password: ''
  });

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
      !selectedPaidMonth || house.month === selectedPaidMonth
    ).length;

    const countUnpaidHouses = invoiceUnpaid.filter(invoice => 
      !selectedUnpaidMonth || invoice.month === selectedUnpaidMonth
    ).length;

    setPaidCount(countPaidHouses);
    setUnpaidCount(countUnpaidHouses);
  }, [paidHouses, invoiceUnpaid, selectedPaidMonth, selectedUnpaidMonth]);

  useEffect(() => {
    const filteredCount = houses.filter(house => !selectedMoo || house.moo === selectedMoo).length;
    setFilteredHouseCount(filteredCount);
  }, [houses, selectedMoo]);

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
  };

  const handleMooChange = (event) => {
    setSelectedMoo(event.target.value);
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

    const paymentRef = collection(db, 'payment');
    const housePaymentsQuery = query(paymentRef, where("houseNumber", "==", house.houseNumber));

    onSnapshot(housePaymentsQuery, (querySnapshot) => {
      const payments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPaymentHistory(payments);
    });
  };

  const filteredHouses = houses
    .filter(house => {
      if (selectedStat === 'unpaid') {
        return invoiceUnpaid.some(invoice => invoice.houseNumber === house.houseNumber);
      }
      if (selectedStat === 'paid') {
        return paidHouses.some(payment => payment.houseNumber === house.houseNumber);
      }
      return true;
    })
    .filter(house => !selectedMoo || house.moo === selectedMoo)
    .sort((a, b) => {
      if (a.moo !== b.moo) {
        return a.moo.localeCompare(b.moo);
      } else {
        return a.firstName.localeCompare(b.firstName);
      }
    });

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <div className={styles.stat} onClick={() => handleStatClick('total')}>
          <div className={styles.iconHome}>
            <FaHome className={styles.icon} />
          </div>
          <div className={styles.statContent}>
            <p>จำนวนบ้านทั้งหมด</p>
            <h3>{filteredHouseCount} หลังคาเรือน</h3>
          </div>
        </div>

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
                .filter(invoice => invoice.month === selectedUnpaidMonth)  // กรองเฉพาะเดือนที่เลือก
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
                .filter(house => house.month === selectedPaidMonth)  // กรองเฉพาะเดือนที่เลือก
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

      {selectedStat === 'total' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className={`${styles.tableTitle} ${selectedStat === 'total' ? styles.total : selectedStat === 'paid' ? styles.paid : styles.unpaid}`}>
              จำนวนบ้านทั้งหมด
            </h2>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="mooSelect" style={{ marginRight: '10px', fontWeight: 'bold', color: '#333' }}>
                เลือกหมู่:
              </label>
              <select
                id="mooSelect"
                value={selectedMoo}
                onChange={handleMooChange}
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
                {[...new Set(houses.map(house => house.moo))].map(moo => (
                  <option key={moo} value={moo}>{moo}</option>
                ))}
              </select>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>บ้านเลขที่</th>
                <th>หมู่ที่</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {filteredHouses.map((house, index) => (
                <tr key={house.id}>
                  <td>{index + 1}</td>
                  <td>{house.firstName || 'N/A'}</td>
                  <td>{house.lastName || 'N/A'}</td>
                  <td>{house.houseNumber || 'N/A'}</td>
                  <td>{house.moo || 'N/A'}</td>
                  <td>
                    <button className={styles.viewButton} onClick={() => handleViewHouse(house)}>VIEW</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modal แสดงรายละเอียดบ้านและประวัติการชำระเงิน */}
      <Modal
        title={<div className="modal-header" style={{ fontSize: '18px', backgroundColor: '#ff00f9', color: '#ffffff', width: '25%', textAlign: 'center', alignItems: 'center', height: '30px', borderRadius: '20px' }}>รายละเอียดบ้าน</div>}
        visible={viewHouseModalVisible}
        onCancel={() => setViewHouseModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentHouse && (
          <div className="modal-body" style={{ fontSize: '18px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Left Side */}
              <div style={{ width: '45%' }}>
                <p><strong>คำนำหน้า:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.prefix || 'N/A'}</p>
                <p><strong>ชื่อ:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.firstName || 'N/A'}</p>
                <p><strong>นามสกุล:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.lastName || 'N/A'}</p>
                <p><strong>บ้านเลขที่:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.houseNumber || 'N/A'}</p>
                <p><strong>หมู่ที่:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.moo || 'N/A'}</p>
              </div>
              {/* Right Side */}
              <div style={{ width: '45%' }}>
                <p><strong>ตำบล:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.subDistrict || 'N/A'}</p>
                <p><strong>อำเภอ:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.district || 'N/A'}</p>
                <p><strong>จังหวัด:</strong></p>
                <p style={{ borderBottom: '1px solid #ddd', color: '#888', fontSize: '18px', paddingBottom: '5px' }}>{currentHouse.province || 'N/A'}</p>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
