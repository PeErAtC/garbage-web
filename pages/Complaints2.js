import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, notification } from 'antd'; 
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore"; 
import { db } from './firebase'; 
import { CheckCircleOutlined } from '@ant-design/icons'; 

const { Option } = Select;

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [complaintsData, setComplaintsData] = useState([]); 
  const [selectedComplaint, setSelectedComplaint] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [status, setStatus] = useState('รับเรื่องร้องเรียน'); 
  const [isImageModalVisible, setIsImageModalVisible] = useState(false); // สำหรับการขยายรูปภาพ
  const [selectedImage, setSelectedImage] = useState(null); // เก็บรูปภาพที่เลือกเพื่อขยาย

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Report'), (querySnapshot) => {
      const complaints = [];
      querySnapshot.forEach((doc) => {
        complaints.push({ id: doc.id, ...doc.data() });
      });
      setComplaintsData(complaints);
    }, (error) => {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำร้องเรียน: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status || 'รับเรื่องร้องเรียน');
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setIsModalVisible(false);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleAcceptComplaint = async () => {
    if (selectedComplaint) {
      try {
        const complaintRef = doc(db, 'Report', selectedComplaint.id);
        await updateDoc(complaintRef, { status });

        console.log('อัปเดตคำร้องเรียนแล้ว:', selectedComplaint.id, status);
        setIsModalVisible(false);

        notification.success({
          message: 'อัปเดทสถานะแล้ว',
          description: 'สถานะของคำร้องเรียนได้ถูกอัพเดทเรียบร้อยแล้ว',
          placement: 'top',
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        });
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตคำร้องเรียน:', error);
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); 
    setIsImageModalVisible(true); 
  };

  const filteredComplaints = complaintsData.filter((complaint) =>
    complaint.reportTitle ? complaint.reportTitle.includes(searchTerm) : false
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="ค้นหา"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <table className="complaints-table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>รายละเอียด</th>
            <th>สถานที่</th>
            <th>หัวข้อการรายงาน</th>
            <th>สร้างเมื่อ</th>
            <th>สถานะ</th>
            <th>รูปภาพ</th> {/* คอลัมน์ใหม่สำหรับรูปภาพ */}
            <th>รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.firstName}</td>
              <td>{complaint.details}</td>
              <td>{complaint.location}</td>
              <td>{complaint.reportTitle}</td>
              <td>{new Date(complaint.createdAt).toLocaleString()}</td> {/* ฟิลด์ createdAt */}
              <td>{complaint.status}</td>
              <td>
                {complaint.file ? (
                  <img
                    src={complaint.file}
                    alt="รูปภาพคำร้องเรียน"
                    className="complaint-image-thumbnail"
                    onClick={() => handleImageClick(complaint.file)} // กดรูปภาพเพื่อขยาย
                  />
                ) : (
                  <p>ไม่มีรูปภาพ</p>
                )}
              </td>
              <td>
                <button className="view-details-button" onClick={() => handleViewDetails(complaint)}>ดูรายละเอียด</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && selectedComplaint && (
        <Modal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <h2>รายละเอียดการร้องเรียน</h2>
        <p><strong>ชื่อ:</strong> {selectedComplaint.firstName}</p>
        <p><strong>รายละเอียด:</strong> {selectedComplaint.details}</p>
        <p><strong>สถานที่:</strong> {selectedComplaint.location}</p>
        <p><strong>หัวข้อการรายงาน:</strong> {selectedComplaint.reportTitle}</p>
        <p><strong>สถานะ:</strong></p>
        <Select
          value={status}
          onChange={handleStatusChange}
          style={{ width: '100%' }}
        >
          <Option value="รับเรื่องร้องเรียน">รับเรื่องร้องเรียน</Option>
          <Option value="ดำเนินการแก้ไขแล้ว">ดำเนินการแก้ไขแล้ว</Option>
        </Select>
      
        <div className="complaint-image-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          {selectedComplaint.file ? (
            <img src={selectedComplaint.file} alt="รูปภาพคำร้องเรียน" className="complaint-image-modal" />
          ) : (
            <p>ไม่มีรูปภาพ</p>
          )}
        </div>
      
        <Button type="primary" onClick={handleAcceptComplaint} style={{ marginTop: '20px' }}>
          ยืนยันการอัพเดตสถานะ
        </Button>
      </Modal>
      
      )}

      {isImageModalVisible && (
        <Modal
          visible={isImageModalVisible}
          onCancel={() => setIsImageModalVisible(false)}
          footer={null}
          centered
        >
          <img src={selectedImage} alt="ขยายรูปภาพคำร้องเรียน" style={{ width: '100%' }} />
        </Modal>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          background-color: #ffffff;
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          color: #000;
        }
        .search-bar::placeholder {
          color: #000;
        }
        .complaints-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff; 
        }
        .complaints-table th,
        .complaints-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .complaints-table th {
          background-color: #f2f2f2;
        }
        .view-details-button {
          padding: 8px 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .view-details-button:hover {
          background-color: #0056b3;
        }
        .complaint-image-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          cursor: pointer;
        }
        .complaint-image-modal {
          width: 100%;
          max-width: 400px; /* ปรับขนาดรูปภาพให้ใหญ่ขึ้น */
          height: auto;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default Complaints;
