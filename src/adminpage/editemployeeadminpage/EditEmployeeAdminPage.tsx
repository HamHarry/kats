import "./EditEmployeeAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import {
  EmployeeRole,
  EmployeeData,
  PaymentStatus,
  PaymentType,
  SalaryStatus,
  SalaryData,
  BankType,
} from "../../model/employee.type";
import { Select, Typography } from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { getEmployeeById } from "../../stores/slices/employeeSlice";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BankDatas } from "../../data/BankData";

const initEmployeeForm: EmployeeData = {
  name: "",
  tel: "",
  staffRole: EmployeeRole.CEO,
  image: "",
  salary: {
    paymentStatus: PaymentStatus.BANK,
  },
};

const EmployeeSalary: SalaryData[] = [
  {
    paymentStatus: PaymentStatus.BANK,
    paymentType: PaymentType.MONTHLY,
    bankName: BankType.SIAM_COMMERCIAL_BANK,
    accountNumber: "3802983193",
    amount: 20000,
    SalaryStatus: SalaryStatus.PENDING,
  },
];

const EditEmployeeAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { employeeId } = useParams();

  const [baseImage, setBaseImage] = useState("");
  const [mockUpSalaryData] = useState(EmployeeSalary);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: initEmployeeForm,
  });

  const watchPaymentStatus = watch("salary.paymentStatus");

  console.log(watchPaymentStatus);

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
        salary: {
          paymentStatus: PaymentStatus.BANK,
        },
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
      image: baseImage,
      salary: mockUpSalaryData[0],
    };

    // await dispath(createEmployee(body));

    console.log(body);

    navigate("/admin/employee");
  };

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

  return (
    <div className="container-EditEmployee">
      <div className="header-EditEmployee">
        <h1>Edit Employee</h1>
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

        <div className="wrap-container-EditEmployee">
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

            <div className="inputPaymentStatus">
              <h2>การชำระเงิน</h2>
              <Controller
                control={control}
                name="salary.paymentStatus"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="เลือกการชำระเงินเดือน"
                      className="select-product"
                      value={field.value ?? undefined}
                      onClick={() => {
                        // setIsAccountNumber();
                      }}
                    >
                      <Select.Option value={PaymentStatus.BANK}>
                        ธนาคาร
                      </Select.Option>
                      <Select.Option value={PaymentStatus.CASH}>
                        เงินสด
                      </Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="inputPaymentType">
              <h2>ประเภทการชำระเงิน</h2>
              <Controller
                control={control}
                name="salary.paymentType"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="เลือกประเภทการชำระเงิน"
                      className="select-product"
                      value={field.value ?? undefined}
                    >
                      <Select.Option value={PaymentType.MONTHLY}>
                        รายเดือน
                      </Select.Option>
                      <Select.Option value={PaymentType.DAILY}>
                        รายวัน
                      </Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            {watchPaymentStatus === PaymentStatus.BANK && (
              <>
                <div className="inputAccountNumber">
                  <h2>เลขบัญชี</h2>
                  <Controller
                    control={control}
                    name="salary.accountNumber"
                    render={({ field }) => {
                      return (
                        <input
                          {...field}
                          className="input-prices"
                          type="text"
                          placeholder="กรอกเลขบัญชี"
                          onChange={(event) => {
                            const value = event.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            const validated = value.match(
                              /^(\d*\.{0,1}\d{0,2}$)/
                            );
                            if (validated) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      );
                    }}
                  />
                </div>

                <div className="inputBankName">
                  <h2>บัญชีธนาคาร</h2>
                  <Controller
                    control={control}
                    name="salary.bankName"
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="เลือกบัญชีธนาคาร"
                          className="select-product"
                          value={field.value ?? undefined}
                        >
                          {BankDatas.map((bank, index) => {
                            return (
                              <Select.Option key={index} value={bank.type}>
                                <div className="bank-select">
                                  <img
                                    className="bank-logo"
                                    src={bank.img}
                                    alt=""
                                  />
                                  <Typography>{bank.name}</Typography>
                                </div>
                              </Select.Option>
                            );
                          })}
                        </Select>
                      );
                    }}
                  />
                </div>
              </>
            )}

            <div className="inputAmount">
              <h2>จำนวนเงิน</h2>
              <Controller
                control={control}
                name="salary.amount"
                render={({ field }) => {
                  return (
                    <input
                      {...field}
                      className="input-prices"
                      type="text"
                      placeholder="กรอกจำนวนเงิน"
                      onChange={(event) => {
                        const value = event.target.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const validated = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
                        if (validated) {
                          field.onChange(Number(value));
                        }
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="PreviewImage">
            <h2>ตัวอย่างรูปภาพประจำตัว</h2>
            {baseImage && <img src={baseImage} alt="image" />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeeAdminPage;
