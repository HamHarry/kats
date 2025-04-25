import dayjs from "dayjs";
import {
  CatagoryDetail,
  CategoryType,
  FinanceData,
  PaymentCategory,
} from "../../model/finance.type";
import "./EditSalaryAdvanceAdminPage.css";
import { DeleteStatus } from "../../model/delete.type";
import { useAppDispatch } from "../../stores/store";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EmployeeData } from "../../model/employee.type";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import {
  createExpense,
  getExpenseById,
} from "../../stores/slices/expenseSlice";
import { InputNumber, Select } from "antd";
import CircleLoading from "../../shared/circleLoading";
import { FileAddFilled } from "@ant-design/icons";

const initCategoryDetail: CatagoryDetail = {
  type: CategoryType.SALARY_ADVANCE,
  amount: 0,
};

export interface FinanceForm extends Omit<FinanceData, "date"> {
  date: dayjs.Dayjs;
}

const initFinanceForm: FinanceForm = {
  number: 0,
  employeeId: "",
  ownerName: "เบิกเงินเดือน",
  section: PaymentCategory.SALARY,
  categorys: [initCategoryDetail],
  price: 0,
  date: dayjs(),
  datePrice: "",
  detel: "",
  delete: DeleteStatus.ISNOTDELETE,
  slip: "",
};

const EditSalaryAdvanceAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const [baseImage, setBaseImage] = useState("");
  const [isEditSalaryAdvanceLoading, setIsEditSalaryAdvanceLoading] =
    useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initFinanceForm,
  });

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsEditSalaryAdvanceLoading(true);
      const { data: EmployeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeData(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditSalaryAdvanceLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const initailForm = useCallback(async () => {
    try {
      if (!expenseId) return;

      const { data } = await dispath(getExpenseById(expenseId)).unwrap();
      const expenseRes = data as FinanceData;

      const initBookingForm: FinanceForm = {
        number: expenseRes.number ?? 0,
        employeeId: expenseRes.employeeId ?? "",
        ownerName: expenseRes.ownerName ?? "",
        section: expenseRes.section ?? PaymentCategory.WITHDRAW,
        categorys: expenseRes.categorys ?? [],
        price: expenseRes.price ?? 0,
        date: dayjs(expenseRes.date),
        datePrice: expenseRes.datePrice ?? "",
        detel: expenseRes.detel ?? "",
        delete: expenseRes.delete ?? DeleteStatus.ISNOTDELETE,
        slip: expenseRes.slip ?? "",
      };

      reset(initBookingForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, expenseId, reset]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  // เก็บไฟล์รูปภาพเป็น Base64
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const base64 = (await convertBase64(file)) as string;
    setBaseImage(base64);
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (e: any) => {
        reject(e);
      };
    });
  };

  const onSubmit = async (value: FinanceForm) => {
    const body = {
      ...value,
      date: value.date ? dayjs(value.date).toISOString() : "",
    };

    await dispath(createExpense(body)).unwrap();

    navigate("/admin/withdraw");
  };

  return (
    <div className="container-EditSalaryAdvanceAdminPage">
      <div className="header-EditSalaryAdvanceAdminPage">
        <h1>Edit Salary Advance</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-EditSalaryAdvanceAdminPage">
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

        <div className="wrap-container-EditSalaryAdvanceAdminPage">
          <div className="container-EditSalaryAdvanceAdminPage-top">
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

          <div className="container-EditSalaryAdvanceAdminPage-button">
            <div className="inputImageSalaryAdvance">
              <h2>หลักฐานเบิกเงินเดือน</h2>
              <Controller
                name="slip"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="inputImage">
                      <label htmlFor="file" className="text-image">
                        <FileAddFilled className="icon-file" />
                        <span>อัพโหลดรูปภาพ</span>
                      </label>
                      <input
                        {...field}
                        type="file"
                        id="file"
                        onChange={(e) => {
                          uploadImage(e);
                        }}
                      />
                    </div>
                  );
                }}
              />
            </div>

            {baseImage && (
              <div className="PreviewImage">
                <h2>แสดงรูปภาพหลักฐานเบิกเงินเดือน</h2>
                <img src={baseImage} alt="image" />
              </div>
            )}
          </div>
        </div>
      </form>
      <CircleLoading open={isEditSalaryAdvanceLoading} />
    </div>
  );
};

export default EditSalaryAdvanceAdminPage;
