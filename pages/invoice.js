import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase'; 
import { Modal, message, Button } from 'antd'; 
import styles from './Invoice.module.css';

const Invoice = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [garbagerate, setGarbagerate] = useState('');
  const [garbagerates, setGarbagerates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'item'), (querySnapshot) => {
      const invoicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      invoicesData.sort((a, b) => {
        const mooA = parseInt(a.moo, 10);
        const mooB = parseInt(b.moo, 10);
        return mooA - mooB;
      });

      setInvoices(invoicesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (querySnapshot) => {
      const garbageratesData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.status === 'เปิดใช้งาน');
      setGarbagerates(garbageratesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(invoices.map(invoice => invoice.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  useEffect(() => {
    setSelectAll(selectedRows.length === invoices.length);
  }, [selectedRows, invoices]);

  const showConfirmModal = () => {
    if (selectedRows.length === 0) {
      message.warning('กรุณาเลือกสมาชิกที่จะส่งใบแจ้งหนี้');
    } else if (garbagerate === '') {
      message.warning('กรุณาเลือกยอดที่ต้องชำระ');
    } else if (month === '' || year === '') {
      message.warning('กรุณาเลือกเดือนและปี');
    } else {
      setIsModalVisible(true);
    }
  };

  const getNextInvoiceNumber = async () => {
    const docRef = doc(db, 'config', 'invoiceNumber');
    const docSnap = await getDoc(docRef);
  
    let nextInvoiceNumber = 1;
  
    if (docSnap.exists()) {
      nextInvoiceNumber = docSnap.data().lastInvoiceNumber + 1;
    }
  
    await setDoc(docRef, { lastInvoiceNumber: nextInvoiceNumber });
  
    return nextInvoiceNumber.toString().padStart(10, '0'); 
  };
  

  const handleOk = async () => {
    try {
      for (let id of selectedRows) {
        const invoice = invoices.find(inv => inv.id === id);
        if (invoice) {
          const invoiceNumber = await getNextInvoiceNumber();
          
          await addDoc(collection(db, 'invoice'), {
            id,                
            invoiceNumber,     
            garbagerate,       
            month,             
            year,              
            prefix: invoice.prefix,      
            firstName: invoice.firstName,  
            lastName: invoice.lastName,    
            idCardNumber: invoice.idCardNumber, 
            status: 'ค้างชำระ',  
            createdAt: new Date()  
          });
        }
      }
      setIsModalVisible(false);
      setIsSuccessModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการส่งใบแจ้งหนี้');
      setIsModalVisible(false);
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccessOk = () => {
    setIsSuccessModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setMonth('');
    setYear('');
    setGarbagerate('');
    setSelectedRows([]);
    setSelectAll(false);
  };

  const getSelectedSummary = () => {
    if (selectAll || selectedRows.length === invoices.length) {
      return 'ทั้งหมด';
    }
    return `${selectedRows.length}/${invoices.length} คน`;
  };

  return (
    <div className={styles.invoiceStatusContainer}>
       <h1 className={styles.title}>ส่งใบแจ้งหนี้</h1>
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <select
            value={garbagerate}
            onChange={(e) => setGarbagerate(e.target.value)}
            className={`${styles.filterSelect} ${garbagerate ? styles.greenText : ''}`}
          >
            <option value="">เลือกยอดที่ต้องชำระ...</option>
            {garbagerates.map((rate) => (
              <option key={rate.id} value={rate.garbagerate}>
                {rate.garbagerate}
              </option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className={styles.filterSelect}>
            <option value="" disabled>เดือน</option>
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
          <select value={year} onChange={(e) => setYear(e.target.value)} className={styles.filterSelect}>
            <option value="" disabled>ปี</option>
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
        <button className={styles.submitButton} onClick={showConfirmModal}>ส่งใบแจ้งหนี้</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className={styles.checkbox} /> All</th>
            <th>No</th>
            <th>คำนำหน้า</th>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>บ้านเลขที่</th>
            <th>หมู่ที่</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(invoice.id)}
                  onChange={() => handleSelectRow(invoice.id)}
                  className={styles.checkbox}
                />
              </td>
              <td>{index + 1}</td>
              <td>{invoice.prefix}</td>
              <td>{invoice.firstName}</td>
              <td>{invoice.lastName}</td>
              <td>{invoice.houseNumber}</td>
              <td>{invoice.moo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="ยืนยันการส่งใบแจ้งหนี้"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} className={styles.modalButton}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} className={styles.modalButton}>
            ยืนยัน
          </Button>,
        ]}
      >
        <div className={styles.modalContent}>
          <p>คุณต้องการส่งใบแจ้งหนี้หรือไม่?</p>
          <p><strong>ยอดที่ต้องชำระ:</strong> {garbagerate}</p>
          <p><strong>เดือน:</strong> {month}</p>
          <p><strong>ปี:</strong> {year}</p>
          <p><strong>จำนวนสมาชิกที่ส่งใบแจ้งหนี้:</strong> {getSelectedSummary()}</p>
        </div>
      </Modal>

      <Modal
        visible={isSuccessModalVisible}
        onOk={handleSuccessOk}
        footer={null}
        closable={false}
      >
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
          <svg className={styles.checkmark} viewBox="0 0 60 60" width="150" height="150">
  <circle 
    className={styles['checkmark-circle']} 
    cx="30"  // ปรับตำแหน่งวงกลมให้ตรงกลาง
    cy="30"  // ปรับตำแหน่งวงกลมให้ตรงกลาง
    r="25"   // รัศมีของวงกลม
    fill="none" 
    stroke-linejoin="round" 
    stroke-linecap="round" 
    stroke-width="6" 
  />
  <path 
    className={styles['checkmark-check']} 
    fill="none" 
    d="M18 30l8 7 16-16" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
  />
</svg>
          </div>
          <p>ส่งใบแจ้งหนี้เรียบร้อย!!!</p>
          <button className={styles.okButton} onClick={handleSuccessOk}>OK</button>
        </div>
      </Modal>
    </div>
  );
};

export default Invoice;
