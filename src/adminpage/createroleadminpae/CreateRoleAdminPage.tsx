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
  getRoleById,
  isDeleteRoleById,
  updateRoleById,
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
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState<boolean>(false);

  const [selectedRoleData, setSelectedRoleData] = useState<RoleData>();
  const [openDialogEditRole, setOpenDialogEditRole] = useState<boolean>(false);

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

  const initailForm = useCallback(async () => {
    try {
      if (!selectedRoleData?._id) return;

      const { data } = await dispath(getRoleById(selectedRoleData._id)).unwrap();
      const RoleRes = data as RoleData;

      const initForm: RoleData = {
        name: RoleRes.name ?? "",
        type: RoleRes.type ?? "",
        permissions: RoleRes.permissions ?? [],
        delete: RoleRes.delete ?? DeleteStatus.ISNOTDELETE,
      };

      reset(initForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, reset, selectedRoleData?._id]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const deleted = async () => {
    try {
      setIsRoleLoading(true);
      if (!selectRole?._id) return;

      const body: RoleData = {
        ...selectRole,
        permissions: selectRole.permissions,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteRoleById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRoleLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchRoles();
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

  const renderDialogEditRole = () => {
    return (
      <Modal
        centered
        className="container-DialogEditRole"
        open={openDialogEditRole}
        onCancel={() => setOpenDialogEditRole(false)}
        footer={
          <div className="btn-DialogEditRole-Navbar">
            <button
              type="submit"
              onClick={handleSubmit((value: RoleData) => {
                onSubmit(value); // modal ไม่พาไป Func onSubmit
                setOpenDialogEditRole(false);
              })}
            >
              ยืนยัน
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenDialogEditRole(false);
              }}
            >
              ยกเลิก
            </button>
          </div>
        }
      >
        <div className="container-DialogEditRole-navbar">
          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogEditRole(false);
            }}
          ></i>
        </div>

        <div className="container-DialogEditRole-content">
          <div className="inputNameRole">
            <div
              style={{
                width: "100px",
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
                width: "100px",
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
        </div>
      </Modal>
    );
  };

  const onSubmit = async (value: RoleData) => {
    try {
      // กรณีเช็คการแก้ไข
      if (selectedRoleData && selectedRoleData._id) {
        const body = {
          data: value,
          roleId: selectedRoleData._id,
        };

        await dispath(updateRoleById(body)).unwrap();
      } else {
        await dispath(createRole(value)).unwrap();
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchRoles();
    }
  };

  return (
    <div className="container-Role">
      <div className="header-Role">
        <h1>บทบาท</h1>
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
          <button
            type="button"
            onClick={() => {
              setSelectedRoleData(undefined); // เคลียร์ข้อมูลให้ว่าง
              reset(initRoleForm);
              setOpenDialogEditRole(true);
            }}
          >
            เพิ่ม
          </button>
        </div>

        <div className="role-content" style={{ width: "100%" }}>
          <Table
            dataSource={roleDatas}
            columns={columns}
            style={{
              border: "2px solid #043929",
              borderRadius: "10px",
            }}
            pagination={{
              pageSize: 8,
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  setSelectedRoleData(record);
                  setOpenDialogEditRole(true);
                },
              };
            }}
          />
        </div>
        {renderDialogEditRole()}
      </form>

      {rederDialogConfirmDelete()}
      <CircleLoading open={isRoleLoading} />
    </div>
  );
};

export default CreateRoleAdminPage;
