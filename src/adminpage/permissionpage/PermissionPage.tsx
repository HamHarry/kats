import { useState } from "react";
import "./PermissionPage.css";
import {
  PermissionData,
  PermissionKey,
  permissionList,
} from "../../data/permissions";
import { Controller, useForm } from "react-hook-form";
import { Select } from "antd";
import { EmployeeRole } from "../../model/employee.type";

const initPermissionForm: PermissionData = {
  name: "",
  key: PermissionKey.EMPLOYEE,
  hasView: false,
  hasEdit: false,
  hasDelete: false,
};

const PermissionPage = () => {
  const [permissionData] = useState(permissionList);

  const { control, handleSubmit } = useForm({
    defaultValues: initPermissionForm,
  });

  const onSubmit = async (value: PermissionData) => {
    const item = {
      ...value,
    };

    console.log(item);
  };

  return (
    <div className="container-PermissionPage">
      <div className="header-PermissionPage">
        <h1>กำหนดสิทธิ์การใช้งาน</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="navbar-PermissionPage">
          <Controller
            control={control}
            name=""
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  placeholder="เลือกดำแหน่งพนักงาน"
                  className="select-product"
                  value={field.value ?? undefined}
                >
                  <Select.Option value={EmployeeRole.CEO}>
                    หัวหน้า
                  </Select.Option>
                  <Select.Option value={EmployeeRole.AMIN}>
                    ผู้ดูแลระบบ
                  </Select.Option>
                  <Select.Option value={EmployeeRole.SPRAYER}>
                    ช่างพ่นกันสนิม
                  </Select.Option>
                  <Select.Option value={EmployeeRole.WASHTECNICIAN}>
                    ช่างล้างรถ
                  </Select.Option>
                </Select>
              );
            }}
          />
        </div>

        <div className="content-PermissionPage">
          {permissionData.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.name}</td>

                <td>
                  <Controller
                    control={control}
                    name={}
                    render={({ field }) => (
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                    )}
                  />
                </td>

                <td>
                  <Controller
                    control={control}
                    name={}
                    render={({ field }) => (
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                    )}
                  />
                </td>

                <td>
                  <Controller
                    control={control}
                    name={}
                    render={({ field }) => (
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                    )}
                  />
                </td>
              </tr>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default PermissionPage;
