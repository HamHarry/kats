import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  th: {
    translation: {
      ตั้งค่า: "ตั้งค่า",
      // navbar
      ข้อมูลพนักงาน: "ข้อมูลพนักงาน",
      จองคิว: "จองคิว",
      ปฏิทินการจอง: "ปฏิทินการจอง",
      ข้อมูลรับประกัน: "ข้อมูลรับประกัน",
      สินค้า: "สินค้า",
      "ค่าใช้จ่าย & เบิกเงิน": "ค่าใช้จ่าย & เบิกเงิน",
      เงินเดือน: "เงินเดือน",
      การเงิน: "การเงิน",
      คืนค่าข้อมูล: "คืนค่าข้อมูล",
      ออกจากระบบ: "ออกจากระบบ",
      // -----------------------------------------------------
    },
  },
  en: {
    translation: {
      ตั้งค่า: "Settings",
      // navbar
      ข้อมูลพนักงาน: "Employees",
      จองคิว: "Bookings",
      ปฏิทินการจอง: "Calendar",
      ข้อมูลรับประกัน: "Guarantees",
      สินค้า: "Products",
      "ค่าใช้จ่าย & เบิกเงิน": "Withdraw & Salary Advance",
      เงินเดือน: "Salary",
      การเงิน: "Finance",
      คืนค่าข้อมูล: "Bin",
      ออกจากระบบ: "LogOut",
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
