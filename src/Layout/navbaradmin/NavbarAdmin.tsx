import { useNavigate } from "react-router-dom";
import "./NavbarAdmin.css";
const NavbarAdmin = () => {
  const navigate = useNavigate();
  return (
    <div className="navbarAdmin">
      <div className="logo-admin">
        <img src="/public/assets/logokats.jpg" alt="logo" />
      </div>
      <hr />
      <div className="user">
        <i className="fa-regular fa-circle-user"></i>
        <div className="username">
          <h3>Admin</h3>
          <p>ผู้ดูแล</p>
        </div>
      </div>
      <hr />
      <div className="menu">
        <ul>
          <li
            onClick={() => {
              navigate("/admin");
            }}
          >
            <i className="fa-solid fa-image-portrait"></i>
            <p>ข้อมูล Employees</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/booking");
            }}
          >
            <i className="fa-solid fa-book-bookmark"></i>
            <p>จองคิว</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/calendar");
            }}
          >
            <i className="fa-solid fa-calendar-days"></i>
            <p>ปฏิทินการจอง</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/guarantee");
            }}
          >
            <i className="fa-solid fa-square-check"></i>
            <p>ข้อมูลรับประกัน</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/product");
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <p>สินค้า</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/finance");
            }}
          >
            <i className="fa-solid fa-wallet"></i>
            <p>การเงิน</p>
          </li>
          <li
            onClick={() => {
              navigate("/admin/bin");
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
            <p>คืนค่าข้อมูล</p>
          </li>
        </ul>
      </div>
      <hr />
      <div
        className="logout"
        onClick={() => {
          navigate("/");
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <p>ออกจากระบบ</p>
      </div>
    </div>
  );
};

export default NavbarAdmin;
