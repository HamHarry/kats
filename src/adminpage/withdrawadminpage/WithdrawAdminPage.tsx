import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Table } from "antd";
import { useState } from "react";

const WithdrawAdminPage = () => {
  // const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState([]);
  const [selectedCreate, setSelectedCreate] = useState<boolean>(false);

  const columns = [
    { title: "เลขที่", dataIndex: "name", key: "name" },
    { title: "ผู้สร้างเอกสาร", dataIndex: "name", key: "name" },
    { title: "หัวข้อ", dataIndex: "name", key: "name" },
    { title: "หมวดหมู่", dataIndex: "name", key: "name" },
    { title: "วันที่สร้าง", dataIndex: "name", key: "name" },
    { title: "วันที่ชำระเงิน", dataIndex: "name", key: "name" },
    { title: "รวมยอดค่าใช้จ่าย", dataIndex: "name", key: "name" },
  ];

  const SelectedCreate = () => {
    return (
      <div
        className={`dropdown-Create ${selectedCreate ? "active" : "inactive"}`}
      >
        <button className="btn-Create" onClick={() => {}}>
          สร้างค่าใช้จ่าย
        </button>
        <button className="btn-Create" onClick={() => {}}>
          เบิกเงินเดือน
        </button>
      </div>
    );
  };

  return (
    <div className="container-WithdrawAdminPage">
      <div className="header-WithdrawAdminPage">
        <h1>Withdraws</h1>
      </div>

      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <button
            onClick={() => {
              setSelectedCreate(!selectedCreate);
            }}
          >
            สร้าง
          </button>
          {SelectedCreate()}
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
