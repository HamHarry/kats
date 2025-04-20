import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./CreateWithdrawAdminPage.css";
import { useNavigate } from "react-router-dom";
import {
  Category_Type,
  CategoryDetail as CatagoryDetail,
  FinanceData,
  PaymentCategory,
} from "../../model/finance.type";
import CircleLoading from "../../shared/circleLoading";
import { useCallback, useEffect, useState } from "react";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";

const initCategoryDetail: CatagoryDetail = {
  type: Category_Type.FUEL,
  amount: 0,
};

const initFinanceForm: FinanceData = {
  number: 0,
  employeeId: "",
  ownerName: "",
  section: PaymentCategory.WITHDRAW,
  categorys: [initCategoryDetail],
  price: 0,
  date: "",
  datePrice: "",
  detel: "",
};

const CreateWithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [isCreateWithDrawLoading, setIsCreateWithDrawLoading] =
    useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const { control, handleSubmit } = useForm({
    defaultValues: initFinanceForm,
  });

  const categoryDetailFields = useFieldArray({
    name: "categorys",
    control,
  });

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsCreateWithDrawLoading(true);
      const { data: EmployeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeData(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreateWithDrawLoading(false);
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

  const handleRemoveCatagoryDetail = useCallback(
    (index: number) => {
      if (!categoryDetailFields?.fields?.length) return;
      if (categoryDetailFields.fields.length === 1) return;

      categoryDetailFields.remove(Number(index));
    },
    [categoryDetailFields]
  );

  return (
    <div className="container-CreateWithdrawAdminPage">
      <div className="header-CreateWithdrawAdminPage">
        <h1>Create Withdraw</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-CreateWithdrawAdminPage">
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

        <div className="wrap-container-CreateWithdrawAdminPage">
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
                name="ownerName"
                render={({ field }) => {
                  return (
                    <input {...field} type="text" placeholder="หัวข้อ..." />
                  );
                }}
              />

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
            <h2>วันที่สร้าง</h2>
            <Controller
              control={control}
              name="date"
              render={({ field }) => {
                return <DatePicker {...field} />;
              }}
            />
          </div>

          <div className="wrap-inputList">
            <h2>รายการ</h2>
            <div className="inputList">
              <button
                className="btn-append"
                type="button"
                onClick={() => {
                  if (categoryDetailFields?.fields.length === 4) return;

                  categoryDetailFields.append(initCategoryDetail);
                }}
              >
                เพิ่มหมวดหมู่
              </button>

              {categoryDetailFields.fields.map((detail, index) => {
                return (
                  <div key={`${detail.id}_${index}`} className="list-category">
                    <Controller
                      control={control}
                      name={`categorys.${index}.type`}
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            placeholder="เลือกหมวดหมู่"
                            className="select-category"
                            value={field.value || undefined}
                          >
                            <Select.Option value={Category_Type.FUEL}>
                              ค่าน้ำมัน
                            </Select.Option>
                            <Select.Option value={Category_Type.TRAVEL}>
                              ค่าเดินทาง
                            </Select.Option>
                            <Select.Option value={Category_Type.ACCOMMODATION}>
                              ค่าที่พัก
                            </Select.Option>
                            <Select.Option value={Category_Type.ALLOWANCE}>
                              ค่าเบี้ยเลี้ยง
                            </Select.Option>
                            <Select.Option value={Category_Type.TRANSPORT}>
                              ค่าขนส่ง
                            </Select.Option>
                            <Select.Option value={Category_Type.TOOL}>
                              ค่าอุปกรณ์
                            </Select.Option>
                            <Select.Option value={Category_Type.MEDICAL}>
                              ค่ารักษา
                            </Select.Option>
                            <Select.Option value={Category_Type.OTHER}>
                              ค่าอื่นๆ
                            </Select.Option>
                          </Select>
                        );
                      }}
                    />

                    <Controller
                      control={control}
                      name={`categorys.${index}.amount`}
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

                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCatagoryDetail(index)}
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>
      <CircleLoading open={isCreateWithDrawLoading} />
    </div>
  );
};

export default CreateWithdrawAdminPage;
