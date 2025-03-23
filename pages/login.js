import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from './firebase'; // นำเข้า Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';
import { message } from 'antd';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        // เริ่มการตรวจสอบเงื่อนไขการเข้าสู่ระบบ
        try {
            const userQuery = query(
                collection(db, 'user'), 
                where('username', '==', username), 
                where('password', '==', password)
            );

            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();
                
                if (userData.username === 'admin') {
                    router.push("/homepage");
                } else if (userData.username === 'manager') {
                    router.push("/mainmanager");
                }
                
                message.success('เข้าสู่ระบบสำเร็จ');
            } else {
                message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
    };

    // สร้าง style สำหรับ login container
    const loginContainerStyle = {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
    };

    // สร้าง style สำหรับรายละเอียดระบบ
    const descriptionStyle = {
        fontWeight: 'bold',
        color: 'black',
        fontSize: '18px',
        marginTop: '20px',
    };

    // สร้าง style สำหรับ logo
    const logoStyle = {
        width: 'calc(750px - 20px)',
        height: 'auto',
        borderRadius: '10px',
    };

    // สร้าง style สำหรับ input fields
    const inputStyle = {
        width: 'calc(45% - 40px)',
        padding: '12px',
        margin: '8px 0',
        marginTop: '20px',
        border: '2px solid #ccc',
        borderRadius: '16px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '16px',
        boxShadow: '4px 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        color: '#000',
    };

    // สร้าง style สำหรับปุ่มเข้าสู่ระบบ
    const buttonStyle = {
        width: 'calc(20% - 20px)',
        padding: '12px',
        margin: '8px 0',
        border: '2px solid #ccc',
        borderRadius: '16px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '16px',
        backgroundColor: '#ff7f50',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    return (
        <div style={loginContainerStyle}>
            <img src="logo.jpg" alt="logo" style={logoStyle} />
            <p style={descriptionStyle}>ระบบจัดการเก็บการชำระค่าขยะมูลฝอย</p>
            <input 
                type="text" 
                id="username" 
                placeholder="ชื่อผู้ใช้งาน"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input 
                type="password" 
                id="password" 
                placeholder="รหัสผ่าน"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button style={buttonStyle} onClick={handleLogin}>เข้าสู่ระบบ</button>
        </div>
    );
}


