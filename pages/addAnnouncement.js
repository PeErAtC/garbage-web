import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function NewsForm() {
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  const [notification, setNotification] = useState('');
  const [image, setImage] = useState(null);

  const storage = getStorage();

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      return url;
    }
    return '';
  };

  // Add announcement to database
  const addAnnouncement = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    if (newAnnouncement.title !== '' && newAnnouncement.content !== '') {
      try {
        const imageUrl = await handleImageUpload();

        await addDoc(collection(db, 'announcements'), {
          title: newAnnouncement.title.trim(),
          content: newAnnouncement.content.trim(),
          imageUrl: imageUrl,
        });

        setNewAnnouncement({
          title: '',
          content: '',
          imageUrl: '',
        });
        setImage(null);
        setNotification('บันทึกข้อมูลสำเร็จ');
      } catch (error) {
        console.error('Error adding announcement: ', error);
        setNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } else {
      setNotification('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }
  };

  return (
    <div>
      <form onSubmit={addAnnouncement} style={{ backgroundColor: 'white', padding: '130px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: 'black', textAlign: 'center' }}>เพิ่มข่าวประชาสัมพันธ์</h1>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>หัวข้อ*</label>
          <input
            type="text"
            id="title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px', 
              borderRadius: '15px', 
              border: '2px solid #ccc', 
              backgroundColor: '#F8F8FF',
              color: '#696969', }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>เนื้อหา*</label>
          <textarea
            id="content"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px', 
              borderRadius: '15px', 
              border: '2px solid #ccc', 
              backgroundColor: '#F8F8FF',
              color: '#696969', }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', color: 'black', textAlign: 'left' }}>อัพโหลดรูปภาพ</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px', 
              borderRadius: '15px', 
              border: '2px solid #ccc', 
              backgroundColor: '#F8F8FF',
              color: '#696969', }}
          />
        </div>

        <button  
          type="submit"
          style={{
            borderRadius: '9999px', 
            backgroundColor: '#228B22', 
            color: '#FFFFFF', 
            border: 'none', 
            padding: '0.5rem 2rem', 
            fontWeight: '600', 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            width: '9rem', 
            height: '3rem', 
            cursor: 'pointer', 
            outline: 'none', 
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#2E8B57'; e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#228B22'; e.target.style.transform = 'scale(1)'; }}
        >
          บันทึกข้อมูล
        </button>

        {/* แสดงข้อความแจ้งเตือน */}
        {notification && <p style={{ color: notification === 'บันทึกข้อมูลสำเร็จ' ? 'green' : 'red', textAlign: 'center', marginTop: '10px' }}>{notification}</p>}
      </form>
    </div>
  );
}
