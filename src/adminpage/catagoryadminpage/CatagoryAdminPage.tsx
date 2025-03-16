import { useNavigate } from "react-router-dom";
import "./CatagoryAdminPage.css";
import { Table } from "antd";
import { useAppDispatch } from "../../stores/store";
import { Catagory } from "../../model/product.type";
import { useCallback, useEffect, useState } from "react";
import { getAllCatagories } from "../../stores/slices/productSlice";
const CatagoryAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [catagorys, setCatagorys] = useState<Catagory[]>([]);

  const fetchAllCatagory = useCallback(async () => {
    try {
      const { data: catagorysRes = [] } = await dispath(
        getAllCatagories()
      ).unwrap();

      setCatagorys(catagorysRes);
    } catch (error) {
      console.log(error);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllCatagory();
  }, [fetchAllCatagory]);

  const columns = [
    { title: "หมวดหมู่สินค้า", dataIndex: "name", key: "name" },
    {
      title: "รหัสหมวดหมู่สินค้า",
      dataIndex: "code",
      key: "code",
    },
  ];

  return (
    <div className="container-catagoryAdmin">
      <div className="header-catagoryAdmin">
        <h1>Catagorys</h1>
      </div>

      <div className="create-catagory">
        <div className="btn-create-catagory">
          <button
            onClick={() => {
              navigate("/admin/product");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            onClick={() => {
              navigate("/admin/catagory/createCatagory");
            }}
          >
            สร้างหมวดหมู่สินค้า
          </button>
        </div>
      </div>

      <div className="product-content" style={{ width: "100%" }}>
        <Table
          dataSource={catagorys}
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

export default CatagoryAdminPage;
