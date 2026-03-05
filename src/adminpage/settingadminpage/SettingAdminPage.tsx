import "./SettingAdminPage.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const settingItems = [
  {
    icon: "fa-solid fa-building",
    titleKey: "บริษัท",
    descKey: "ระบุข้อมูลบริษัท",
    path: null,
  },
  {
    icon: "fa-solid fa-user-tie",
    titleKey: "บทบาท",
    descKey: "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน",
    path: "/admin/setting/role",
  },
  {
    icon: "fa-solid fa-user-shield",
    titleKey: "กำหนดสิทธิ์การใช้งาน",
    descKey: "ตั้งค่าสิทธิ์การใช้งาน",
    path: "/admin/setting/permission",
  },
  {
    icon: "fa-solid fa-bookmark",
    titleKey: "แบรนด์สินค้า",
    descKey: "ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลแบรนด์สินค้า",
    path: "/admin/setting/createTypeProduct",
  },
  {
    icon: "fa-solid fa-list-ol",
    titleKey: "เลขที่เอกสาร",
    descKey: "ตั้งค่าเลขที่เอกสาร",
    path: "/admin/setting/document-count",
  },
];

const SettingAdminPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  return (
    <div className="container-SettingAdminPage">
      {/* ── Header ── */}
      <div className="header-SettingAdminPage">
        <h1>{t("ตั้งค่า")}</h1>
      </div>

      {/* ── Setting Cards Grid ── */}
      <div className="wrap-container-SettingAdminPage-content">
        {settingItems.map((item, index) => (
          <div
            key={index}
            className="setting-card"
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: item.path ? "pointer" : "default" }}
          >
            <div className="setting-card-icon">
              <i className={item.icon} />
            </div>
            <div className="setting-card-text">
              <h2>{t(item.titleKey)}</h2>
              <p>{t(item.descKey)}</p>
            </div>
            {item.path && (
              <i className="fa-solid fa-chevron-right setting-card-arrow" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingAdminPage;
