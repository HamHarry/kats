import "./SettingAdminPage.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const SettingAdminPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  return (
    <div className="container-SettingAdminPage">
      <div className="header-SettingAdminPage">
        <h1>{t("ตั้งค่า")}</h1>
      </div>

      <div className="wrap-container-SettingAdminPage-content">
        <div className="SettingAdminPage-content-company">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70px",
              width: "70px",
              border: "2px solid #2656a2",
              borderRadius: "20px",
            }}
          >
            <i className="fa-solid fa-building"></i>
          </div>

          <div
            className="content-company"
            style={{
              cursor: "pointer",
            }}
          >
            <h2>{t("บริษัท")}</h2>

            <p>{t("ระบุข้อมูลบริษัท")}</p>
          </div>
        </div>

        <div className="SettingAdminPage-content-users">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70px",
              width: "70px",
              border: "2px solid #2656a2",
              borderRadius: "20px",
            }}
          >
            <i className="fa-solid fa-user-tie"></i>
          </div>

          <div
            className="content-company"
            style={{
              cursor: "pointer",
            }}
            // onClick={() => {
            //   navigate("/admin/");
            // }}
          >
            <h2>{t("บทบาท")}</h2>

            <p>{t("ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน")}</p>
          </div>
        </div>

        <div className="SettingAdminPage-content-permission">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70px",
              width: "70px",
              border: "2px solid #2656a2",
              borderRadius: "20px",
            }}
          >
            <i className="fa-solid fa-user-shield"></i>
          </div>

          <div
            className="content-permission"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/admin/setting/permission");
            }}
          >
            <h2>{t("กำหนดสิทธิ์การใช้งาน")}</h2>

            <p>{t("ตั้งค่าสิทธิ์การใช้งาน")}</p>
          </div>
        </div>

        <div className="SettingAdminPage-content-brand">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70px",
              width: "70px",
              border: "2px solid #2656a2",
              borderRadius: "20px",
            }}
          >
            <i className="fa-solid fa-bookmark"></i>
          </div>

          <div
            className="content-company"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/admin/setting/createTypeProduct");
            }}
          >
            <h2>{t("แบรนด์สินค้า")}</h2>

            <p>{t("ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลแบรนด์สินค้า")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingAdminPage;
