import React, { useState } from 'react';
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { message, Table, Button, Modal } from 'antd';
import * as XLSX from 'xlsx';

export default function MyForm() {
  const [newItem, setNewItem] = useState({
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
    password: '',
  });

  const [previewData, setPreviewData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notification, setNotification] = useState('');

  const addItem = async (e) => {
    e.preventDefault();
    if (Object.values(newItem).every(value => value !== '')) {
      try {
        // สร้างเอกสารใหม่พร้อมกับฟิลด์ 'id' ที่มีค่าเป็น docRef.id
        const docRef = doc(collection(db, 'item'));
        await setDoc(docRef, {
          ...newItem,
          id: docRef.id,
        });

        // รีเซ็ตฟอร์มหลังจากเพิ่มข้อมูลสำเร็จ
        setNewItem({
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
          password: '',
        });

        message.success('บันทึกข้อมูลสำเร็จ');
      } catch (error) {
        console.error('Error adding document: ', error);
        message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } else {
      message.error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('คำนำหน้า:', newItem.prefix);
    console.log('ชื่อจริง:', newItem.firstName);
    console.log('นามสกุล:', newItem.lastName);
    console.log('หมายเลขบัตรประชาชน:', newItem.idCardNumber);
    console.log('เบอร์โทรศัพท์:', newItem.phoneNumber);
    console.log('บ้านเลขที่:', newItem.houseNumber);
    console.log('หมู่ที่:', newItem.moo);
    console.log('ตำบล:', newItem.subDistrict);
    console.log('อำเภอ:', newItem.district);
    console.log('จังหวัด:', newItem.province);
    console.log('Location:', newItem.location);
    console.log('รหัสผ่าน:', newItem.password);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(sheet);

      // แปลงค่าทั้งหมดใน jsonData ให้เป็น string
      jsonData = jsonData.map(item => {
        const newItem = {};
        Object.keys(item).forEach(key => {
          newItem[key] = String(item[key]);
        });
        return newItem;
      });

      setPreviewData(jsonData);
      setIsModalVisible(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmData = async () => {
    try {
      for (const item of previewData) {
        // สร้างเอกสารใหม่พร้อมกับฟิลด์ 'id' ที่มีค่าเป็น docRef.id
        const docRef = doc(collection(db, 'item'));
        await setDoc(docRef, {
          ...item,
          id: docRef.id,
        });
      }
      setPreviewData([]);
      setIsModalVisible(false);
      message.success('บันทึกข้อมูลจากไฟล์สำเร็จ');
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setPreviewData([]);
  };

  const columns = [
    { title: 'คำนำหน้า', dataIndex: 'prefix', key: 'prefix' },
    { title: 'ชื่อจริง', dataIndex: 'firstName', key: 'firstName' },
    { title: 'นามสกุล', dataIndex: 'lastName', key: 'lastName' },
    { title: 'หมายเลขบัตรประชาชน', dataIndex: 'idCardNumber', key: 'idCardNumber' },
    { title: 'เบอร์โทรศัพท์', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'บ้านเลขที่', dataIndex: 'houseNumber', key: 'houseNumber' },
    { title: 'หมู่ที่', dataIndex: 'moo', key: 'moo' },
    { title: 'ตำบล', dataIndex: 'subDistrict', key: 'subDistrict' },
    { title: 'อำเภอ', dataIndex: 'district', key: 'district' },
    { title: 'จังหวัด', dataIndex: 'province', key: 'province' },
    { title: 'พิกัดตำแหน่งที่ตั้งของบ้าน', dataIndex: 'location', key: 'location' },
    { title: 'รหัสผ่าน', dataIndex: 'password', key: 'password' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '80%', maxWidth: '800px', marginBottom: '20px' }}>
        <h1 style={{ color: 'black', textAlign: 'center' }}>เพิ่มข้อมูลผู้ใช้งาน</h1>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="prefix" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>คำนำหน้า*</label>
            <select
              id="prefix"
              value={newItem.prefix}
              onChange={(e) => setNewItem({ ...newItem, prefix: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            >
              <option value="">โปรดเลือก</option>
              <option value="Mr.">นาย</option>
              <option value="Mr.">นาง</option>
              <option value="Ms.">นางสาว</option>
            </select>
          </div>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>ชื่อจริง*</label>
            <input
              value={newItem.firstName}
              onChange={(e) => setNewItem({ ...newItem, firstName: String(e.target.value) })}
              type="text"
              id="firstName"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>นามสกุล*</label>
            <input
              type="text"
              id="lastName"
              value={newItem.lastName}
              onChange={(e) => setNewItem({ ...newItem, lastName: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="idCardNumber" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>หมายเลขบัตรประชาชน*</label>
            <input
              type="text"
              id="idCardNumber"
              value={newItem.idCardNumber}
              onChange={(e) => {
                const inputID = String(e.target.value);
                if (inputID.length <= 13) { // ตรวจสอบว่ามีไม่เกิน 13 ตัว
                  setNewItem({ ...newItem, idCardNumber: inputID });
                }
              }}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
            {newItem.idCardNumber.length !== 13 && ( // แสดงข้อความเมื่อไม่ได้กรอกเลขบัตรประชาชนครบ 13 ตัว
              <p style={{ color: 'red', marginTop: '5px', textAlign: 'left' }}>โปรดกรอกหมายเลขบัตรประชาชนให้ครบ 13 หลัก</p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>เบอร์โทรศัพท์*</label>
            <input
              type="text"
              id="phoneNumber"
              value={newItem.phoneNumber}
              onChange={(e) => {
                const inputPhoneNumber = String(e.target.value);
                if (/^\d{0,10}$/.test(inputPhoneNumber)) { // ตรวจสอบว่าเป็นตัวเลขและไม่เกิน 10 ตัว
                  setNewItem({ ...newItem, phoneNumber: inputPhoneNumber });
                }
              }}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
            {newItem.phoneNumber.length !== 10 && ( // แสดงข้อความเมื่อไม่ได้กรอกเบอร์โทรศัพท์ครบ 10 ตัว
              <p style={{ color: 'red', marginTop: '5px', textAlign: 'left' }}>โปรดกรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก</p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="houseNumber" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>บ้านเลขที่*</label>
            <input
              type="text"
              id="houseNumber"
              value={newItem.houseNumber}
              onChange={(e) => setNewItem({ ...newItem, houseNumber: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="moo" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>หมู่ที่*</label>
            <input
              type="text"
              id="moo"
              value={newItem.moo}
              onChange={(e) => setNewItem({ ...newItem, moo: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="subDistrict" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>ตำบล*</label>
            <input
              type="text"
              id="subDistrict"
              value={newItem.subDistrict}
              onChange={(e) => setNewItem({ ...newItem, subDistrict: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="district" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>อำเภอ*</label>
            <input
              type="text"
              id="district"
              value={newItem.district}
              onChange={(e) => setNewItem({ ...newItem, district: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="province" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>จังหวัด*</label>
            <input
              type="text"
              id="province"
              value={newItem.province}
              onChange={(e) => setNewItem({ ...newItem, province: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>พิกัดตำแหน่งที่ตั้งของบ้าน*</label>
            <input
              type="text"
              id="location"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>รหัสผ่าน*</label>
            <input
              type="password"
              id="password"
              value={newItem.password}
              onChange={(e) => setNewItem({ ...newItem, password: String(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '15px',
                border: '2px solid #ccc',
                backgroundColor: '#F8F8FF',
                color: '#696969',
              }}
            />
          </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <button
            onClick={addItem}
            type="submit"
            style={{
              borderRadius: '9999px',
              background: '#27ae60',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              marginTop: '30px'
            }}
          >
            บันทึกข้อมูล
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            id="file-upload"
            style={{ display: 'none' }}
            key={Date.now()} // Force re-render by changing the key
          />
          <label
            htmlFor="file-upload"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '15px',
              border: '2px solid #ccc',
              backgroundColor: '#27ae60',
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            เลือกไฟล์
          </label>
        </div>

        {notification && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{notification}</p>}
      </form>

      <Modal
        title="ตัวอย่างข้อมูลจากไฟล์"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ borderRadius: '5px', backgroundColor: '#f5222d', color: '#fff' }}>
            ยกเลิก
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmData} style={{ borderRadius: '5px', backgroundColor: '#52c41a', color: '#fff' }}>
            ยืนยันข้อมูล
          </Button>,
        ]}
        width={1300}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={previewData}
          columns={columns}
          rowKey="idCardNumber"
          pagination={false}
          bordered
          style={{ marginBottom: '20px', padding: '20px' }}
        />
      </Modal>
    </div>
  );
}
