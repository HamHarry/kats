import { useCallback, useEffect, useState } from "react";
import "./EditWithDrawAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../stores/store";
import CircleLoading from "../../shared/circleLoading";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  CategoryType,
  CatagoryDetail,
  FinanceData,
  PaymentCategory,
} from "../../model/finance.type";
import dayjs from "dayjs";
import { DeleteStatus } from "../../model/delete.type";
import { DatePicker, InputNumber, Select } from "antd";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { EmployeeData } from "../../model/employee.type";
import { FileAddFilled } from "@ant-design/icons";
import { getExpenseById } from "../../stores/slices/expenseSlice";

const initCategoryDetail: CatagoryDetail = {
  type: CategoryType.FUEL,
  amount: 0,
};

export interface FinanceForm extends Omit<FinanceData, "date"> {
  date: dayjs.Dayjs;
}

const initFinanceForm: FinanceForm = {
  number: 0,
  employeeId: "",
  ownerName: "",
  section: PaymentCategory.WITHDRAW,
  categorys: [initCategoryDetail],
  price: 0,
  date: dayjs(),
  datePrice: "",
  detel: "",
  delete: DeleteStatus.ISNOTDELETE,
  slip: "",
};

const EditWithDrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const [baseImage, setBaseImage] = useState("");
  const [isEditWithDrawLoading, setIsCreateWithDrawLoading] =
    useState<boolean>(false);
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

  const handleRemoveCatagoryDetail = useCallback(
    (index: number) => {
      if (!categoryDetailFields?.fields?.length) return;
      if (categoryDetailFields.fields.length === 1) return;

      categoryDetailFields.remove(Number(index));
    },
    [categoryDetailFields]
  );

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

    // await dispath(createExpense(body)).unwrap();
    console.log(body);

    // navigate("/admin/withdraw");
  };

  return (
    <div className="container-EditWithDrawAdminPage">
      <div className="header-EditWithDrawAdminPage">
        <h1>Edit WithDraw</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-EditWithDrawAdminPage">
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

        <div className="wrap-container-EditWithDrawAdminPage">
          <div className="container-EditWithDrawAdminPage-left">
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
                    <div
                      key={`${detail.id}_${index}`}
                      className="list-category"
                    >
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
                              <Select.Option value={CategoryType.FUEL}>
                                ค่าน้ำมัน
                              </Select.Option>
                              <Select.Option value={CategoryType.TRAVEL}>
                                ค่าเดินทาง
                              </Select.Option>
                              <Select.Option value={CategoryType.ACCOMMODATION}>
                                ค่าที่พัก
                              </Select.Option>
                              <Select.Option value={CategoryType.ALLOWANCE}>
                                ค่าเบี้ยเลี้ยง
                              </Select.Option>
                              <Select.Option value={CategoryType.TRANSPORT}>
                                ค่าขนส่ง
                              </Select.Option>
                              <Select.Option value={CategoryType.TOOL}>
                                ค่าอุปกรณ์
                              </Select.Option>
                              <Select.Option value={CategoryType.MEDICAL}>
                                ค่ารักษา
                              </Select.Option>
                              <Select.Option value={CategoryType.OTHER}>
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

          <div className="container-EditWithDrawAdminPage-right">
            <div className="inputImageuserAdmin">
              <h2>หลักฐานค่าใช้จ่าย</h2>
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
                <h2>แสดงรูปภาพหลักฐานค่าใช้จ่าย</h2>
                <img src={baseImage} alt="image" />
              </div>
            )}
          </div>
        </div>
      </form>
      <CircleLoading open={isEditWithDrawLoading} />
    </div>
  );
};

export default EditWithDrawAdminPage;
