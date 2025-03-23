import React, { useState } from 'react';
import { collection, addDoc  } from "firebase/firestore"
import {db} from './firebase'


export default function MyForm() {
const [newItem, setNewItem] = useState({
  prefix:'',
  firstName:'',
  lastName:'',
  idCardNumber:'',
  phoneNumber:'',
  houseNumber:'',
  moo:'',
  subDistrict:'',
  district:'',
  province:'',
  location:'',
  password:'',
})

const [notification, setNotification] = useState('');


// Additem to database
const additem = async (e) => {
  e.preventDefault();
  if (
    newItem.prefix !=='' &&
    newItem.firstName !=='' &&
    newItem.lastName !=='' &&
    newItem.idCardNumber !=='' &&
    newItem.phoneNumber !=='' &&
    newItem.houseNumber !=='' &&
    newItem.moo !=='' &&
    newItem.subDistrict !=='' &&
    newItem.district !=='' &&
    newItem.province !=='' &&
    newItem.location !=='' &&
    newItem.password !=='' 
    ){
      //setItems([...items,newItem])
      await addDoc(collection(db,'item'),{
        prefix: newItem. prefix.trim(),
        firstName: newItem. firstName.trim(),
        lastName: newItem. lastName.trim(),
        idCardNumber: newItem. idCardNumber.trim(),
        phoneNumber: newItem. phoneNumber.trim(),
        houseNumber: newItem. houseNumber.trim(),
        moo: newItem. moo.trim(),
        subDistrict: newItem. subDistrict.trim(),
        district: newItem. district.trim(),
        province: newItem. province.trim(),
        location: newItem. location.trim(),
        password: newItem. password.trim()
      });
      setNewItem({
        prefix:'',
        firstName:'',
        lastName:'',
        idCardNumber:'',
        phoneNumber:'',
        houseNumber:'',
        moo:'',
        subDistrict:'',
        district:'',
        province:'',
        location:'',
        password:'',
      });
      // เมื่อบันทึกสำเร็จให้แสดงแจ้งเตือน
      alert('บันทึกข้อมูลสำเร็จ');
    } else {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }
  };
// Read items from database

// Delete item from database
  const [prefix, setPrefix] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [moo, setMoo] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const handlePrefixChange = (event) => {
    setPrefix(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleIdCardNumberChange = (event) => {
    setIdCardNumber(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleHouseNumberChange = (event) => {
    setHouseNumber(event.target.value);
  };

  const handleMooChange = (event) => {
    setMoo(event.target.value);
  };

  const handleSubDistrictChange = (event) => {
    setSubDistrict(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('คำนำหน้า:', prefix);
    console.log('ชื่อจริง:', firstName);
    console.log('นามสกุล:', lastName);
    console.log('หมายเลขบัตรประชาชน:', idCardNumber);
    console.log('เบอร์โทรศัพท์:', phoneNumber);
    console.log('บ้านเลขที่:', houseNumber);
    console.log('หมู่ที่:', moo);
    console.log('ตำบล:', subDistrict);
    console.log('อำเภอ:', district);
    console.log('จังหวัด:', province);
    console.log('Location:', location);
    console.log('รหัสผ่าน:', password);
  };

  return (
    <div>
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '130px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(, 0, 0, 0.1)' }}>
    <h1 style={{ color: 'black', textAlign: 'center' }}>เพิ่มข้อมูลผู้ใช้งาน</h1>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>

        {/* ฟิลด์แถวที่ 1 */}
        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="prefix" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>คำนำหน้า*</label>
          <select
            id="prefix"
            value={newItem.prefix}
            onChange={(e) => setNewItem({ ...newItem, prefix:e.target.value })}
            style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px', 
            borderRadius: '15px', 
            border: '2px solid #ccc', 
            backgroundColor: '#F8F8FF',
            color: '#696969', }}
          >
            <option value="">โปรดเลือก</option>
            <option value="Mr.">นาย</option>
            <option value="Ms.">นางสาว</option>
          </select> 
        </div>

        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left' }}>ชื่อจริง*</label>
          <input
            value={newItem.firstName}
            onChange={(e) => setNewItem({ ...newItem, firstName:e.target.value })}
            type="text"
            id="firstName"
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

        <div style={{ flex: 1 }}>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>นามสกุล*</label>
          <input
            type="text"
            id="lastName"
            value={newItem.lastName}
            onChange={(e) => setNewItem({ ...newItem, lastName:e.target.value })}
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
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>

        {/* แถวที่ 2 */}
        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="idCardNumber" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>หมายเลขบัตรประชาชน*</label>
          <input
            type="text"
            id="idCardNumber"
            value={newItem.idCardNumber}
            onChange={(e) => setNewItem({ ...newItem, idCardNumber:e.target.value })}
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

        <div style={{ flex: 1 }}>
          <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>เบอร์โทรศัพท์*</label>
          <input
            type="text"
            id="phoneNumber"
            value={newItem.phoneNumber}
            onChange={(e) => setNewItem({ ...newItem, phoneNumber:e.target.value })}
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
        {/* แถวที่ 3 */}
        <div style={{ flex: 1, marginRight: '10px' }}>
        <label htmlFor="houseNumber" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>บ้านเลขที่*</label>
          <input
            type="text"
            id="houseNumber"
            value={newItem.houseNumber}
            onChange={(e) => setNewItem({ ...newItem, houseNumber:e.target.value })}
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

        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="moo" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>หมู่ที่*</label>
          <input
            type="text"
            id="moo"
            value={newItem.moo}
            onChange={(e) => setNewItem({ ...newItem, moo:e.target.value })}
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

        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="subDistrict" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>ตำบล*</label>
          <input
            type="text"
            id="subDistrict"
            value={newItem.subDistrict}
            onChange={(e) => setNewItem({ ...newItem, subDistrict:e.target.value })}
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

        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="district" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>อำเภอ*</label>
          <input
            type="text"
            id="district"
            value={newItem.district}
            onChange={(e) => setNewItem({ ...newItem, district:e.target.value })}
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

        <div style={{ flex: 1 }}>
          <label htmlFor="province" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>จังหวัด*</label>
          <input
            type="text"
            id="province"
            value={newItem.province}
            onChange={(e) => setNewItem({ ...newItem, province:e.target.value })}
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>

        {/* แถวที่ 4 */}
        <div style={{ flex: 1, marginRight: '10px' }}>
          <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>Location*</label>
          <input
            type="text"
            id="location"
            value={newItem.location}
            onChange={(e) => setNewItem({ ...newItem, location:e.target.value })}
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

        <div style={{ flex: 1 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: 'black' , textAlign :'left'}}>รหัสผ่าน*</label>
          <input
            type="password"
            id="password"
            value={newItem.password}
            onChange={(e) => setNewItem({ ...newItem, password:e.target.value })}
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
      </div>
      <button  
  onClick={additem}
  type="Submit"
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
{notification && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{notification}</p>}
    </form>
    </div>
  );
}