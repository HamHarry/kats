import { Controller, useForm } from "react-hook-form";
import "./CreateSalaryAdvanceAdminPage.css";
import { useNavigate } from "react-router-dom";
import {
  Category_Type,
  CategoryDetail,
  FinanceData,
  PaymentCategory,
} from "../../model/finance.type";
import CircleLoading from "../../shared/circleLoading";
import { useCallback, useEffect, useState } from "react";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { InputNumber, Select } from "antd";
import dayjs from "dayjs";

const initCategoryDetail: CategoryDetail = {
  type: Category_Type.FUEL,
  amount: 0,
};

const initFinanceForm: FinanceData = {
  number: 0,
  name: "",
  ownerName: "",
  section: PaymentCategory.SALARY,
  categorys: [initCategoryDetail],
  price: 0,
  date: "",
  datePrice: "",
  detel: "",
};

const CreateSalaryAdvanceAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [isSalaryAdvanceLoading, setIsSalaryAdvanceLoading] =
    useState<boolean>(false);

  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const { control, handleSubmit } = useForm({
    defaultValues: initFinanceForm,
  });

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsSalaryAdvanceLoading(true);
      const { data: EmployeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeData(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSalaryAdvanceLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const onSubmit = async (value: FinanceData) => {
    const body = {
      ...value,
      date: value.date ? dayjs(value.date).toISOString() : "",
    };

    console.log(body);
  };

  return (
    <div className="container-CreateSalaryAdvanceAdminPage">
      <div className="header-CreateSalaryAdvanceAdminPage">
        <h1>Create Salary Advance</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-CreateSalaryAdvanceAdminPage">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/withdraw");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            onClick={() => {
              navigate("/admin/withdraw");
            }}
          >
            ยืนยัน
          </button>
        </div>

        <div className="wrap-container-CreateSalaryAdvanceAdminPage">
          <div className="inputEmployee">
            <h2>พนักงาน</h2>
            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    placeholder="เลือกพนักงาน"
                    className="select-employee"
                    value={field.value || undefined}
                  >
                    {employeeData.map((item) => (
                      <Select.Option key={item._id} value={item.name}>
                        {item.name} (
                        {`${
                          item.staffRole === 0
                            ? "หัวหน้า"
                            : item.staffRole === 1
                            ? "ผู้ดูแลระบบ"
                            : item.staffRole === 2
                            ? "ช่างล้างรถ"
                            : "ช่างพ่นสี"
                        }`}
                        )
                      </Select.Option>
                    ))}
                  </Select>
                );
              }}
            />
          </div>

          <div className="inputDetel">
            <h2>รายละเอียด</h2>
            <div className="input-owner-detel">
              <Controller
                control={control}
                name="detel"
                render={({ field }) => {
                  return (
                    <textarea
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...field}
                      placeholder="รายละเอียด..."
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="inputDate">
            <h2>จำนวนเงิน</h2>
            <Controller
              control={control}
              name="date"
              render={({ field }) => {
                return (
                  <InputNumber
                    className="input-number"
                    {...field}
                    addonAfter="฿"
                    placeholder="กรอกจำนวนเงิน"
                  />
                );
              }}
            />
          </div>
        </div>
      </form>
      <CircleLoading open={isSalaryAdvanceLoading} />
    </div>
  );
};

export default CreateSalaryAdvanceAdminPage;
