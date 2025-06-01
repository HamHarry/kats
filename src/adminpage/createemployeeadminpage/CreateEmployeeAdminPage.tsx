import "./CreateEmployeeAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import {
  EmployeeData,
  PaymentStatus,
  PaymentType,
  BankType,
} from "../../model/employee.type";
import { Select, Typography } from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import {
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
} from "../../stores/slices/employeeSlice";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BankDatas } from "../../data/BankData";
import { useTranslation } from "react-i18next";

const initEmployeeForm: EmployeeData = {
  name: "",
  tel: "",
  image: "",
  salary: {
    paymentStatus: PaymentStatus.BANK,
    paymentType: PaymentType.MONTHLY,
    bankName: BankType.BANK_OF_AYUDHYA,
    accountNumber: "",
    amount: 0,
  },
  role: {
    name: "",
    type: "",
    permissions: [],
  },
};

const CreateEmployeeAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { employeeId } = useParams();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const [baseImage, setBaseImage] = useState("");

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: initEmployeeForm,
  });

  const watchPaymentStatus = watch("salary.paymentStatus");

  const initailForm = useCallback(async () => {
    try {
      if (!employeeId) return;
      const { data } = await dispath(getEmployeeById(employeeId)).unwrap();
      const employeeRes = data as EmployeeData;

      const initEmployeeForm: EmployeeData = {
        name: employeeRes.name ?? "",
        tel: employeeRes.tel ?? "",
        role: employeeRes.role ?? {},
        image: employeeRes.image ?? "",
        salary: {
          paymentStatus:
            employeeRes.salary?.paymentStatus ?? PaymentStatus.BANK,
          paymentType: employeeRes.salary?.paymentType ?? PaymentType.MONTHLY,
          bankName: employeeRes.salary?.bankName ?? BankType.BANK_OF_AYUDHYA,
          accountNumber: employeeRes.salary?.accountNumber ?? "",
          amount: employeeRes.salary?.amount ?? 0,
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
    try {
      const newEmployee = {
        ...value,
      };

      if (employeeId) {
        const body = {
          employeeId,
          data: newEmployee,
        };

        await dispath(updateEmployeeById(body)).unwrap();

        navigate("/admin/employee");
      } else {
        await dispath(createEmployee(newEmployee)).unwrap();

        navigate("/admin/employee");
      }
    } catch (error) {
      console.log(error);
    }
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
    <div className="container-CreateEmployeeAdminPage">
      <div className="header-CreateEmployeeAdminPage">
        <h1>{t("สร้างข้อมูลพนักงาน")}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createproductAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/employee");
            }}
          >
            {t("ย้อนกลับ")}
          </button>
          <button type="submit">{t("ยืนยัน")}</button>
        </div>

        <div className="wrap-container-CreateEmployeeAdminPage">
          <div className="input-left">
            <div className="inputNameEmployee">
              <h2>{t("ชื่อพนักงาน")}</h2>
              <Controller
                control={control}
                name="name"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>

            <div className="inputTelEmployee">
              <h2>{t("โทรศัพท์")}</h2>
              <Controller
                control={control}
                name="tel"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>

            <div className="inputPositionEmployee">
              <h2>{t("ตำแหน่ง")}</h2>
              <Controller
                control={control}
                name="role.type"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="เลือกดำแหน่งพนักงาน"
                      className="select-product"
                      value={field.value ?? undefined}
                    >
                      <Select.Option value={""}>{t("หัวหน้า")}</Select.Option>
                      <Select.Option value={""}>
                        {t("ผู้ดูแลระบบ")}
                      </Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="inputImageEmployee">
              <h2>{t("รูปภาพประจำตัว")}</h2>
              <Controller
                name="image"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="inputImage">
                      <label htmlFor="file" className="text-image">
                        <FileAddFilled className="icon-file" />
                        <span>{t("อัพโหลดรูปภาพ")}</span>
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
              <h2>{t("การชำระเงิน")}</h2>
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
                        {t("ธนาคาร")}
                      </Select.Option>
                      <Select.Option value={PaymentStatus.CASH}>
                        {t("เงินสด")}
                      </Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="inputPaymentType">
              <h2>{t("ประเภทการชำระเงิน")}</h2>
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
                        {t("รายเดือน")}
                      </Select.Option>
                      <Select.Option value={PaymentType.DAILY}>
                        {t("รายวัน")}
                      </Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            {watchPaymentStatus === PaymentStatus.BANK && (
              <>
                <div className="inputAccountNumber">
                  <h2>{t("เลขบัญชี")}</h2>
                  <Controller
                    control={control}
                    name="salary.accountNumber"
                    render={({ field }) => {
                      return (
                        <input
                          {...field}
                          className="input-prices"
                          type="text"
                          placeholder={t("กรอกเลขบัญชี")}
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
                  <h2>{t("บัญชีธนาคาร")}</h2>
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
              <h2>{t("จำนวนเงิน")}</h2>
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
            <h2>{t("ตัวอย่างรูปภาพประจำตัว")}</h2>
            {baseImage && <img src={baseImage} alt="image" />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeeAdminPage;
