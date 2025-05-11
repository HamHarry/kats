import { Select } from "antd";
import "./SettingAdminPage.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import i18next from "i18next";

const SettingAdminPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const languageOptions = [
    {
      label: "ภาษาไทย",
      key: "th",
    },
    {
      label: "English",
      key: "en",
    },
  ];

  console.log(i18next.language.toString());

  const handleMenuClick = (item: any) => {
    if (!item) return;

    if (item.key === "th") {
      return (window.location.href = "/admin/setting/" + "th");
    } else {
      return (window.location.href = "/admin/setting/" + "en");
    }
  };

  // const menuProps: MenuProps = {
  //   items: languageOptions,
  //   onClick: handleMenuClick,
  //   defaultValue: "th",
  // };

  return (
    <div className="container-SettingAdminPage">
      <div className="header-SettingAdminPage">
        <h1>{t("ตั้งค่า")}</h1>
      </div>

      <div className="wrap-container-SettingAdminPage-content">
        <div className="SettingAdminPage-content-translate">
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
            <i className="fa-solid fa-globe"></i>
          </div>

          <Select
            placeholder="เลือกพนักงาน"
            className="select-employee"
            defaultValue={"th"}
          >
            {languageOptions.map((item) => (
              <Select.Option key={item.key} value={item.key}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </div>

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
          >
            <h2>{t("ตำแหน่งพนักงาน")}</h2>

            <p>{t("ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่งพนักงาน")}</p>
          </div>
        </div>

        <div className="SettingAdminPage-content-banks">
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
            <i className="fa-solid fa-building-columns"></i>
          </div>

          <div
            className="content-company"
            style={{
              cursor: "pointer",
            }}
          >
            <h2>{t("ธนาคาร")}</h2>

            <p>{t("ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลธนาคาร")}</p>
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
