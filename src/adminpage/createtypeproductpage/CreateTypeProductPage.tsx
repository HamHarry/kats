import { useNavigate } from "react-router-dom";
import "./CreateTypeProductPage.css";
import { CatagoryData } from "../../model/product.type";
import { Controller, useForm } from "react-hook-form";
import { DeleteStatus } from "../../model/delete.type";
import { Space, Table } from "antd";

const initCatagoryForm: CatagoryData = {
  name: "",
  code: "",
  delete: DeleteStatus.ISNOTDELETE,
};
const CreateTypeProductPage = () => {
  const navigate = useNavigate();

  const columns = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "รหัสสินค้า", dataIndex: "name", key: "name" },
    {
      title: "",
      key: "action",
      render: () => (
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const { control, handleSubmit } = useForm({
    defaultValues: initCatagoryForm,
  });

  const onSubmit = (value: CatagoryData) => {
    const item = {
      ...value,
    };
    console.log(item);
  };
  return (
    <div className="container-TypeProduct">
      <div className="header-TypeProduct">
        <h1>Create TypeProduct</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createproductAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/setting");
            }}
          >
            ย้อนกลับ
          </button>
          <button type="submit">ยืนยัน</button>
        </div>

        <div className="wrap-container-createproductTypeProduct">
          <div className="inputNameTypeProduct">
            <div
              style={{
                width: "200px",
              }}
            >
              <h2>ชื่อแบรนด์สินค้า</h2>
            </div>

            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputCodeProduct">
            <div
              style={{
                width: "200px",
              }}
            >
              <h2>Code แบรนด์สินค้า</h2>
            </div>

            <Controller
              control={control}
              name="code"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="product-content" style={{ width: "100%" }}>
            <Table
              dataSource={[]}
              columns={columns}
              style={{
                border: "2px solid #2656a2",
                borderRadius: "10px",
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    // navigate(`/admin/product/edit/Product/${record._id}`);
                  },
                };
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTypeProductPage;
