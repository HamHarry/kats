import { Controller, useForm } from "react-hook-form";
import "./CreateSalaryAdvanceAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  CategoryType,
  CatagoryDetail,
  FinanceData,
  PaymentCategory,
  ExpenseStatus,
} from "../../model/finance.type";
import CircleLoading from "../../shared/circleLoading";
import { useCallback, useEffect, useState } from "react";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { createExpense, getExpenseById, updateExpenseById } from "../../stores/slices/expenseSlice";
import { DeleteStatus } from "../../model/delete.type";

const initCategoryDetail: CatagoryDetail = {
  type: CategoryType.SALARY_ADVANCE,
  amount: 0,
};

export interface FinanceForm extends Omit<FinanceData, "date"> {
  date: dayjs.Dayjs;
}

const initFinanceForm: FinanceForm = {
  codeId: 0,
  employeeId: "",
  ownerName: "เบิกเงินเดือน",
  section: PaymentCategory.SALARY,
  categorys: [initCategoryDetail],
  date: dayjs(),
  datePrice: "",
  detel: "",
  delete: DeleteStatus.ISNOTDELETE,
  slip: "",
  status: ExpenseStatus.PENDING,
};

const CreateSalaryAdvanceAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const [isSalaryAdvanceLoading, setIsSalaryAdvanceLoading] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initFinanceForm,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!expenseId) return;

      const { data } = await dispath(getExpenseById(expenseId)).unwrap();
      const expenseRes = data as FinanceData;

      const initBookingForm: FinanceForm = {
        codeId: expenseRes.codeId ?? 0,
        employeeId: expenseRes.employeeId ?? "",
        ownerName: expenseRes.ownerName ?? "",
        section: expenseRes.section ?? PaymentCategory.WITHDRAW,
        categorys: expenseRes.categorys ?? [],
        date: dayjs(expenseRes.date),
        datePrice: expenseRes.datePrice ?? "",
        detel: expenseRes.detel ?? "",
        delete: expenseRes.delete ?? DeleteStatus.ISNOTDELETE,
        slip: expenseRes.slip ?? "",
        status: expenseRes.status ?? ExpenseStatus.PENDING,
      };

      reset(initBookingForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, expenseId, reset]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsSalaryAdvanceLoading(true);
      const { data: EmployeesRes = [] } = await dispath(getAllEmployees()).unwrap();

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

  const onSubmit = async (value: FinanceForm) => {
    try {
      const item = {
        ...value,
        date: value.date ? dayjs(value.date).toISOString() : "",
      };

      if (expenseId) {
        const body = {
          // แก้ไข
          data: item,
          expenseId,
        };
        await dispath(updateExpenseById(body)).unwrap();

        navigate("/admin/withdraw");
      } else {
        // สร้าง
        await dispath(createExpense(item)).unwrap();

        navigate("/admin/withdraw");
      }
    } catch (error) {
      console.log(error);
    }
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
          <button type="submit">ยืนยัน</button>
        </div>

        <div className="wrap-container-CreateSalaryAdvanceAdminPage">
          <div className="inputEmployee">
            <h2>พนักงาน</h2>
            <Controller
              control={control}
              name="employeeId"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    placeholder="เลือกพนักงาน"
                    className="select-employee"
                    value={field.value || undefined}
                  >
                    {employeeData.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.firstName} {item.lastName} ({item.role.name})
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
              name={`categorys.${0}.amount`}
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
