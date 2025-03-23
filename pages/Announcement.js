import React, { useState, useEffect } from 'react';
import { Modal, message, Input, Button, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Zoom from 'react-medium-image-zoom'; // Import Zoom component
import 'react-medium-image-zoom/dist/styles.css'; // Import CSS for zoom
import { db, storage } from './firebase'; // Import Firebase configuration and storage
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from './main.module.css';
import moment from 'moment'; // Import moment.js for date formatting

const AnnouncementPage = () => {
  const [open, setOpen] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailsAnnouncement, setDetailsAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState(null);
  const [editAnnouncementModalVisible, setEditAnnouncementModalVisible] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageToPreview, setImageToPreview] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const announcementsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.createdAt - b.createdAt); // เรียงลำดับจากล่าสุดไปเก่าสุด
  
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error fetching announcements: ', error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูลประกาศ');
      }
    };
  
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = () => {
    setOpen(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!newTitle || !newContent) {
      message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    let imageUrl = '';

    if (!imageFile) {
      message.error('กรุณาเลือกไฟล์รูปภาพก่อนอัปโหลด');
      return;
    }

    try {
      const storageRef = ref(storage, `announcements/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);

      const announcementData = {
        title: newTitle,
        content: newContent,
        image: imageUrl,
        createdAt: new Date(),
        timestamp: serverTimestamp(), 
      };

      await addDoc(collection(db, 'announcements'), announcementData);
      setAnnouncements([...announcements, { id: announcementData.id, ...announcementData }]);

      message.success('เพิ่มประกาศเรียบร้อยแล้ว');
      setOpen(false);
      setNewTitle('');
      setNewContent('');
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error uploading image: ', error);
      message.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    }
  };

  const handleImageUpload = ({ file }) => {
    if (!file) {
      message.error('กรุณาเลือกไฟล์รูปภาพ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      message.error('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const deleteAnnouncement = async (id) => {
    setDeleteAnnouncementId(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteAnnouncement = async () => {
    try {
      await deleteDoc(doc(db, 'announcements', deleteAnnouncementId));
      setAnnouncements(announcements.filter(item => item.id !== deleteAnnouncementId));
      message.success('ลบประกาศเรียบร้อยแล้ว');
      setDeleteConfirmVisible(false);
    } catch (error) {
      console.error('Error removing announcement: ', error);
      message.error('เกิดข้อผิดพลาดในการลบประกาศ');
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setCurrentAnnouncement(announcement);
    setNewTitle(announcement.title);
    setNewContent(announcement.content);
    setImagePreview(announcement.image); // Show current image as a preview
    setEditAnnouncementModalVisible(true);
  };

  const handleSaveEditedAnnouncement = async () => {
    if (!newTitle || !newContent) {
      message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    let imageUrl = currentAnnouncement.image;

    if (imageFile) {
      try {
        const storageRef = ref(storage, `announcements/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading image: ', error);
        message.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        return;
      }
    }

    try {
      const updatedData = {
        title: newTitle,
        content: newContent,
        image: imageUrl,
        timestamp: serverTimestamp(),
      };

      await updateDoc(doc(db, 'announcements', currentAnnouncement.id), updatedData);

      setAnnouncements(announcements.map(announcement =>
        announcement.id === currentAnnouncement.id ? { ...announcement, ...updatedData } : announcement
      ));

      message.success('แก้ไขประกาศเรียบร้อยแล้ว');
      setEditAnnouncementModalVisible(false);
      setNewTitle('');
      setNewContent('');
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error updating announcement: ', error);
      message.error('เกิดข้อผิดพลาดในการแก้ไขประกาศ');
    }
  };

  const handleViewDetails = (announcement) => {
    setDetailsAnnouncement(announcement);
    setDetailsModalVisible(true);
  };

  const handleImageClick = (imageUrl) => {
    setImageToPreview(imageUrl);
    setImageModalVisible(true);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const title = announcement.title?.toLowerCase() || '';
    const content = announcement.content?.toLowerCase() || '';

    return (
      title.includes(searchTerm.toLowerCase()) ||
      content.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container">
      <div className="formWrapper">
        <div>
          <div className={styles.flexContainer}>
            <div>
              <button className={styles.addButton} onClick={handleAddAnnouncement}>เพิ่มประกาศ</button>
            </div>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="ค้นหาประกาศ"
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
                  <th>หัวข้อประกาศ</th>
                  <th>เนื้อหา</th>
                  <th>วันที่เพิ่ม</th> 
                  <th>รายละเอียด</th> 
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((announcement, index) => (
                  <tr key={announcement.id}>
                    <td>{index + 1}</td>
                    <td>{announcement.title}</td>
                    <td>{announcement.content.substring(0, 50)}...</td>
                    <td>{announcement.timestamp 
                          ? moment(announcement.timestamp.toDate ? announcement.timestamp.toDate() : announcement.timestamp).format('DD/MM/YYYY HH:mm:ss') 
                          : 'ไม่มีข้อมูล'}
                    </td>
                    <td><button className={styles.detailsButton} onClick={() => handleViewDetails(announcement)}>ดูรายละเอียด</button></td>
                    <td><button className={styles.editButton} onClick={() => handleEditAnnouncement(announcement)}>แก้ไข</button></td>
                    <td><button className={styles.deleteButton} onClick={() => deleteAnnouncement(announcement.id)}>ลบ</button></td>
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
          width={800}
        >
          <div className={styles.modalContent}>
            <h2>เพิ่มประกาศใหม่</h2>
            <div style={{ marginBottom: '15px' }}>
              <Input
                placeholder="หัวข้อประกาศ"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input.TextArea
                rows={4}
                placeholder="เนื้อหาประกาศ"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false} // Disable automatic upload
                onChange={handleImageUpload}
              >
                <Button icon={<PlusOutlined />}>แนบรูปภาพ</Button>
              </Upload>
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <Zoom>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', cursor: 'pointer' }} />
                  </Zoom>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleSaveAnnouncement}>เพิ่มประกาศ</Button>
              <Button style={{ marginLeft: '10px' }} onClick={() => setOpen(false)}>ยกเลิก</Button>
            </div>
          </div>
        </Modal>
        <Modal
          title="รายละเอียดประกาศ"
          centered
          visible={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={null}
          width={800}
        >
          {detailsAnnouncement && (
            <div className={styles.modalContent}>
              <h2>{detailsAnnouncement.title}</h2>
              <p>{detailsAnnouncement.content}</p>
              {detailsAnnouncement.timestamp && (
                <p><strong>วันที่เพิ่ม:</strong> {moment(detailsAnnouncement.timestamp.toDate ? detailsAnnouncement.timestamp.toDate() : detailsAnnouncement.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p> 
              )}
              {detailsAnnouncement.image && (
                <Zoom>
                  <img src={detailsAnnouncement.image} alt="Attached" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginTop: '20px', cursor: 'pointer' }} />
                </Zoom>
              )}
            </div>
          )}
        </Modal>
        <Modal
          title="ยืนยันการลบประกาศ"
          centered
          visible={deleteConfirmVisible}
          onOk={confirmDeleteAnnouncement}
          onCancel={() => setDeleteConfirmVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
          okText="ลบประกาศ"
          cancelText="ยกเลิก"
          className={styles.deleteModal}
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?</p>
        </Modal>
        <Modal
          title="ภาพที่ขยายใหญ่ขึ้น"
          centered
          visible={imageModalVisible}
          onCancel={() => setImageModalVisible(false)}
          footer={null}
          width={800}
        >
          <Zoom>
            <img src={imageToPreview} alt="Preview" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          </Zoom>
        </Modal>
        <Modal
          title="แก้ไขข้อมูลประกาศ"
          centered
          visible={editAnnouncementModalVisible}
          onCancel={() => setEditAnnouncementModalVisible(false)}
          footer={null}
          width={800}
        >
          <div className={styles.modalContent}>
            <h2>แก้ไขประกาศ</h2>
            <div style={{ marginBottom: '15px' }}>
              <Input
                placeholder="หัวข้อประกาศ"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input.TextArea
                rows={4}
                placeholder="เนื้อหาประกาศ"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false} // Disable automatic upload
                onChange={handleImageUpload}
              >
                <Button icon={<PlusOutlined />}>แนบรูปภาพ</Button>
              </Upload>
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <Zoom>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', cursor: 'pointer' }} />
                  </Zoom>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleSaveEditedAnnouncement}>บันทึกการแก้ไข</Button>
              <Button style={{ marginLeft: '10px' }} onClick={() => setEditAnnouncementModalVisible(false)}>ยกเลิก</Button>
            </div>
          </div>
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

export default AnnouncementPage;
