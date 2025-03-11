import { useNavigate } from "react-router-dom";
import "./NavbarAdmin.css";
import { useState } from "react";
const NavbarAdmin = () => {
  const [selected, setSelected] = useState("user");
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
            className={selected === "user" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin");
              setSelected("user");
            }}
          >
            <i className="fa-solid fa-user"></i>
            <p>ข้อมูล Users</p>
          </li>
          <li
            className={selected === "employee" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/employee");
              setSelected("employee");
            }}
          >
            <i className="fa-solid fa-image-portrait"></i>
            <p>ข้อมูล Employees</p>
          </li>
          <li
            className={selected === "booking" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/booking");
              setSelected("booking");
            }}
          >
            <i className="fa-solid fa-book-bookmark"></i>
            <p>จองคิว</p>
          </li>
          <li
            className={selected === "calendar" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/calendar");
              setSelected("calendar");
            }}
          >
            <i className="fa-solid fa-calendar-days"></i>
            <p>ปฏิทินการจอง</p>
          </li>
          <li
            className={selected === "guarantee" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/guarantee");
              setSelected("guarantee");
            }}
          >
            <i className="fa-solid fa-square-check"></i>
            <p>ข้อมูลรับประกัน</p>
          </li>
          <li
            className={selected === "product" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/product");
              setSelected("product");
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <p>สินค้า</p>
          </li>
          <li
            className={selected === "finace" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/finance");
              setSelected("finace");
            }}
          >
            <i className="fa-solid fa-wallet"></i>
            <p>การเงิน</p>
          </li>
          <li
            className={selected === "bin" ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/bin");
              setSelected("bin");
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
          navigate("/kats");
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <p>ออกจากระบบ</p>
      </div>
    </div>
  );
};

export default NavbarAdmin;
