import { useCallback, useEffect, useState } from "react";
import "./PermissionPage.css";
import { PermissionData, RoleData } from "../../data/permissions";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { getAllRolesForPermission, updateRoleById } from "../../stores/slices/roleSlice";
import { useAppDispatch } from "../../stores/store";
import { DeleteStatus } from "../../model/delete.type";
import CircleLoading from "../../shared/circleLoading";

const inialRoleForm: RoleData = {
  name: "",
  type: "",
  permissions: [],
  delete: DeleteStatus.ISNOTDELETE,
};

const PermissionPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [roleDatas, setRoleDatas] = useState<RoleData[]>([]);

  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(false);

  const { control, handleSubmit, reset, watch } = useForm<RoleData>({
    defaultValues: inialRoleForm,
  });

  const permissionsField = useFieldArray({ control, name: "permissions" });
  const watchRoleType = watch("type");

  const fetchRoles = useCallback(async () => {
    try {
      setIsRoleLoading(true);

      const { data: roleRes = [] } = await dispath(getAllRolesForPermission()).unwrap();

      const filteredRoles = roleRes.filter((item: RoleData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setRoleDatas(filteredRoles);
      console.log(filteredRoles);

      if (filteredRoles.length) {
        reset(filteredRoles[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRoleLoading(false);
    }
  }, [dispath, reset]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const onSubmit = async (value: RoleData) => {
    try {
      const item = {
        ...value,
      };

      const body = {
        data: item,
        roleId: item._id,
      };

      await dispath(updateRoleById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      fetchRoles();
    }
  };

  const columns: ColumnsType<PermissionData> = [
    {
      title: "กำหนดสิทธิ์",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ดู",
      dataIndex: "hasView",
      key: "hasView",
      align: "center",
      width: "5%",
      render: (hasView: any, permission: any) => {
        const realIndex = permissionsField.fields.findIndex((item) => item.key === permission.key);
        if (realIndex === -1) {
          return null;
        }

        return (
          <>
            <Controller
              control={control}
              name={`permissions.${realIndex}.hasView`}
              defaultValue={hasView}
              render={({ field }) => (
                <input
                  className="checkbox-permission"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </>
        );
      },
    },
    {
      title: "แก้ไข",
      dataIndex: "hasEdit",
      key: "hasEdit",
      align: "center",
      width: "5%",
      render: (hasEdit: any, permission: any) => {
        const realIndex = permissionsField.fields.findIndex((item) => item.key === permission.key);
        if (realIndex === -1) {
          return null;
        }

        return (
          <>
            <Controller
              control={control}
              name={`permissions.${realIndex}.hasEdit`}
              defaultValue={hasEdit}
              render={({ field }) => (
                <input
                  className="checkbox-permission"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </>
        );
      },
    },
    {
      title: "ลบ",
      dataIndex: "hasDelete",
      key: "hasDelete",
      align: "center",
      width: "5%",
      render: (hasDelete: any, permission: any) => {
        const realIndex = permissionsField.fields.findIndex((item) => item.key === permission.key);
        if (realIndex === -1) {
          return null;
        }

        return (
          <>
            <Controller
              control={control}
              name={`permissions.${realIndex}.hasDelete`}
              defaultValue={hasDelete}
              render={({ field }) => (
                <input
                  className="checkbox-permission"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="container-PermissionPage">
      <div className="header-PermissionPage">
        <h1>กำหนดสิทธิ์การใช้งาน</h1>
      </div>

      <div className="container-content-PermissionPage">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="navbar-PermissionPage">
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  navigate("/admin/setting");
                }}
              >
                ย้อนกลับ
              </button>

              <Select
                placeholder="เลือกดำแหน่งพนักงาน"
                className="select-employee"
                value={watchRoleType ?? undefined}
                onChange={(value) => {
                  const findedRole = roleDatas.find((role) => role.type === value);
                  reset(findedRole);
                }}
              >
                {roleDatas.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.type}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>

            <button type="submit">ยืนยัน</button>
          </div>

          <Table
            dataSource={permissionsField.fields}
            columns={columns}
            rowKey={(row) => row.key}
            pagination={{
              pageSize: 7,
            }}
            style={{
              border: "2px solid #2656a2",
              borderRadius: "10px",
              height: "600px",
            }}
          />
        </form>
      </div>

      <CircleLoading open={isRoleLoading} />
    </div>
  );
};

export default PermissionPage;
