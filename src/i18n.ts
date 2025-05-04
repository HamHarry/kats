import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  th: {
    translation: {
      // Employee Page
      สร้าง: "สร้าง",
      ตำแหน่ง: "ตำแหน่ง",
      ชื่อ: "ชื่อ",
      โทรศัพท์: "โทรศัพท์",
      // Create Employee Page and Update
      สร้างข้อมูลพนักงาน: "สร้างข้อมูลพนักงาน",
      ชื่อพนักงาน: "ชื่อพนักงาน",
      หัวหน้า: "หัวหน้า",
      ผู้ดูแลระบบ: "ผู้ดูแลระบบ",
      ช่างพ่นกันสนิม: "ช่างพ่นกันสนิม",
      ช่างล้างรถ: "ช่างล้างรถ",
      รูปภาพประจำตัว: "รูปภาพประจำตัว",
      อัพโหลดรูปภาพ: "อัพโหลดรูปภาพ",
      การชำระเงิน: "การชำระเงิน",
      เงินสด: "เงินสด",
      ประเภทการชำระเงิน: "ประเภทการชำระเงิน",
      รายเดือน: "รายเดือน",
      รายวัน: "รายวัน",
      เลขบัญชี: "เลขบัญชี",
      กรอกเลขบัญชี: "กรอกเลขบัญชี",
      บัญชีธนาคาร: "บัญชีธนาคาร",
      จำนวนเงิน: "จำนวนเงิน",
      ตัวอย่างรูปภาพประจำตัว: "ตัวอย่างรูปภาพประจำตัว",

      // Booking Page
      ทั้งหมด: "ทั้งหมด",
      วันที่: "วันที่",
      คุณ: "คุณ",
      เลขที่: "เลขที่",
      เล่มที่: "เล่มที่",
      บาท: "บาท",
      รถ: "รถ",
      ทะเบียน: "ทะเบียน",
      สำเร็จ: "สำเร็จ",
      // Create Booking Page and Update
      สร้างการจอง: "สร้างการจอง",
      เวลา: "เวลา",
      ประเภทรถ: "ประเภทรถ",
      รุ่นรถ: "รุ่นรถ",
      จังหวัด: "จังหวัด",
      ราคา: "ราคา",
      "อัพโหลดภาพสลิปมัดจำ 1,000 บาท": "อัพโหลดภาพสลิปมัดจำ 1,000 บาท",

      // setting Page
      เลือกภาษา: "เลือกภาษา",
      บริษัท: "บริษัท",
      ระบุข้อมูลบริษัท: "ระบุข้อมูลบริษัท",
      ตำแหน่งพนักงาน: "ตำแหน่งพนักงาน",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน":
        "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน",
      ธนาคาร: "ธนาคาร",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลธนาคาร":
        "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลธนาคาร",
      แบรนด์สินค้า: "แบรนด์สินค้า",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลแบรนด์สินค้า":
        "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลแบรนด์สินค้า",

      // navbar admin และ หัวข้อ
      ข้อมูลพนักงาน: "ข้อมูลพนักงาน",
      จองคิว: "จองคิว",
      ปฏิทินการจอง: "ปฏิทินการจอง",
      ข้อมูลรับประกัน: "ข้อมูลรับประกัน",
      สินค้า: "สินค้า",
      "ค่าใช้จ่าย & เบิกเงิน": "ค่าใช้จ่าย & เบิกเงิน",
      เงินเดือน: "เงินเดือน",
      การเงิน: "การเงิน",
      คืนค่าข้อมูล: "คืนค่าข้อมูล",
      ตั้งค่า: "ตั้งค่า",
      ออกจากระบบ: "ออกจากระบบ",

      // rederDialogConfirmDelete
      ยืนยันการลบ: "ยืนยันการลบ",
      ยืนยัน: "ยืนยัน",
      ยกเลิก: "ยกเลิก",

      //rederDialogConfirmApprovePayment
      ยืนยันการชำระสำเร็จ: "ยืนยันการชำระสำเร็จ",

      //rederDialogCancelApprove
      ยืนยันการยกเลิก: "ยืนยันการยกเลิก",

      //rederDialoComfirmBooking
      ยืนยันการจอง: "ยืนยันการจอง",

      // submit
      ย้อนกลับ: "ย้อนกลับ",
      // -----------------------------------------------------
    },
  },
  en: {
    translation: {
      // Employee Page
      สร้าง: "Create",
      ตำแหน่ง: "Position",
      ชื่อ: "Name",
      โทรศัพท์: "Phone",
      // Create Employee Page and Update
      สร้างข้อมูลพนักงาน: "Create Employee",
      ชื่อพนักงาน: "Employee Name",
      หัวหน้า: "Boss",
      ผู้ดูแลระบบ: "Admin",
      ช่างพ่นกันสนิม: "Rust Spray Technician",
      ช่างล้างรถ: "Car Washing Technician",
      รูปภาพประจำตัว: "Profile Picture",
      อัพโหลดรูปภาพ: "Upload Picture",
      การชำระเงิน: "Payment",
      เงินสด: "Cash",
      ประเภทการชำระเงิน: "Payment Type",
      รายเดือน: "Monthly",
      รายวัน: "Daily",
      เลขบัญชี: "Account Number",
      กรอกเลขบัญชี: "Enter Account Number",
      บัญชีธนาคาร: "Bank Account",
      จำนวนเงิน: "Amount",
      ตัวอย่างรูปภาพประจำตัว: "Profile Picture Example",

      // Booking Page
      ทั้งหมด: "All",
      วันที่: "Date",
      คุณ: "K.",
      เลขที่: "Number",
      เล่มที่: "BookNo",
      บาท: "Baht",
      รถ: "Car",
      ทะเบียน: "License plate",
      สำเร็จ: "Complete",
      // Create Booking Page and Update
      สร้างการจอง: "Create Booking",
      เวลา: "Time",
      ประเภทรถ: "CarType",
      รุ่นรถ: "CarModel",
      จังหวัด: "Province",
      ราคา: "Price",
      "อัพโหลดภาพสลิปมัดจำ 1,000 บาท":
        "Upload a picture of the 1,000 baht deposit slip.",

      // setting Page
      เลือกภาษา: "Choose Language",
      บริษัท: "Company",
      ระบุข้อมูลบริษัท: "Specify Details.",
      ตำแหน่งพนักงาน: "Employee position",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน":
        "Set up, add/remove and specify employee position information.",
      ธนาคาร: "Bank",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลธนาคาร":
        "Set up, add/remove and specify bank information.",
      แบรนด์สินค้า: "Brand",
      "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลแบรนด์สินค้า":
        "Set up, add/remove and specify product brand information.",

      // navbar admin และ หัวข้อ
      ข้อมูลพนักงาน: "Employees",
      จองคิว: "Bookings",
      ปฏิทินการจอง: "Calendar",
      ข้อมูลรับประกัน: "Guarantees",
      สินค้า: "Products",
      "ค่าใช้จ่าย & เบิกเงิน": "Withdraw & Salary Advance",
      เงินเดือน: "Salary",
      การเงิน: "Finance",
      คืนค่าข้อมูล: "Bin",
      ตั้งค่า: "Settings",
      ออกจากระบบ: "LogOut",

      // rederDialogConfirmDelete
      ยืนยันการลบ: "Confirm Deletion",
      ยืนยัน: "Confirm",
      ยกเลิก: "Cancel",

      //rederDialogConfirmApprovePayment
      ยืนยันการชำระสำเร็จ: "Confirm Payment",

      //rederDialogCancelApprove
      ยืนยันการยกเลิก: "Confirm Cancellation",

      // submit
      ย้อนกลับ: "Back",
      // -----------------------------------------------------
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "th",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
