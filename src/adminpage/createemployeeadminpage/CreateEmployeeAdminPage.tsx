import { useNavigate } from "react-router-dom";
import "./CreateEmployeeAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import { EmployeePositions, Employees } from "../../model/employee.type";
import { Select } from "antd";
import { FileAddFilled } from "@ant-design/icons";

const initCategoryForm: Employees = {
  name: "",
  tel: "",
  position: EmployeePositions.CEO,
  image: "",
};
const CreateEmployeeAdminPage = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: initCategoryForm,
  });

  const onSubmit = (value: Employees) => {
    const item = {
      ...value,
    };
    console.log(item);
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
                name="position"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="เลือกดำแหน่งพนักงาน"
                      className="select-product"
                      value={field.value || undefined}
                    >
                      <Select.Option value={EmployeePositions.CEO}>
                        หัวหน้า
                      </Select.Option>
                      <Select.Option value={EmployeePositions.AMIN}>
                        ผู้ดูแลระบบ
                      </Select.Option>
                      <Select.Option value={EmployeePositions.SPRAYER}>
                        ช่างพ่นกันสนิม
                      </Select.Option>
                      <Select.Option value={EmployeePositions.WASHTECNICIAN}>
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
