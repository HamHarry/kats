import { useNavigate } from "react-router-dom";
import "./CategoryAdminPage.css";
import { Table } from "antd";
import { useAppDispatch } from "../../stores/store";
import { Category } from "../../model/product.type";
import { useCallback, useEffect, useState } from "react";
import { getAllCatagories } from "../../stores/slices/productSlice";
const CategoryAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [categorys, setCategorys] = useState<Category[]>([]);

  const fetchAllCategory = useCallback(async () => {
    try {
      const { data: categorysRes = [] } = await dispath(
        getAllCatagories()
      ).unwrap();

      setCategorys(categorysRes);
    } catch (error) {
      console.log(error);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  const columns = [
    { title: "หมวดหมู่สินค้า", dataIndex: "name", key: "name" },
    {
      title: "รหัสหมวดหมู่สินค้า",
      dataIndex: "code",
      key: "code",
    },
  ];

  return (
    <div className="container-categoryAdmin">
      <div className="header-categoryAdmin">
        <h1>Categorys</h1>
      </div>

      <div className="create-category">
        <div className="btn-create-category">
          <button
            onClick={() => {
              navigate("/admin/product");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            onClick={() => {
              navigate("/admin/category");
            }}
          >
            สร้างหมวดหมู่สินค้า
          </button>
        </div>
      </div>

      <div className="product-content" style={{ width: "100%" }}>
        <Table
          dataSource={categorys}
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

export default CategoryAdminPage;
