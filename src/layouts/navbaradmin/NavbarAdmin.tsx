import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./NavbarAdmin.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { employeeDataSelector, logOut, userInfoSelector } from "../../stores/slices/authSlice";
import { getImagePath } from "../../shared/utils/common";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const employeeData = useSelector(employeeDataSelector);
  const userInfo = useSelector(userInfoSelector);

  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  return (
    <div className="navbarAdmin">
      <div className="logo-admin">
        <img src={"/assets/logokats.jpg"} alt="logo" />
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
              src={getImagePath("profile", userInfo?.dbname, employeeData?.image)}
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
            <h3>{employeeData?.employmentInfo.role.type}</h3>
            <p>{employeeData?.employmentInfo.role.name}</p>
          </div>
        </div>

        <div className="content-right">
          <img src="/assets/TH.jpg" alt="" />
        </div>
      </div>

      <hr />

      <div className="menu">
        <ul>
          <li
            className={location.pathname.includes("employee") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/employee");
            }}
          >
            <i className="fa-solid fa-image-portrait"></i>
            <p>{t("ข้อมูลพนักงาน")}</p>
          </li>
          <li
            className={location.pathname.includes("booking") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/booking");
            }}
          >
            <i className="fa-solid fa-book-bookmark"></i>
            <p>{t("จองคิว")}</p>
          </li>
          <li
            className={location.pathname.includes("calendar") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/calendar");
            }}
          >
            <i className="fa-solid fa-calendar-days"></i>
            <p>{t("ปฏิทินการจอง")}</p>
          </li>
          <li
            className={location.pathname.includes("guarantee") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/guarantee");
            }}
          >
            <i className="fa-solid fa-square-check"></i>
            <p>{t("ข้อมูลรับประกัน")}</p>
          </li>
          <li
            className={location.pathname.includes("product") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/product");
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <p>{t("สินค้า")}</p>
          </li>
          <li
            className={location.pathname.includes("withdraw") ? "selected" : "select"}
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
          </li>
          <li
            className={location.pathname.includes('finace') ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/finance");
            }}
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <p>{t("การเงิน")}</p>
          </li> */}
          <li
            className={location.pathname.includes("bin") ? "selected" : "select"}
            onClick={() => {
              navigate("/admin/bin");
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
            <p>{t("คืนค่าข้อมูล")}</p>
          </li>
          <li
            className={location.pathname.includes("setting") ? "selected" : "select"}
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
          // navigate("/");
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <p>{t("ออกจากระบบ")}</p>
        <div className="version">
          <p>v.1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
