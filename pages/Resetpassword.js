import React, { useState, useEffect } from 'react';
import { Input, Button, notification } from 'antd'; 
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ดึงข้อมูลผู้ใช้จาก Firestore โดยใช้ uid
        const userDocRef = doc(db, 'user', user.uid); // ระบุคอลเล็กชันและ uid ของผู้ใช้
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username); // สมมติว่าชื่อผู้ใช้ถูกเก็บในฟิลด์ username
        } else {
          console.log('No such document!');
        }
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  const getNextPasswordId = async () => {
    const docRef = doc(db, 'passwordCounter', 'admin');
    const docSnap = await getDoc(docRef);

    let nextPasswordId = 1;

    if (docSnap.exists()) {
      nextPasswordId = docSnap.data().lastPasswordId + 1;
    }

    await updateDoc(docRef, { lastPasswordId: nextPasswordId });

    return nextPasswordId.toString().padStart(10, '0');
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      notification.error({
        message: 'รหัสผ่านไม่ตรงกัน',
        description: 'โปรดตรวจสอบว่ารหัสผ่านใหม่และการยืนยันรหัสผ่านตรงกัน',
        placement: 'top',
      });
      return;
    }

    try {
      const passwordId = await getNextPasswordId();

      await setDoc(doc(db, 'password', passwordId), {
        oldPassword: oldPassword,
        newPassword: newPassword,
        username: username || 'admin',
        createdAt: new Date(),
        passwordId: passwordId
      });

      notification.success({
        message: 'เปลี่ยนรหัสผ่านสำเร็จ',
        description: 'รหัสผ่านของคุณได้ถูกเปลี่ยนเรียบร้อยแล้ว',
        placement: 'top',
      });
    } catch (error) {
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถเปลี่ยนรหัสผ่านได้ โปรดลองใหม่อีกครั้ง',
        placement: 'top',
      });
      console.error('Error updating password: ', error);
    }
  };

  return (
    <div className="password-reset-container">
      <h2>เปลี่ยนรหัสผ่าน</h2>
      <h3>{username}</h3>
      
      <form>
        <label htmlFor="oldPassword">รหัสผ่านเก่า</label>
        <Input.Password
          id="oldPassword"
          placeholder="รหัสผ่านเก่า"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          size="large"
        />

        <label htmlFor="newPassword">สร้างรหัสผ่านใหม่</label>
        <Input.Password
          id="newPassword"
          placeholder="สร้างรหัสผ่านใหม่"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          size="large"
        />

        <label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</label>
        <Input.Password
          id="confirmPassword"
          placeholder="ยืนยันรหัสผ่านใหม่"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          size="large"
        />
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          style={{ marginTop: '50px', fontSize: '18px', padding: '10px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          เปลี่ยนรหัสผ่าน
        </Button>
      </form>

      <style jsx>{`
        .password-reset-container {
          padding: 60px;
          max-width: 700px;
          margin: auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-top: 20px;
          font-size: 18px;
          color: #000;
        }
        h2 {
          text-align: center;
          font-size: 28px;
        }
        h3 {
          text-align: center;
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
