import React, { useState } from 'react';

function Addgarbage() {
  const [isOn, setIsOn] = useState(true);

  const toggleButton = () => {
    setIsOn(!isOn);
  };
  return (
    <div
      name="Addgarbage"
      style={{
        backgroundColor: "#F4F4F4",
        width: 1500,
        height: 1024,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        name="Rectangle 46"
        style={{
          backgroundColor: "#FFF9F9",
          borderRadius: 20,
          width: 677,
          height: 811,
          position: "absolute",
          left: 381,
          top: 107,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.4)"
        }}
      ></div>
      <div
        name="Rectangle 36"
        style={{
          backgroundColor: "#FFF",
          borderRadius: 5,
          width: 136,
          height: 43,
          position: "absolute",
          left: 649,
          top: 390
        }}
      ></div>
      <div
        name="Rectangle 44"
        style={{
          backgroundColor: "#FFF",
          borderRadius: 5,
          width: 136,
          height: 43,
          position: "absolute",
          left: 648,
          top: 250
        }}
      ></div>
      <div
        name="Rectangle 41"
        style={{
          backgroundColor: "#FFF",
          borderRadius: 5,
          width: 100,
          height: 43,
          position: "absolute",
          left: 521,
          top: 390
        }}
      ></div>
      <div
        name="Rectangle 43"
        style={{
          backgroundColor: isOn ? "#FF0000" : "#10D20C", // แสดงสีตามสถานะ
          borderRadius: 20,
          width: 126,
          height: 45,
          position: "absolute",
          left: 652,
          top: 479,
          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4))",
          display: "flex", // ให้เนื้อหาใน div นี้เรียงตามแนวแกน
          justifyContent: "center", // จัดเนื้อหาให้อยู่ตรงกลางตามแนวแกนนอน
          alignItems: "center" // จัดเนื้อหาให้อยู่ตรงกลางตามแนวแกนตั้ง
        }}
        onClick={toggleButton} // เรียกใช้ toggleButton เมื่อคลิกที่ปุ่ม
      >
        <span style={{ color: isOn ? "#FFF" : "#000", fontWeight: 600, fontSize: 18 }}>
          {isOn ? "ON" : "OFF"}
        </span>
      </div>
      <div
        name="Rectangle 42"
        style={{
          backgroundColor: "#FFF",
          borderRadius: 5,
          width: 100,
          height: 43,
          position: "absolute",
          left: 811,
          top: 390
        }}
      ></div>
      <div
        name="Rectangle 40"
        style={{
          backgroundColor: "#E9ED42",
          borderRadius: 5,
          width: 128,
          height: 43,
          position: "absolute",
          left: 652,
          top: 569
        }}
      ></div>
      <div
        name="อัตราค่าขยะ"
        style={{
          color: "#242424",
          width: 200,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 25,
          fontWeight: 600,
          position: "absolute",
          left: "44%",
          transform: "translateX(3.5px)",
          top: 198
        }}
      >
        อัตราค่าขยะ
      </div>
      <div
        name="บาท"
        style={{
          color: "#242424",
          width: 133,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 20,
          fontWeight: 600,
          position: "absolute",
          left: "50%",
          transform: "translateX(140.5px)",
          top: 258
        }}
      >
        บาท
      </div>
      <input
        name="number"
        type="number"
        style={{
          color: "#242424",
          width: 60,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 20,
          fontWeight: 600,
          position: "absolute",
          left: "49%",
          transform: "translateX(-50%)", // ปรับตำแหน่งให้อยู่ตรงกลาง
          top: 258,
          border: "none", // ลบเส้นขอบ
          outline: "none", // ลบเส้นขอบเมื่อกด
          textAlign: "center", // จัดข้อความให้อยู่ตรงกลาง
          background: "transparent", // ลบพื้นหลัง
        }}
        defaultValue={0} // กำหนดค่าเริ่มต้นของ input
        onChange={(e) => console.log(e.target.value)} // ใส่การจัดการเมื่อมีการเปลี่ยนแปลงค่า
      />

      <select
        name="day"
        style={{
          backgroundColor: "#FFFFFF",
          color: "#242424",
          width: 60, // ปรับความกว้างตามที่ต้องการ
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 20,
          fontWeight: 600,
          position: "absolute",
          left: "39%",
          transform: "translateX(-30px)", // ปรับตำแหน่งให้อยู่ตรงกลาง
          top: 398,
          border: "none", // ลบเส้นขอบ
          outline: "none", // ลบเส้นขอบเมื่อกด
          background: "transparent" // ลบพื้นหลัง
        }}
      >
        {[...Array(31).keys()].map(day => (
          <option key={day + 1} value={day + 1}>{day + 1}</option>
        ))}
      </select>
      <select
        name="month"
        style={{
          color: "#242424",
          width: 100, // ปรับความกว้างตามที่ต้องการ
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 20,
          fontWeight: 600,
          position: "absolute",
          left: "49%",
          transform: "translateX(-50px)", // ปรับตำแหน่งให้อยู่ตรงกลาง
          top: 398,
          border: "none", // ลบเส้นขอบ
          outline: "none", // ลบเส้นขอบเมื่อกด
          background: "transparent" // ลบพื้นหลัง
        }}
      >
        <option value="เดือน">เดือน</option>
        <option value="มกราคม">มกราคม</option>
        <option value="กุมภาพันธ์">กุมภาพันธ์</option>
        <option value="มีนาคม">มีนาคม</option>
        <option value="เมษายน">เมษายน</option>
        <option value="พฤษภาคม">พฤษภาคม</option>
        <option value="มิถุนายน">มิถุนายน</option>
        <option value="กรกฎาคม">กรกฎาคม</option>
        <option value="สิงหาคม">สิงหาคม</option>
        <option value="กันยายน">กันยายน</option>
        <option value="ตุลาคม">ตุลาคม</option>
        <option value="พฤศจิกายน">พฤศจิกายน</option>
        <option value="ธันวาคม">ธันวาคม</option>
      </select>

      <select
        name="year"
        style={{
          color: "#242424",
          width: 81,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 20,
          fontWeight: 600,
          position: "absolute",
          left: "47.2%",
          transform: "translateX(150.5px)",
          top: 398,
          border: "none", // ลบเส้นขอบ
          outline: "none", // ลบเส้นขอบเมื่อกด
          appearance: "none", // ซ่อนการแสดงของเส้นขอบทั้งหมด
          background: "transparent" // ลบพื้นหลัง
        }}
      >
        {[...Array(50).keys()].map(year => (
          <option key={year + 2023} value={year + 2023}>{year + 2023}</option>
        ))}
      </select>

      <div
        name="บันทึก"
        style={{
          color: "#fff",
          width: 61,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 22,
          fontWeight: 600,
          position: "absolute",
          left: "47.05%",
          transform: "translateX(-1.5px)",
          top: 576
        }}
      >
        บันทึก
      </div>
      <div
        name="ON"
        style={{
          color: "#FFF",
          width: 39,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 22,
          fontWeight: 600,
          position: "absolute",
          left: "49%",
          transform: "translateX(-17.5px)",
          top: 488,
          backgroundColor: isOn ? "#10D20C" : "#FF0000", // แสดงสีตามสถานะ
          cursor: "pointer" // เพิ่ม cursor เป็น pointer เมื่อนำเมาส์มาชี้
        }}
        onClick={toggleButton} // เรียกใช้ toggleButton เมื่อคลิกที่ปุ่ม
      >
        {isOn ? "ON" : "OFF"} {/* เปลี่ยนข้อความเมื่อเป็น off */}
      </div>
      <div
        name="วัน/เดือน/ปี"
        style={{
          color: "#242424",
          width: 133,
          height: 26,
          fontFamily: "Kumbh Sans",
          fontSize: 25,
          fontWeight: 600,
          position: "absolute",
          left: "46%",
          transform: "translateX(-4.5px)",
          top: 338
        }}
      >
        วัน/เดือน/ปี
      </div>
      <svg
        name="Ellipse 1"
        x={738}
        y={485}
        width={33}
        height={33}
      >
      </svg>
    </div>
  );
}

export default Addgarbage;
