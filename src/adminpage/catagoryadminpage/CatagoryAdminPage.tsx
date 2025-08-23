import { useNavigate } from "react-router-dom";
import "./CatagoryAdminPage.css";
import { Modal, Space, Table } from "antd";
import { useAppDispatch } from "../../stores/store";
import { CatagoryData } from "../../model/product.type";
import { useCallback, useEffect, useState } from "react";
import {
  getAllCatagories,
  isDeleteCatagoryById,
} from "../../stores/slices/productSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";
const CatagoryAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [catagorys, setCatagorys] = useState<CatagoryData[]>([]);
  const [isCatagoryLoading, setIsCatagoryLoading] = useState<boolean>(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [selectedCatagoryData, setSelectedCatagoryData] =
    useState<CatagoryData>();

  const fetchAllCatagory = useCallback(async () => {
    try {
      setIsCatagoryLoading(true);
      const { data: catagorysRes = [] } = await dispath(
        getAllCatagories()
      ).unwrap();

      const filteredCatagorys = catagorysRes.filter((item: CatagoryData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setCatagorys(filteredCatagorys);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCatagoryLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllCatagory();
  }, [fetchAllCatagory]);

  const deleted = async () => {
    try {
      setIsCatagoryLoading(true);
      if (!selectedCatagoryData?._id) return;

      const body: CatagoryData = {
        ...selectedCatagoryData,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteCatagoryById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCatagoryLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllCatagory();
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
    { title: "หมวดหมู่สินค้า", dataIndex: "name", key: "name" },
    {
      title: "รหัสหมวดหมู่สินค้า",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "",
      key: "action",
      render: (item: CatagoryData) => (
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
              setSelectedCatagoryData(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
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
          pagination={{
            pageSize: 8,
          }}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/admin/catagory/edit/Catagory/${record._id}`);
              },
            };
          }}
        />
      </div>

      {rederDialogConfirmDelete()}
      <CircleLoading open={isCatagoryLoading} />
    </div>
  );
};

export default CatagoryAdminPage;
