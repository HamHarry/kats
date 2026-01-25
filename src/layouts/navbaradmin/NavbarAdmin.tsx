import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./NavbarAdmin.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  employeeDataSelector,
  logOut,
  userInfoSelector,
} from "../../stores/slices/authSlice";
import { getImagePath } from "../../shared/utils/common";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const employeeData = useSelector(employeeDataSelector);
  const userInfo = useSelector(userInfoSelector);

  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="navbarAdmin">
        <div className="logo-admin">
          <img src={"/assets/logoGun.jpg"} alt="logo" />
        </div>

        <hr />

        <div className={location.pathname.includes("user") ? "usered" : "user"}>
          <div className="content-left">
            {getImagePath("profile", userInfo?.dbname, employeeData?.image) ? (
              <img
                onClick={() => {
                  if (employeeData?._id) {
                    navigate(`/admin/user/${employeeData._id}`);
                  }
                }}
                src={getImagePath(
                  "profile",
                  userInfo?.dbname,
                  employeeData?.image,
                )}
                alt="logo"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 20px 0 10px",
                }}
              />
            ) : (
              <i
                className="fa-regular fa-circle-user"
                onClick={() => {
                  if (employeeData?._id) {
                    navigate(`/admin/user/${employeeData._id}`);
                  }
                }}
              ></i>
            )}
            <div className="username">
              <h3>{employeeData?.firstName || ""}</h3>
              <p>
                {employeeData?.employmentInfo?.role?.type || ""} (
                {employeeData?.employmentInfo?.role?.name || ""})
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className="menu">
          <ul>
            <li
              className={
                location.pathname.includes("dashboard") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/dashboard");
              }}
            >
              <i className="fa-brands fa-trello"></i>
              <p>{t("แดชบอร์ด")}</p>
            </li>
            <li
              className={
                location.pathname.includes("employee") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/employee");
              }}
            >
              <i className="fa-solid fa-image-portrait"></i>
              <p>{t("ข้อมูลพนักงาน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("booking") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/booking");
              }}
            >
              <i className="fa-solid fa-book-bookmark"></i>
              <p>{t("จองคิว")}</p>
            </li>
            <li
              className={
                location.pathname.includes("calendar") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/calendar");
              }}
            >
              <i className="fa-solid fa-calendar-days"></i>
              <p>{t("ปฏิทินการจอง")}</p>
            </li>
            <li
              className={
                location.pathname.includes("guarantee") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/guarantee");
              }}
            >
              <i className="fa-solid fa-square-check"></i>
              <p>{t("ข้อมูลรับประกัน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("product") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/product");
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <p>{t("สินค้า")}</p>
            </li>
            <li
              className={
                location.pathname.includes("withdraw") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/withdraw");
              }}
            >
              <i className="fa-solid fa-wallet"></i>
              <p>{t("ค่าใช้จ่าย & เบิกเงิน")}</p>
            </li>
            {/* <li
            className={location.pathname.includes('salary')? "selected" : "select"}
            onClick={() => {
              navigate("/admin/salary");
            }}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <p>{t("เงินเดือน")}</p>
          </li> */}
            <li
              className={
                location.pathname.includes("finace") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/finance");
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <p>{t("การเงิน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("bin") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/bin");
              }}
            >
              <i className="fa-solid fa-trash-can"></i>
              <p>{t("คืนค่าข้อมูล")}</p>
            </li>
            <li
              className={
                location.pathname.includes("setting") ? "selected" : "select"
              }
              onClick={() => {
                navigate(`/admin/setting`);
              }}
            >
              <i className="fa-solid fa-gear"></i>
              <p>{t("ตั้งค่า")}</p>
            </li>
          </ul>
        </div>
        <div
          className="logout"
          onClick={() => {
            dispatch(logOut());
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <p>{t("ออกจากระบบ")}</p>
          <div className="version">
            <p>v.1.1.7</p>
          </div>
        </div>
      </div>

      <Button type="primary" onClick={showDrawer} style={{ marginBottom: 16 }}>
        {open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </Button>

      <Drawer
        title="Menu"
        className="navbar-mobile"
        placement="left"
        width={200}
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <div className={location.pathname.includes("user") ? "usered" : "user"}>
          <div className="content-left">
            {getImagePath("profile", userInfo?.dbname, employeeData?.image) ? (
              <img
                onClick={() => {
                  if (employeeData?._id) {
                    navigate(`/admin/user/${employeeData._id}`);
                    setOpen(false);
                  }
                }}
                src={getImagePath(
                  "profile",
                  userInfo?.dbname,
                  employeeData?.image,
                )}
                alt="logo"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 20px 0 10px",
                }}
              />
            ) : (
              <i
                className="fa-regular fa-circle-user"
                onClick={() => {
                  if (employeeData?._id) {
                    navigate(`/admin/user/${employeeData._id}`);
                    setOpen(false);
                  }
                }}
              ></i>
            )}
            <div className="username">
              <h3>{employeeData?.firstName || ""}</h3>
              <p>
                {employeeData?.employmentInfo?.role?.type || ""} (
                {employeeData?.employmentInfo?.role?.name || ""})
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className="mobile-menu">
          <ul>
            <li
              className={
                location.pathname.includes("dashboard") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/dashboard");
              }}
            >
              <i className="fa-brands fa-trello"></i>
              <p>{t("แดชบอร์ด")}</p>
            </li>
            <li
              className={
                location.pathname.includes("employee") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/employee");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-image-portrait"></i>
              <p>{t("ข้อมูลพนักงาน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("booking") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/booking");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-book-bookmark"></i>
              <p>{t("จองคิว")}</p>
            </li>
            <li
              className={
                location.pathname.includes("calendar") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/calendar");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-calendar-days"></i>
              <p>{t("ปฏิทินการจอง")}</p>
            </li>
            <li
              className={
                location.pathname.includes("guarantee") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/guarantee");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-square-check"></i>
              <p>{t("ข้อมูลรับประกัน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("product") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/product");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <p>{t("สินค้า")}</p>
            </li>
            <li
              className={
                location.pathname.includes("withdraw") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/withdraw");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-wallet"></i>
              <p>{t("ค่าใช้จ่าย & เบิกเงิน")}</p>
            </li>
            {/* <li
              className={
                location.pathname.includes("salary") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/salary");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-hand-holding-dollar"></i>
              <p>{t("เงินเดือน")}</p>
            </li> */}
            <li
              className={
                location.pathname.includes("finace") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/finance");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <p>{t("การเงิน")}</p>
            </li>
            <li
              className={
                location.pathname.includes("bin") ? "selected" : "select"
              }
              onClick={() => {
                navigate("/admin/bin");
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-trash-can"></i>
              <p>{t("คืนค่าข้อมูล")}</p>
            </li>
            <li
              className={
                location.pathname.includes("setting") ? "selected" : "select"
              }
              onClick={() => {
                navigate(`/admin/setting`);
                setOpen(false);
              }}
            >
              <i className="fa-solid fa-gear"></i>
              <p>{t("ตั้งค่า")}</p>
            </li>
          </ul>
        </div>

        <div
          className="logout"
          onClick={() => {
            dispatch(logOut());
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <p>{t("ออกจากระบบ")}</p>
          <div className="version">
            <p>v.1.1.7</p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NavbarAdmin;
