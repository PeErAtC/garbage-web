import React, { useEffect } from 'react';
import { message, Form, Input, Button, Select } from 'antd';
import styles from './EditForm.module.css'; // ใช้ไฟล์ CSS แยกสำหรับการจัดแต่ง

const { Option } = Select;

const EditForm = ({ currentUser, handleUpdateUser }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(currentUser);
  }, [currentUser]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = { id: currentUser.id, ...values };
      await handleUpdateUser(updatedData);
      message.success('บันทึกการแก้ไขข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating document: ', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูล');
    }
  };

  const confirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
    },
  });

  return (
    <div className={styles.container}>
      <Form form={form} onFinish={handleSubmit} initialValues={currentUser}>
        <div className={styles.row}>
          <Form.Item
            label="คำนำหน้า"
            name="prefix"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า' }]}
          >
            <Select className={styles.select}>
              <Option value="นาย">นาย</Option>
              <Option value="นาง">นาง</Option>
              <Option value="นางสาว">นางสาว</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ชื่อจริง"
            name="firstName"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกชื่อจริง' }]}
          >
            <Input className={styles.input} />
          </Form.Item>
        </div>

        <div className={styles.row}>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
          >
            <Input className={styles.input} />
          </Form.Item>

          <Form.Item
            label="หมายเลขบัตรประชาชน"
            name="idCardNumber"
            className={styles.item}
            rules={[
              { required: true, message: 'กรุณากรอกหมายเลขบัตรประชาชน' },
              { len: 13, message: 'หมายเลขบัตรประชาชนต้องมี 13 ตัว' }
            ]}
          >
            <Input className={styles.input} maxLength={13} />
          </Form.Item>
        </div>

        <div className={styles.row}>
          <Form.Item
            label="เบอร์โทรศัพท์"
            name="phoneNumber"
            className={styles.item}
            rules={[
              { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
              { len: 10, message: 'เบอร์โทรศัพท์ต้องมี 10 ตัว' }
            ]}
          >
            <Input className={styles.input} maxLength={10} />
          </Form.Item>

          <Form.Item
            label="บ้านเลขที่"
            name="houseNumber"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกบ้านเลขที่' }]}
          >
            <Input className={styles.input} />
          </Form.Item>
        </div>

        <div className={styles.row}>
          <Form.Item
            label="หมู่ที่"
            name="moo"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกหมู่ที่' }]}
          >
            <Input className={styles.input} />
          </Form.Item>

          <Form.Item
            label="ตำบล"
            name="subDistrict"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกตำบล' }]}
          >
            <Input className={styles.input} />
          </Form.Item>
        </div>

        <div className={styles.row}>
          <Form.Item
            label="อำเภอ"
            name="district"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกอำเภอ' }]}
          >
            <Input className={styles.input} />
          </Form.Item>

          <Form.Item
            label="จังหวัด"
            name="province"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกจังหวัด' }]}
          >
            <Input className={styles.input} />
          </Form.Item>
        </div>

        <Form.Item
          label="พิกัดตำแหน่งที่ตั้งของบ้าน"
          name="location"
          className={styles.fullWidthItem}
          rules={[{ required: true, message: 'กรุณากรอกพิกัดตำแหน่งที่ตั้งของบ้าน' }]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <div className={styles.row}>
          <Form.Item
            label="รหัสผ่าน"
            name="password"
            className={styles.item}
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
          >
            <Input.Password className={styles.input} />
          </Form.Item>

          <Form.Item
            label="ยืนยันรหัสผ่าน"
            name="confirmPassword"
            className={styles.item}
            dependencies={['password']}
            rules={[
              { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
              confirmPassword({ getFieldValue: form.getFieldValue })
            ]}
          >
            <Input.Password className={styles.input} />
          </Form.Item>
        </div>

        <Form.Item className={styles.submitButtonContainer}>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
          >
            บันทึกข้อมูล
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditForm;
