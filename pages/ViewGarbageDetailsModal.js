import React from 'react';
import { Modal } from 'antd';

const ViewGarbageDetailsModal = ({ visible, onCancel, item }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <h2>Garbagerate Details</h2>
      {item && (
        <div>
          <p><strong>อัตราค่าขยะ:</strong> {item.garbagerate}</p>
          <p><strong>วันที่เปิดใช้งาน:</strong> {item.date} {item.month} {item.year}</p>
          <p><strong>สถานะ:</strong> {item.status}</p>
          {/* Add more details here if needed */}
        </div>
      )}
    </Modal>
  );
};

export default ViewGarbageDetailsModal;