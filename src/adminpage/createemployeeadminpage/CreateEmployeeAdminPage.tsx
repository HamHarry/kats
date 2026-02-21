import "./CreateEmployeeAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import { PaymentStatus, PaymentType, BankType, EmployeeDataForm } from "../../model/employee.type";
import { Select, Typography } from "antd";
import { CloseCircleOutlined, FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { createEmployee, getEmployeeById, setProfileImage, updateEmployeeById } from "../../stores/slices/employeeSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BankDatas } from "../../data/BankData";
import { useTranslation } from "react-i18next";
import { DeleteStatus } from "../../model/delete.type";
import { RoleData } from "../../data/permissions";
import CircleLoading from "../../shared/circleLoading";
import { getAllRoles } from "../../stores/slices/roleSlice";
import { getImagePath } from "../../shared/utils/common";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { uploadFile } from "../../services/coreService";

const initEmployeeForm: EmployeeDataForm = {
  tel: "",
  image: "",
  employmentInfo: {
    salaryInfo: {
      paymentStatus: PaymentStatus.BANK,
      paymentType: PaymentType.MONTHLY,
      bankName: BankType.BANK_OF_AYUDHYA,
      accountNumber: "",
      amount: 0,
    },
    roleId: "",
  },
  firstName: "",
  lastName: "",
};

const CreateEmployeeAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const userInfo = useSelector(userInfoSelector);

  const { employeeId } = useParams();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const [imageFile, setImageFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [roleDatas, setRoleDatas] = useState<RoleData[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeDataForm>();

  const [isCreateEmployeeLoading, setIsCreateEmployeeLoading] = useState<boolean>(false);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: initEmployeeForm,
  });

  const watchPaymentStatus = watch("employmentInfo.salaryInfo.paymentStatus");

  const getProfileImage = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    } else {
      return getImagePath("profile", userInfo?.dbname, employeeData?.image);
    }
  }, [employeeData, imageUrl, userInfo]);

  const initailForm = useCallback(async () => {
    try {
      if (!employeeId) return;
      const { data } = await dispath(getEmployeeById(employeeId)).unwrap();
      const employeeRes = data as EmployeeDataForm;

      setEmployeeData(employeeRes);

      const initEmployeeForm: EmployeeDataForm = {
        firstName: employeeRes.firstName ?? "",
        lastName: employeeRes.lastName ?? "",
        tel: employeeRes.tel ?? "",
        employmentInfo: {
          salaryInfo: {
            paymentStatus: employeeRes.employmentInfo.salaryInfo?.paymentStatus ?? PaymentStatus.BANK,
            paymentType: employeeRes.employmentInfo.salaryInfo?.paymentType ?? PaymentType.MONTHLY,
            bankName: employeeRes.employmentInfo.salaryInfo?.bankName ?? BankType.BANK_OF_AYUDHYA,
            accountNumber: employeeRes.employmentInfo.salaryInfo?.accountNumber ?? "",
            amount: employeeRes.employmentInfo.salaryInfo?.amount ?? 0,
          },
          roleId: employeeRes.employmentInfo.roleId ?? "",
        },
        image: employeeRes.image ?? "",
        email: employeeRes.email ?? "",
      };

      console.log("initEmployeeForm", initEmployeeForm);

      reset(initEmployeeForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, reset, employeeId]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const fetchRoleData = useCallback(async () => {
    try {
      setIsCreateEmployeeLoading(true);

      const { data: roleRes = [] } = await dispath(getAllRoles()).unwrap();

      const filteredRoles = roleRes.filter((item: RoleData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setRoleDatas(filteredRoles);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreateEmployeeLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  const onSubmit = async (value: EmployeeDataForm) => {
    try {
      let imageName = value.image || "";

      console.log(imageName, value);

      if (imageFile) {
        imageName = await uploadFile(imageFile);
        dispath(setProfileImage({ imageName: imageName }));
      }

      const newEmployee = {
        ...value,
        image: imageName,
      };

      console.log("newEmployee", newEmployee);

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
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  return (
    <div className="container-CreateEmployeeAdminPage">
      <div className="header-CreateEmployeeAdminPage">
        <h1>{employeeId ? "ข้อมูลพนักงาน" : "สร้างพนักงาน"}</h1>
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
              <h2>{t("ชื่อ")}</h2>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>

            <div className="inputNameEmployee">
              <h2>{t("นามสกุล")}</h2>
              <Controller
                control={control}
                name="lastName"
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
                name="employmentInfo.roleId"
                render={({ field }) => {
                  return (
                    <Select {...field} placeholder="เลือกดำแหน่งพนักงาน" className="select-product" value={field.value ?? undefined}>
                      {roleDatas.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item._id}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  );
                }}
              />
            </div>

            <div className="inputImageEmployee">
              <h2>{t("รูปภาพประจำตัว")}</h2>
              <div className="inputImage">
                <label htmlFor="file" className="text-image">
                  <FileAddFilled className="icon-file" />
                  <span>{t("อัพโหลดรูปภาพ")}</span>
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    uploadImage(e);
                  }}
                />
              </div>
            </div>

            <div className="inputPaymentStatus">
              <h2>{t("การชำระเงิน")}</h2>
              <Controller
                control={control}
                name="employmentInfo.salaryInfo.paymentStatus"
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
                      <Select.Option value={PaymentStatus.BANK}>{t("ธนาคาร")}</Select.Option>
                      <Select.Option value={PaymentStatus.CASH}>{t("เงินสด")}</Select.Option>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="inputPaymentType">
              <h2>{t("ประเภทการชำระเงิน")}</h2>
              <Controller
                control={control}
                name="employmentInfo.salaryInfo.paymentType"
                render={({ field }) => {
                  return (
                    <Select {...field} placeholder="เลือกประเภทการชำระเงิน" className="select-product" value={field.value ?? undefined}>
                      <Select.Option value={PaymentType.MONTHLY}>{t("รายเดือน")}</Select.Option>
                      <Select.Option value={PaymentType.DAILY}>{t("รายวัน")}</Select.Option>
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
                    name="employmentInfo.salaryInfo.accountNumber"
                    render={({ field }) => {
                      return (
                        <input
                          {...field}
                          className="input-prices"
                          type="text"
                          placeholder={t("กรอกเลขบัญชี")}
                          onChange={(event) => {
                            const value = event.target.value.replace(/[^0-9.]/g, "");
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

                <div className="inputBankName">
                  <h2>{t("บัญชีธนาคาร")}</h2>
                  <Controller
                    control={control}
                    name="employmentInfo.salaryInfo.bankName"
                    render={({ field }) => {
                      return (
                        <Select {...field} placeholder="เลือกบัญชีธนาคาร" className="select-product" value={field.value ?? undefined}>
                          {BankDatas.map((bank, index) => {
                            return (
                              <Select.Option key={index} value={bank.type}>
                                <div className="bank-select">
                                  <img className="bank-logo" src={bank.img} alt="" />
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
                name="employmentInfo.salaryInfo.amount"
                render={({ field }) => {
                  return (
                    <input
                      {...field}
                      className="input-prices"
                      type="text"
                      placeholder="กรอกจำนวนเงิน"
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9.]/g, "");
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
            {getProfileImage && (
              <>
                <div className="wrap-img" style={{ position: "relative", height: 200, width: 200 }}>
                  <img src={getProfileImage} alt="image" />
                  <CloseCircleOutlined
                    className="close-icon"
                    style={{
                      fontSize: "30px",
                      top: "15px",
                      right: "15px",
                      zIndex: 1000,
                      color: "#043929",
                      cursor: "pointer",
                      position: "absolute",
                    }}
                    onClick={() => {
                      setImageUrl("");
                      setImageFile(null);
                      setEmployeeData((prev) => {
                        if (!prev) return;
                        return {
                          ...prev,
                          image: "",
                        };
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </form>

      <CircleLoading open={isCreateEmployeeLoading} />
    </div>
  );
};

export default CreateEmployeeAdminPage;
