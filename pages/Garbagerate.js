import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import styles from './main.module.css'; // Import CSS Modules styles here
import AddGarbage from './Addgarbage';
import EditGarbage from './EditGarbage'; // Import EditGarbage component
import ViewGarbageDetailsModal from './ViewGarbageDetailsModal'; // Import the new modal component

const Garbage = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // State to hold current item for editing
  const [viewDetailsModalVisible, setViewDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddGarbage = () => {
    setOpen(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (querySnapshot) => {
      let itemArr = [];

      querySnapshot.forEach((doc) => {
        itemArr.push({ ...doc.data(), id: doc.id });
      });

      setItems(itemArr.reverse());
    });

    return () => unsubscribe();
  }, []);

  const handleEditUser = (item) => {
    setCurrentItem(item); // Set current item to state
    setEditUserModalVisible(true);
  };

  const handleUpdateGarbage = async (updatedData) => {
    try {
      await updateDoc(doc(db, 'items', updatedData.id), updatedData);
      message.success('อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
      setOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
      message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้งาน');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setViewDetailsModalVisible(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter(item => item.garbagerate.includes(searchTerm));

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div>
        <div className={styles.flexContainer}>
          <h1 className="text-3xl font-bold text-black"></h1>
          <div>
            <div className={styles.addButton} onClick={handleAddGarbage}>เพิ่มอัตราค่าขยะ</div>
          </div>
        </div>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="ค้นหา" 
            className={styles.searchBar} 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>No</th>
                <th>อัตราค่าขยะ</th>
                <th>วันที่เปิดใช้งาน</th>
                <th>สถานะ</th>
                <th>แก้ไข</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.garbagerate}</td>
                  <td>{item.date} {item.month} {item.year}</td>
                  <td className={item.status === 'เปิดใช้งาน' ? styles.statusOpen : styles.statusClosed}>
                    {item.status}
                  </td>
                  <td><button className={styles.editButton} onClick={() => handleEditUser(item)}>แก้ไข</button></td>
                  <td><button className={styles.viewButton} onClick={() => handleViewDetails(item)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        centered
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className={styles.modalContainer}
        width={1070} // ลดความกว้างของ Modal 
      >
        <div className={styles.modalContent} style={{ padding: '10px' }}> {/* ลด padding จากค่าเดิม */}
          <AddGarbage />
          <div className={styles.modalButtonContainer}></div>
        </div>
      </Modal>
      <EditGarbage
        visible={editUserModalVisible}
        onCancel={() => setEditUserModalVisible(false)}
        currentItem={currentItem}
      />
      <ViewGarbageDetailsModal
        visible={viewDetailsModalVisible}
        onCancel={() => setViewDetailsModalVisible(false)}
        item={selectedItem}
      />
    </div>
  );
};

export default Garbage;