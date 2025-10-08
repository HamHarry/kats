import { useEffect, useState } from "react";
import CircleLoading from "../../shared/circleLoading";
import "./DashBoardPage.css";

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
const thaiDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

const DashBoardPage = () => {
  const [isDashBoardLoading, setIsDashBoardLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dayName = thaiDays[currentTime.getDay()];
  const date = currentTime.getDate();
  const month = thaiMonths[currentTime.getMonth()];
  const year = currentTime.getFullYear() + 543;

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // อัปเดตทุก 1 วินาที

    return () => {
      clearInterval(timerId); // ล้าง interval เมื่อคอมโพเนนต์ถูก unmount
    };
  }, []);

  const timeStr = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="container-dashBoradAdminPage">
      <div className="header-dashBoradAdminPage">
        <h1>
          วันที่ {date} เดือน{month} พ.ศ. {year}
        </h1>
        <h1>
          {dayName} {timeStr} น.
        </h1>
      </div>

      <div className="wrap-container-dashBoradAdminPage">
        <div className="navbar-dashboard">
          <div className="grid-dashboard">
            <h2>คันต่อไปที่จะดำเนินการ</h2>

            <div className="wrap-grid-showBooking">
              <div className="grid-showBooking-left">
                <img src="/assets/LOGOWEB.jpg" alt="logo" />
              </div>

              <div className="grid-showBooking-right">
                <p>วันที่: 08/10/2025</p>
                <p>เวลา: 12:00</p>
                <p>ชื่อ: คุณ ณัฐวุติ</p>
                <p>รถ: Toyota Fortuner</p>
                <p>สินค้า: GUN Premium 4900 บาท</p>
              </div>
            </div>
          </div>

          <div className="grid-dashboard">
            <h2>สรุปยอดจองต่อเดือน</h2>

            <div className="wrap-grid-totalBooking">
              <div className="grid-totalBooking-left">
                <div className="box">
                  <h2>10</h2>
                </div>
              </div>

              <div className="grid-totalBooking-right">
                <p>เสร็จแล้ว</p>
                <h2 style={{ color: "#4AFF88" }}>7</h2>
                <p>กำลังดำเนินการ</p>
                <h2 style={{ color: "#FBFB00" }}>3</h2>
              </div>
            </div>
          </div>

          <div className="grid-dashboard">
            <h2>ข้อมูล รายรับ/รายจ่าย ทั้งหมด</h2>

            <div className="wrap-grid-financial">
              <div className="grid-financial-top">
                <div className="grid-financial-left">
                  <p>รายรับ</p>
                  <h2>20,000 บาท</h2>
                </div>

                <div className="grid-financial-right">
                  <p>รายจ่าย</p>
                  <h2>10,000 บาท</h2>
                </div>
              </div>

              <div className="grid-financial-bottom">
                <h1>10,000 บาท</h1>
              </div>
            </div>
          </div>

          <div className="grid-dashboard">
            <h2>ข้อมูล ลา/ขาด พนักงาน</h2>

            <div className="wrap-grid-employee">
              <div className="grid-employee-left">
                <p>ลางาน</p>

                <div className="tap-employee">
                  <h2>0</h2>
                </div>
              </div>

              <div className="grid-employee-right">
                <p>ขาดงาน</p>

                <div className="tap-employee">
                  <h2>0</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-dashboard"></div>
      </div>
      <CircleLoading open={isDashBoardLoading} />
    </div>
  );
};

export default DashBoardPage;
