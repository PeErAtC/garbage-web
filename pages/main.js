import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import styles from './main.module.css';
import { useRouter } from 'next/router';
import InputUser from './inputUser';
import EditForm from './EditForm';

const UsersPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAddUser = () => {
    setOpen(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'item'), (querySnapshot) => {
      let itemArr = [];

      querySnapshot.forEach((doc) => {
        itemArr.push({ ...doc.data(), id: doc.id });
      });

      setItems(itemArr.reverse());
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = async (id) => {
    setDeleteUserId(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, 'item', deleteUserId));
      message.success('ลบผู้ใช้งานเรียบร้อยแล้ว');
      setDeleteConfirmVisible(false);
    } catch (error) {
      console.error('Error removing document: ', error);
      message.error('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await updateDoc(doc(db, 'item', updatedData.id), updatedData);
      message.success('อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
      setOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
      message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้งาน');
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditUserModalVisible(true);
  };

  const filteredUsers = items
  .filter((user) => {
    const firstName = user.firstName?.toLowerCase() || '';
    const lastName = user.lastName?.toLowerCase() || '';
    const idCardNumber = String(user.idCardNumber || '');

    return (
      firstName.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase()) ||
      idCardNumber.includes(searchTerm)
    );
  })
  .sort((a, b) => a.firstName.localeCompare(b.firstName, 'th')); 

  return (
    <div className="container">
      <div className="formWrapper">
        <div>
          <div className={styles.flexContainer}>
            <h1 className="text-3xl font-bold text-black"></h1>
            <div>
              <button className={styles.addButton} onClick={handleAddUser}>เพิ่มข้อมูลผู้ใช้งาน</button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="ค้นหารายชื่อสมาชิก"
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>No</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ</th>
                  <th>นามสกุล</th>
                  <th>หมายเลขบัตรประชาชน</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.prefix}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.idCardNumber}</td>
                    <td>{user.phoneNumber}</td>
                    <td><button className={styles.editButton} onClick={() => handleEditUser(user)}>แก้ไข</button></td>
                    <td><button className={styles.deleteButton} onClick={() => deleteUser(user.id)}>ลบ</button></td>
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
          width={800} // ปรับความกว้างของ Modal
        >
          <div className={styles.modalContent}>
            <InputUser />
            <div className={styles.modalButtonContainer}></div>
          </div>
        </Modal>
        <Modal
          title="ยืนยันการลบผู้ใช้งาน"
          centered
          visible={deleteConfirmVisible}
          onOk={confirmDeleteUser}
          onCancel={() => setDeleteConfirmVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
          okText="ลบผู้ใช้งาน"
          cancelText="ยกเลิก"
          className={styles.deleteModal}
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?</p>
        </Modal>
        <Modal
          title="แก้ไขข้อมูลผู้ใช้งาน"
          centered
          visible={editUserModalVisible}
          onCancel={() => setEditUserModalVisible(false)}
          footer={null}
          width={800} // ปรับความกว้างของ Modal
        >
          <EditForm currentUser={currentUser} handleUpdateUser={handleUpdateUser} />
        </Modal>
      </div>
      <style jsx global>{`
        html, body {
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .container {
          min-height: 100vh;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default UsersPage;
