import { Select, Space, Table } from "antd";
import "./BinAdminPage.css";
import { useState } from "react";

const BinAdminPage = () => {
  const [selectDataColumns, setSelectDataColumns] = useState();
  return (
    <div className="container-binAdmin">
      <div className="header-binAdmin">
        <h1>ถังขยะ</h1>
      </div>

      <div className="navbarBin">
        <button>การจอง</button>
        <Select placeholder="สินค้า" className="select-language"></Select>
      </div>

      <div className="bin-content-teble"></div>
    </div>
  );
};

export default BinAdminPage;
