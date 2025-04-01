import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Button, Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

const WithdrawAdminPage = () => {
  const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState([]);

  const columns = [
    { title: "เลขที่", dataIndex: "name", key: "name" },
    { title: "ผู้สร้างเอกสาร", dataIndex: "name", key: "name" },
    { title: "หัวข้อ", dataIndex: "name", key: "name" },
    { title: "หมวดหมู่", dataIndex: "name", key: "name" },
    { title: "วันที่สร้าง", dataIndex: "name", key: "name" },
    { title: "วันที่ชำระเงิน", dataIndex: "name", key: "name" },
    { title: "รวมยอดค่าใช้จ่าย", dataIndex: "name", key: "name" },
  ];

  const handleMenuClick = (item: any) => {
    if (!item) return;
    navigate(`/admin/withdraw/${item.key}`);
  };

  const items = [
    {
      label: "สร้างค่าใช้จ่าย",
      key: "createWithdraw",
    },
    {
      label: "เบิกเงินเดือน",
      key: "createSalaryAdvance",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="container-WithdrawAdminPage">
      <div className="header-WithdrawAdminPage">
        <h1>Withdraw & Salary</h1>
      </div>

      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                สร้าง
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="withdraw-content" style={{ width: "100%" }}>
        <Table
          dataSource={withdrawData}
          columns={columns}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default WithdrawAdminPage;
