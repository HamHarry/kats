import { useNavigate } from "react-router-dom";
import "./NavbarFinance.css";

const NavbarFinance = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar-dashboard-finance">
      <div className="grid-dashboard">
        <div
          className="wrap-grid-revenues"
          onClick={() => {
            return navigate("/admin/finance");
          }}
        >
          สรุปค่าใช้จ่ายทั้งหมด
        </div>
      </div>

      <div className="grid-dashboard">
        <div className="wrap-grid-revenues">รายรับทั้งหมด</div>
      </div>

      <div className="grid-dashboard">
        <div className="wrap-grid-expenses">รายจ่ายทั้งหมด</div>
      </div>
    </div>
  );
};

export default NavbarFinance;
