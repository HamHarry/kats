import { useEffect, useState } from "react";
import "./PermissionPage.css";
import { PermissionData, Role, roleList } from "../../data/permissions";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select, Table } from "antd";
import { EmployeeRole } from "../../model/employee.type";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

const inialRoleForm: Role = {
  name: "",
  type: EmployeeRole.CEO,
  permissions: [],
};

const PermissionPage = () => {
  const navigate = useNavigate();

  const [roles] = useState<Role[]>(roleList); //todo สร้าง roleSchema

  const { control, handleSubmit, reset } = useForm<Role>({
    defaultValues: inialRoleForm,
  });

  const permissionsField = useFieldArray({ control, name: "permissions" });

  //todo : fetch ข้อมูล role จาก api และทำ initialForm
  useEffect(() => {
    const role = roleList[0];

    reset(role);
  }, [reset]);

  const onSubmit = async (value: Role) => {
    const selectedRole = roles.find((role) => role.type === value.type);

    const roleBody = {
      name: selectedRole?.name,
      type: value?.type,
      permissions: value.permissions,
    };

    console.log(roleBody);
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
        const realIndex = permissionsField.fields.findIndex(
          (item) => item.key === permission.key
        );
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
        const realIndex = permissionsField.fields.findIndex(
          (item) => item.key === permission.key
        );
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
        const realIndex = permissionsField.fields.findIndex(
          (item) => item.key === permission.key
        );
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
                    console.log(hasDelete);
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

              <Controller
                control={control}
                name="type"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="เลือกดำแหน่งพนักงาน"
                      className="select-product"
                      value={field.value ?? undefined}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {roles.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.type}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  );
                }}
              />
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
    </div>
  );
};

export default PermissionPage;
