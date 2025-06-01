import { useNavigate } from "react-router-dom";
import "./CreateTypeProductPage.css";
import { TypeProductData } from "../../model/product.type";
import { Controller, useForm } from "react-hook-form";
import { DeleteStatus } from "../../model/delete.type";
import { Modal, Space, Table } from "antd";
import { useAppDispatch } from "../../stores/store";
import {
  createTypeProduct,
  getAllTypeProduct,
  isDeleteTypeProductById,
} from "../../stores/slices/productSlice";
import { useCallback, useEffect, useState } from "react";
import CircleLoading from "../../shared/circleLoading";

const initCatagoryForm: TypeProductData = {
  name: "",
  code: "",
  delete: DeleteStatus.ISNOTDELETE,
};

const CreateTypeProductPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [isTypeProductLoading, setIsTypeProductLoading] =
    useState<boolean>(false);
  const [typeProducts, setTypeProducts] = useState<TypeProductData[]>([]);
  const [selectedTypeProductData, setSelectedTypeProductData] =
    useState<TypeProductData>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);

  const fetchAllTypeProduct = useCallback(async () => {
    try {
      setIsTypeProductLoading(true);
      const { data: typeProductRes = [] } = await dispath(
        getAllTypeProduct()
      ).unwrap();

      const filteredTypeProducts = typeProductRes.filter(
        (item: TypeProductData) => {
          return item.delete === DeleteStatus.ISNOTDELETE;
        }
      );

      setTypeProducts(filteredTypeProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTypeProductLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllTypeProduct();
  }, [fetchAllTypeProduct]);

  const deleted = async () => {
    try {
      setIsTypeProductLoading(true);
      if (!selectedTypeProductData?._id) return;

      const body: TypeProductData = {
        ...selectedTypeProductData,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteTypeProductById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsTypeProductLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllTypeProduct();
    }
  };

  const rederDialogConfirmDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deleted();
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const columns = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "รหัสสินค้า", dataIndex: "code", key: "code" },
    {
      title: "",
      key: "action",
      render: (item: TypeProductData) => (
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
              setSelectedTypeProductData(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initCatagoryForm,
  });

  const onSubmit = async (value: TypeProductData) => {
    try {
      const item = {
        ...value,
      };

      await dispath(createTypeProduct(item)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      fetchAllTypeProduct();
      reset(initCatagoryForm);
    }
  };

  return (
    <div className="container-TypeProduct">
      <div className="header-TypeProduct">
        <h1>สร้างแบรนด์สินค้า</h1>
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
          <button type="submit">เพิ่ม</button>
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

          <div className="typeProduct-content" style={{ width: "100%" }}>
            <Table
              dataSource={typeProducts}
              columns={columns}
              style={{
                border: "2px solid #2656a2",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </form>

      {rederDialogConfirmDelete()}
      <CircleLoading open={isTypeProductLoading} />
    </div>
  );
};

export default CreateTypeProductPage;
