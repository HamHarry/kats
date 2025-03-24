import { useNavigate, useParams } from "react-router-dom";
import "./CreateEmployeeAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import { EmployeeRole, EmployeeData } from "../../model/employee.type";
import { Select } from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import {
  createEmployee,
  getEmployeeById,
} from "../../stores/slices/employeeSlice";
import { useCallback, useEffect } from "react";

const initCatagoryForm: EmployeeData = {
  name: "",
  tel: "",
  staffRole: EmployeeRole.CEO,
  image: "",
};
const CreateEmployeeAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { employeeId } = useParams();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initCatagoryForm,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!employeeId) return;
      const { data } = await dispath(getEmployeeById(employeeId)).unwrap();
      const employeeRes = data as EmployeeData;

      const initEmployeeForm: EmployeeData = {
        name: employeeRes.name ?? "",
        tel: employeeRes.tel ?? "",
        staffRole: employeeRes.staffRole ?? EmployeeRole.CEO,
        image: employeeRes.image ?? "",
      };

      reset(initEmployeeForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, reset, employeeId]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const onSubmit = async (value: EmployeeData) => {
    const body: EmployeeData = {
      ...value,
    };

    await dispath(createEmployee(body));

    navigate("/admin/employee");
  };

  return (
    <div className="container-CreateEmployee">
      <div className="header-CreateEmployee">
        <h1>Create Employee</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createproductAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/employee");
            }}
          >
            ย้อนกลับ
          </button>
          <button type="submit">ยืนยัน</button>
        </div>

        <div className="wrap-container-CreateEmployee">
          <div className="input-left">
            <div className="inputNameEmployee">
              <h2>ชื่อพนักงาน</h2>
              <Controller
                control={control}
                name="name"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>

            <div className="inputTelEmployee">
              <h2>โทรศัพท์</h2>
              <Controller
                control={control}
                name="tel"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>

            <div className="inputPositionEmployee">
              <h2>ตำแหน่ง</h2>
              <Controller
                control={control}
                name="staffRole"
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

            <div className="inputImageEmployee">
              <h2>รูปภาพประจำตัว</h2>
              <Controller
                name="image"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="inputImage">
                      <label htmlFor="file" className="text-image">
                        <FileAddFilled className="icon-file" />
                        <span>อัพโหลดรูปภาพ</span>
                      </label>
                      <input {...field} type="file" id="file" />
                    </div>
                  );
                }}
              />
            </div>
          </div>
          {/* preview */}
          <img src="/public/assets/user.png" alt="image" />
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeeAdminPage;
