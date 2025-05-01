import { Dropdown, Space } from "antd";
import "./SettingAdminPage.css";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const SettingAdminPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const items = [
    {
      label: "ภาษาไทย",
      key: "th",
    },
    {
      label: "English",
      key: "en",
    },
  ];

  const handleMenuClick = (item: any) => {
    if (!item) return;

    if (item.key === "th") {
      return (window.location.href = "/admin/setting/" + "th");
    } else {
      return (window.location.href = "/admin/setting/" + "en");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

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

          <Dropdown menu={menuProps} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space
                style={{
                  border: "2px solid #2656a2",
                  borderRadius: "10px",
                  padding: "5px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                เลือกภาษา
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
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
            <h2>บริษัท</h2>

            <p>ระบุข้อมูลบริษัท</p>
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
            <h2>ตำแหน่ง</h2>

            <p>ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลตำแหน่ง</p>
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
            <h2>ธนาคาร</h2>

            <p>ตั้งค่า เพิ่ม-ลด และกำหนดข้อมูลธนาคาร</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingAdminPage;
