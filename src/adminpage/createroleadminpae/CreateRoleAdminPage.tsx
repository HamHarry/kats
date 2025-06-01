import { useNavigate } from "react-router-dom";
import { RoleData } from "../../data/permissions";
import { Controller, useForm } from "react-hook-form";
import { Modal, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import CircleLoading from "../../shared/circleLoading";
import "./CreateRoleAdminPage.css";
import { useAppDispatch } from "../../stores/store";
import {
  createRole,
  getAllRoles,
  isDeleteRoleById,
} from "../../stores/slices/roleSlice";
import { DeleteStatus } from "../../model/delete.type";

const initRoleForm: RoleData = {
  name: "",
  type: "",
  permissions: [],
  delete: DeleteStatus.ISNOTDELETE,
};

const CreateRoleAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);

  const [roleDatas, setRoleDatas] = useState<RoleData[]>([]);
  const [selectRole, setSelectRole] = useState<RoleData>();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initRoleForm,
  });

  const fetchRoles = useCallback(async () => {
    try {
      setIsRoleLoading(true);

      const { data: roleRes = [] } = await dispath(getAllRoles()).unwrap();

      const filteredRoles = roleRes.filter((item: RoleData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setRoleDatas(filteredRoles);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRoleLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const deleted = async () => {
    try {
      setIsRoleLoading(true);
      if (!selectRole?._id) return;

      const body: RoleData = {
        ...selectRole,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteRoleById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRoleLoading(false);
      setOpenDialogConfirmDelete(false);
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
    { title: "ชื่อ", dataIndex: "name", key: "name" },
    {
      title: "ตำแหน่ง",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "",
      key: "action",
      render: (item: RoleData) => (
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
              setSelectRole(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const onSubmit = async (value: RoleData) => {
    try {
      const item = {
        ...value,
      };

      await dispath(createRole(item)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      fetchRoles();
      reset(initRoleForm);
    }
  };

  return (
    <div className="container-Role">
      <div className="header-Role">
        <h1>สร้างบทบาท</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createroleAdmin">
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

        <div className="wrap-container-createRole">
          <div className="inputNameRole">
            <div
              style={{
                width: "200px",
              }}
            >
              <h2>ชื่อ</h2>
            </div>

            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputCodeRole">
            <div
              style={{
                width: "200px",
              }}
            >
              <h2>ตำแหน่ง</h2>
            </div>

            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="Role-content" style={{ width: "100%" }}>
            <Table
              dataSource={roleDatas}
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
      <CircleLoading open={isRoleLoading} />
    </div>
  );
};

export default CreateRoleAdminPage;
