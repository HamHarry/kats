import { Modal, Select, Typography } from "antd";
import "./UserAdminPage.css";
import {
  BankType,
  EmployeeData,
  PaymentStatus,
  PaymentType,
} from "../../model/employee.type";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { FileAddFilled } from "@ant-design/icons";
import { BankDatas } from "../../data/BankData";
import { DeleteStatus } from "../../model/delete.type";

const initUserForm: EmployeeData = {
  name: "",
  tel: "",
  role: {
    name: "",
    type: "",
    permissions: [],
    delete: DeleteStatus.ISNOTDELETE,
  },
  image: "",
  salary: {
    paymentStatus: PaymentStatus.BANK,
    paymentType: PaymentType.MONTHLY,
    bankName: BankType.BANK_OF_AYUDHYA,
    accountNumber: "",
    amount: 0,
  },
  roleId: "",
  delete: DeleteStatus.ISNOTDELETE,
};

const UserAdminPage = () => {
  const formRef = useRef<any>(null);
  // const dispath = useAppDispatch();
  const [baseImage, setBaseImage] = useState("");
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: initUserForm,
  });
  const watchPaymentStatus = watch("salary.paymentStatus");

  const onSubmit = async (value: EmployeeData) => {
    try {
      const newUser = {
        ...value,
        image: baseImage,
      };

      console.log(newUser);
      setOpenDialogConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const rederDialogConfirm = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogConfirm"
        open={openDialogConfirm}
        onCancel={() => setOpenDialogConfirm(false)}
      >
        <h1>ยืนยันการแก้ไข</h1>

        <div className="btn-DialogConfirm-Navbar">
          <button onClick={() => formRef.current?.requestSubmit()}>
            ยืนยัน
          </button>
          <button
            className="btn-edit-dialogConfirm"
            onClick={() => {
              setOpenDialogConfirm(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
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
    <div className="container-userAdmin">
      <div className="header-userAdmin">
        <h1>Users</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div className="wrap-container-userAdmin">
          <div className="btn-createproductAdmin">
            <button
              type="button"
              onClick={() => {
                setOpenDialogConfirm(true);
              }}
            >
              แก้ไข
            </button>
          </div>

          <div className="container-top-userAdmin">
            <div className="input-left">
              <div className="inputNameuserAdmin">
                <h2>ชื่อพนักงาน</h2>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => {
                    return <input {...field} type="text" />;
                  }}
                />
              </div>

              <div className="inputTeluserAdmin">
                <h2>โทรศัพท์</h2>
                <Controller
                  control={control}
                  name="tel"
                  render={({ field }) => {
                    return <input {...field} type="text" />;
                  }}
                />
              </div>

              <div className="inputPositionuserAdmin">
                <h2>ตำแหน่ง</h2>
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
                        <Select.Option value={""}>หัวหน้า</Select.Option>
                        <Select.Option value={""}>ผู้ดูแลระบบ</Select.Option>
                      </Select>
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
            </div>

            <div className="input-right">
              <div className="inputImageuserAdmin">
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

              <div className="PreviewImage">
                <h2>ตัวอย่างรูปภาพประจำตัว</h2>
                {baseImage && <img src={baseImage} alt="image" />}
              </div>
            </div>
          </div>
        </div>
        {rederDialogConfirm()}
      </form>
    </div>
  );
};

export default UserAdminPage;
