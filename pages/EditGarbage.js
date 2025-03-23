import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Switch, Select } from 'antd';
import { updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';

const EditGarbage = ({ visible, onCancel, currentItem }) => {
  const [garbageRate, setGarbageRate] = useState(currentItem ? currentItem.garbagerate : '');
  const [status, setStatus] = useState(currentItem ? currentItem.status : '');
  const [date, setDate] = useState(currentItem ? currentItem.date : '');
  const [month, setMonth] = useState(currentItem ? currentItem.month : '');
  const [year, setYear] = useState(currentItem ? currentItem.year : '');
  const { Option } = Select;
  
  useEffect(() => {
    setGarbageRate(currentItem ? currentItem.garbagerate : '');
    setStatus(currentItem ? currentItem.status : '');
    setDate(currentItem ? currentItem.date : '');
    setMonth(currentItem ? currentItem.month : '');
    setYear(currentItem ? currentItem.year : '');
  }, [currentItem]);

  const handleSave = async () => {
    try {
      const newDate = `${date}`;
      await updateDoc(doc(db, 'items', currentItem.id), { garbagerate: garbageRate, date: newDate, month: month, year: year, status: status });
      message.success('อัปเดตข้อมูลเรียบร้อยแล้ว');
      onCancel();
    } catch (error) {
      console.error('Error updating document: ', error);
      message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  return (
    <Modal
      centered
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>ยกเลิก</Button>,
        <Button key="save" type="primary" onClick={handleSave}>บันทึก</Button>
      ]}
    >
      <div>
        <h2>แก้ไขข้อมูล</h2>
        <div>
          <label>อัตราค่าขยะ:</label>
          <Input value={garbageRate} onChange={(e) => setGarbageRate(e.target.value)} />
        </div>
        <div>
        <label>วันที่เปิดใช้งาน:</label>
        <Input.Group compact>
        <Select
            style={{ width: '33.33%' }}
            placeholder="วันที่"
            value={date}
            onChange={(value) => setDate(value)}
            >
            {[...Array(31).keys()].map((day) => (
                <Option key={day + 1} value={day + 1}>{day + 1}</Option>
            ))}
        </Select>
        <Select
            style={{ width: '33.33%' }}
            placeholder="เดือน"
            value={month}
            onChange={(value) => setMonth(value)}
            >
            <Option value="มกราคม">มกราคม</Option>
            <Option value="กุมภาพันธ์">กุมภาพันธ์</Option>
            <Option value="มีนาคม">มีนาคม</Option>
            <Option value="เมษายน">เมษายน</Option>
            <Option value="พฤษภาคม">พฤษภาคม</Option>
            <Option value="มิถุนายน">มิถุนายน</Option>
            <Option value="กรกฎาคม">กรกฎาคม</Option>
            <Option value="สิงหาคม">สิงหาคม</Option>
            <Option value="กันยายน">กันยายน</Option>
            <Option value="ตุลาคม">ตุลาคม</Option>
            <Option value="พฤศจิกายน">พฤศจิกายน</Option>
            <Option value="ธันวาคม">ธันวาคม</Option>
        </Select>
        <Select
            style={{ width: '33.33%' }}
            placeholder="ปี"
            value={year}
            onChange={(value) => setYear(value)}
            >
            {Array.from({ length: 20 }, (_, index) => new Date().getFullYear() - 5 + index).map(year => (
                <Option key={year} value={year}>{year + 543 }</Option>
            ))}
        </Select>
        </Input.Group>

        </div>
        <div>
          <label>สถานะ:</label>
          <Switch checked={status === 'เปิดใช้งาน'} onChange={(checked) => setStatus(checked ? 'เปิดใช้งาน' : 'ปิดใช้งาน')} />
        </div>
      </div>
    </Modal>
  );
};

export default EditGarbage;