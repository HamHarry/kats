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
        <h1>{dayName} {timeStr} น.</h1>
      </div>

      <div className="wrap-container-dashBoradAdminPage"></div>
      <CircleLoading open={isDashBoardLoading} />
    </div>
  );
};

export default DashBoardPage;
