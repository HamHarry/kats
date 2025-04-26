import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Button, Dropdown, Modal, Space, Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DownOutlined, FileAddFilled } from "@ant-design/icons";
import CircleLoading from "../../shared/circleLoading";
import { useAppDispatch } from "../../stores/store";
import {
  approveExpenseById,
  getAllExpenses,
  isDeleteExpenseById,
} from "../../stores/slices/expenseSlice";
import { EmployeeData } from "../../model/employee.type";
import {
  CatagoryDetail,
  ExpenseStatus,
  FinanceData,
  PaymentCategory,
} from "../../model/finance.type";
import dayjs from "dayjs";
import { DeleteStatus } from "../../model/delete.type";
import { getAllEmployees } from "../../stores/slices/employeeSlice";

const WithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState([]);
  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState<boolean>(false);
  const [selectedExpenseData, setSelectedExpenseData] = useState<FinanceData>();
  const [baseImage, setBaseImage] = useState("");
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const fetchAllExpense = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: ExpensesRes = [] } = await dispath(
        getAllExpenses()
      ).unwrap();

      const filteredExpenses = ExpensesRes.filter((item: FinanceData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setWithdrawData(filteredExpenses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllExpense();
  }, [fetchAllExpense]);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: EmployeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeData(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

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

  const columns = [
    { title: "เลขที่", dataIndex: "number", key: "number" },
    {
      title: "ผู้สร้างเอกสาร",
      dataIndex: "employee",
      key: "employee",
      render: (employee: EmployeeData) => {
        return <Typography>{employee.name}</Typography>;
      },
    },
    { title: "หัวข้อ", dataIndex: "ownerName", key: "ownerName" },
    {
      title: "หมวดหมู่",
      dataIndex: "section",
      key: "section",
      render: (section: number) => {
        return (
          <Typography>
            {section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน"}
          </Typography>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "date",
      key: "date",
      render: (date: string) => {
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "-";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      title: "วันที่ชำระเงิน",
      dataIndex: "datePrice",
      key: "datePrice",
      render: (datePrice: string) => {
        const formattedDate = datePrice
          ? dayjs(datePrice).format("DD/MM/YYYY")
          : "";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      title: "รวมยอดค่าใช้จ่าย",
      dataIndex: "categorys",
      key: "categorys",
      render: (categorys: CatagoryDetail[]) => {
        const total = categorys.reduce((prev, item) => {
          return prev + item.amount;
        }, 0);

        return <Typography>{total}</Typography>;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusText =
          status === 0
            ? "รออนุมัติ"
            : status === 1
            ? "อนุมัติแล้ว"
            : "ยกเลิกเอกสาร";

        const color =
          status === 0 ? "#FFD700" : status === 1 ? "#008B00" : "#FF0000";
        return <Typography style={{ color }}>{statusText}</Typography>;
      },
    },
    {
      title: "",
      key: "action",
      render: (item: FinanceData) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            className={
              item.status === 1
                ? "linkIsNone"
                : item.status === 2
                ? "linkIsNone"
                : ""
            }
            onClick={(e) => {
              e.stopPropagation();
              if (item.section === PaymentCategory.WITHDRAW) {
                return navigate(`/admin/withdraw/edit/withdraw/${item._id}`);
              } else {
                return navigate(
                  `/admin/withdraw/edit/salaryadvance/${item._id}`
                );
              }
            }}
          >
            แก้ไข
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpenseData(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const handleMenuClick = (item: any) => {
    if (!item) return;

    if (item.key === "createWithdraw") {
      return navigate(`/admin/withdraw/${item.key}`);
    } else {
      navigate(`/admin/withdraw/${item.key}`);
    }
  };

  const items = [
    {
      label: "สร้างค่าใช้จ่าย",
      key: "createWithdraw",
    },
    {
      label: "เบิกเงินเดือน",
      key: "createSalaryAdvance",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const approved = async () => {
    try {
      setIsExpenseLoading(true);
      if (!selectedExpenseData?._id) return;

      const body: FinanceData = {
        ...selectedExpenseData,
        datePrice: dayjs().toISOString(),
        status: ExpenseStatus.APPROVE,
      };

      await dispath(approveExpenseById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
      fetchAllExpense();
    }
  };

  const cencel = async () => {
    try {
      setIsExpenseLoading(true);
      if (!selectedExpenseData?._id) return;

      const body: FinanceData = {
        ...selectedExpenseData,
        datePrice: dayjs().toISOString(),
        status: ExpenseStatus.CANCEL,
      };

      await dispath(approveExpenseById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
      fetchAllExpense();
    }
  };

  const deleted = async () => {
    try {
      setIsExpenseLoading(true);
      if (!selectedExpenseData?._id) return;

      const body: FinanceData = {
        ...selectedExpenseData,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteExpenseById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllExpense();
    }
  };

  const rederDialogConfirmApprove = () => {
    const formattedDate = selectedExpenseData
      ? dayjs(selectedExpenseData.date).format("DD/MM/YYYY")
      : "";

    const formattedStatus =
      selectedExpenseData?.status === 0
        ? "รออนุมัติ"
        : selectedExpenseData?.status === 1
        ? "อนุมัติแล้ว"
        : "ยกเลิกเอกสาร";

    const total = selectedExpenseData?.categorys.reduce((prev, item) => {
      return prev + item.amount;
    }, 0);

    const employeeName = employeeData.find((item) => {
      return item._id === selectedExpenseData?.employeeId;
    });

    const employeeRole =
      employeeName?.staffRole === 0
        ? "หัวหน้า"
        : employeeName?.staffRole === 1
        ? "ผู้ดูแลระบบ"
        : employeeName?.staffRole === 2
        ? "ช่างล้างรถ"
        : "ช่างพ่นสี";

    const section =
      selectedExpenseData?.section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน";

    return (
      <Modal
        centered
        className="container-DialogApprove-Expense"
        open={openDialogConfirmApprove}
        onCancel={() => setOpenDialogConfirmApprove(false)}
        footer={
          selectedExpenseData?.status === 0 && (
            <div className="btn-DialogApprove-Navbar">
              <button
                type="button"
                onClick={() => {
                  approved();
                  setOpenDialogConfirmApprove(false);
                  console.log("อนุมัติแล้ว");
                }}
              >
                ชำระเงิน
              </button>
              <a
                onClick={() => {
                  cencel();
                  setOpenDialogConfirmApprove(false);
                }}
              >
                ยกเลิกเอกสาร
              </a>
            </div>
          )
        }
      >
        <div className="container-Expense-navbar">
          <h1>ค่าใช้จ่าย & เบิกเงิน</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApprove(false);
            }}
          ></i>
        </div>

        <div className="container-Expense">
          <div className="container-Expense-left">
            <div className="container-ExpenseUser">
              <div className="container-ExpenseUser-left">
                <img src="/public/assets/logoGun.jpg" alt="" />
              </div>

              <div className="container-ExpenseUser-right">
                <h4>{employeeName?.name}</h4>

                <div className="previewTel">
                  <div className="width-40">
                    <i className="fa-solid fa-phone"></i>
                  </div>

                  <p>{employeeName?.tel}</p>
                </div>

                <div className="previewRol">
                  <div className="width-40">
                    <i className="fa-solid fa-user"></i>
                  </div>

                  <p>{employeeRole}</p>
                </div>
              </div>
            </div>

            <div className="wrap-container-ExpenseData">
              <h4>ข้อมูล</h4>

              <div className="container-ExpenseData">
                <div className="previewOnerName">
                  <div className="width-100">
                    <p>หัวข้อ</p>
                  </div>

                  <p>{section}</p>
                </div>

                <div className="previewDetel">
                  <div className="width-100">
                    <p>รายละเอียด</p>
                  </div>

                  <p>{selectedExpenseData?.detel}</p>
                </div>

                <div className="previewDate">
                  <div className="width-100">
                    <p>วันที่สร้าง</p>
                  </div>

                  <p>{formattedDate}</p>
                </div>
              </div>
            </div>

            <div className="wrap-container-ExpenseList">
              <h4>รายการ</h4>

              <div className="container-ExpenseList">
                <div className="previewCatagory">
                  <div className="width-100">
                    <p>หมวดหมู่</p>
                  </div>

                  <p>{selectedExpenseData?.ownerName}</p>
                </div>

                <div className="previewTotal">
                  <div className="width-100">
                    <p>ยอดค่าใช้จ่าย</p>
                  </div>

                  <p>{total} บาท</p>
                </div>

                <div className="previewStatus">
                  <div className="width-100">
                    <p>สถานะเอกสาร</p>
                  </div>

                  <p>{formattedStatus}</p>
                </div>

                <div className="previewPriceDate">
                  <div className="width-100">
                    <p>วันที่ชำระเงิน</p>
                  </div>

                  <p>{selectedExpenseData?.datePrice}</p>
                </div>
              </div>
            </div>

            <div className="wrap-inputImage">
              <h4>หลักฐานการโอน</h4>
              <div className="inputImage">
                <label htmlFor="file" className="text-image">
                  <FileAddFilled className="icon-file" />
                  <span>อัพโหลดหลักฐานการชำระ</span>
                </label>
                <input
                  // {...field}
                  type="file"
                  id="file"
                  onChange={(e) => {
                    uploadImage(e);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="container-Expense-right">
            {baseImage && (
              <div className="PreviewImage">
                <h2>รูปภาพหลักฐานการชำระ</h2>
                <img src={baseImage} alt="image" />
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deleted();
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-WithdrawAdminPage">
      <div className="header-WithdrawAdminPage">
        <h1>Withdraw & Salary Advance</h1>
      </div>

      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                สร้าง
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="withdraw-content" style={{ width: "100%" }}>
        <Table
          dataSource={withdrawData}
          columns={columns}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedExpenseData(record);
                setOpenDialogConfirmApprove(true);
              },
            };
          }}
        />
      </div>

      {rederDialogConfirmDelete()}
      {rederDialogConfirmApprove()}
      <CircleLoading open={isExpenseLoading} />
    </div>
  );
};

export default WithdrawAdminPage;
