import { DatePicker } from "antd";
import "./FinanceAdminPage.css";
const FinanceAdminPage = () => {
  return (
    <div className="container-finance">
      <div className="navbarSelectDay">
        <DatePicker placeholder="วันที่เริ่มต้น" />
        <DatePicker placeholder="วันที่สิ้นสุด" />

        <button>ค้นหา</button>
      </div>

      <div className="container-finance-content">
        <div className="top-container-finance"></div>

        <div className="bottom-container-finance">
          <div className="bottom-container-finance-left"></div>

          <div className="bottom-container-finance-right"></div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAdminPage;
