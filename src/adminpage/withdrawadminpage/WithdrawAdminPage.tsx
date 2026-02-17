import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Button, Modal, Space, Table, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileAddFilled } from "@ant-design/icons";
import CircleLoading from "../../shared/circleLoading";
import { useAppDispatch } from "../../stores/store";
import { approveExpenseById, getAllExpenses, isDeleteExpenseById } from "../../stores/slices/expenseSlice";
import { EmployeeData } from "../../model/employee.type";
import { CatagoryDetail, ExpenseStatus, FinanceData, PaymentCategory } from "../../model/finance.type";
import dayjs from "dayjs";
import { DeleteStatus } from "../../model/delete.type";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { useMobileMatch } from "../../hooks";

const WithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState([]);

  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);

  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] = useState<boolean>(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] = useState<boolean>(false);
  const [selectedExpenseData, setSelectedExpenseData] = useState<FinanceData>();
  const [baseImage, setBaseImage] = useState("");
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  const isMobile = useMobileMatch(640);

  const fetchAllExpense = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: ExpensesRes = [] } = await dispath(getAllExpenses()).unwrap();

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
      setIsEmployeeLoading(true);
      const { data: EmployeesRes = [] } = await dispath(getAllEmployees()).unwrap();

      setEmployeeData(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEmployeeLoading(false);
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
    {
      title: "เลขที่",
      dataIndex: "codeId",
      key: "codeId",
      width: 55,
      sorter: (a: FinanceData, b: FinanceData) => {
        const codeA = String(a.codeId || "");
        const codeB = String(b.codeId || "");
        return codeA.localeCompare(codeB);
      },
    },
    {
      title: "ผู้สร้างเอกสาร",
      dataIndex: "employee",
      key: "employee",
      width: 120,
      render: (employee: EmployeeData) => {
        return (
          <Typography>
            {employee.firstName} {employee.lastName}
          </Typography>
        );
      },
      sorter: (a: FinanceData, b: FinanceData) => {
        const nameA = `${a.employee?.firstName || ""} ${a.employee?.lastName || ""}`;
        const nameB = `${b.employee?.firstName || ""} ${b.employee?.lastName || ""}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "หัวข้อ",
      dataIndex: "ownerName",
      key: "ownerName",
      width: 130,
      sorter: (a: FinanceData, b: FinanceData) => {
        const nameA = String(a.ownerName || "");
        const nameB = String(b.ownerName || "");
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "รายละเอียด",
      dataIndex: "detel",
      key: "detel",
      width: 200,
      sorter: (a: FinanceData, b: FinanceData) => {
        const detelA = String(a.detel || "");
        const detelB = String(b.detel || "");
        return detelA.localeCompare(detelB);
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "date",
      key: "date",
      width: 80,
      render: (date: string) => {
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "-";
        return <Typography>{formattedDate}</Typography>;
      },
      sorter: (a: FinanceData, b: FinanceData) => {
        const dateA = new Date(a.date || "").getTime();
        const dateB = new Date(b.date || "").getTime();
        return dateA - dateB;
      },
      defaultSortOrder: "descend" as const,
    },
    {
      title: "วันที่ชำระเงิน",
      dataIndex: "datePrice",
      key: "datePrice",
      width: 80,
      render: (datePrice: string) => {
        const formattedDate = datePrice ? dayjs(datePrice).format("DD/MM/YYYY") : "";
        return <Typography>{formattedDate}</Typography>;
      },
      sorter: (a: FinanceData, b: FinanceData) => {
        const dateA = new Date(a.datePrice || "").getTime();
        const dateB = new Date(b.datePrice || "").getTime();
        return dateA - dateB;
      },
    },
    {
      title: "รวมยอดค่าใช้จ่าย",
      dataIndex: "categorys",
      key: "categorys",
      width: 90,
      render: (categorys: CatagoryDetail[]) => {
        const total = categorys.reduce((prev, item) => {
          return prev + item.amount;
        }, 0);

        return <Typography>{total}</Typography>;
      },
      sorter: (a: FinanceData, b: FinanceData) => {
        const totalA = (a.categorys || []).reduce((prev, item) => prev + item.amount, 0);
        const totalB = (b.categorys || []).reduce((prev, item) => prev + item.amount, 0);
        return totalA - totalB;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 65,
      fixed: "right" as const,
      render: (status: number) => {
        const statusText = status === 0 ? "รออนุมัติ" : status === 1 ? "อนุมัติแล้ว" : "ยกเลิกเอกสาร";

        const color = status === 0 ? "#FFD700" : status === 1 ? "#008B00" : "#FF0000";
        return <Typography style={{ color }}>{statusText}</Typography>;
      },
      sorter: (a: FinanceData, b: FinanceData) => {
        return (a.status || 0) - (b.status || 0);
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      fixed: "right" as const,
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
            className={item.status === 1 ? "linkIsNone" : item.status === 2 ? "linkIsNone" : ""}
            onClick={(e) => {
              e.stopPropagation();
              if (item.section === PaymentCategory.WITHDRAW) {
                return navigate(`/admin/withdraw/edit/withdraw/${item._id}`);
              } else {
                return navigate(`/admin/withdraw/edit/salaryadvance/${item._id}`);
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
    const formattedDate = selectedExpenseData ? dayjs(selectedExpenseData.date).format("DD/MM/YYYY") : "";

    const formattedDatePrice = selectedExpenseData?.datePrice ? dayjs(selectedExpenseData.datePrice).format("DD/MM/YYYY") : "";

    const formattedStatus = selectedExpenseData?.status === 0 ? "รออนุมัติ" : selectedExpenseData?.status === 1 ? "อนุมัติแล้ว" : "ยกเลิกเอกสาร";

    const total = selectedExpenseData?.categorys.reduce((prev, item) => {
      return prev + item.amount;
    }, 0);

    const employeeName = employeeData.find((item) => {
      return item._id === selectedExpenseData?.employeeId;
    });

    const section = selectedExpenseData?.section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน";

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
                }}
              >
                ชำระเงิน
              </button>
              <a
                onClick={() => {
                  setOpenDialogCancelApprove(true);
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
                <img src={employeeName?.image} alt="" />
              </div>

              <div className="container-ExpenseUser-right">
                <h4>
                  {employeeName?.firstName} {employeeName?.lastName}
                </h4>

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

                  <p>{employeeName?.employmentInfo.role.name}</p>
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

                  <p>{formattedDatePrice}</p>
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
      <Modal centered className="wrap-container-DialogDelete" open={openDialogConfirmDelete} onCancel={() => setOpenDialogConfirmDelete(false)}>
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

  const rederDialogCancelDelete = () => {
    return (
      <Modal centered className="wrap-container-DialogDelete" open={openDialogCancelApprove} onCancel={() => setOpenDialogCancelApprove(false)}>
        <h1>ยืนยันการลบเอกสาร</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              cencel();
              setOpenDialogCancelApprove(false);
              setOpenDialogConfirmApprove(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogCancelApprove(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  // Todo : สร้าง table ของ mobile
  const renderTableForMobile = useMemo(() => {
    return <></>;
  }, []);

  return (
    <div className="container-WithdrawAdminPage">
      <div className="header-WithdrawAdminPage">
        <h1>ค่าใช้จ่าย & เบิกเงิน</h1>
      </div>

      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <Button
            onClick={() => {
              navigate("/admin/withdraw/createWithdraw");
            }}
          >
            สร้าง
          </Button>
        </div>
      </div>

      <div className="" style={{ width: "100%" }}>
        {isMobile ? (
          <>{renderTableForMobile}</>
        ) : (
          <Table
            dataSource={withdrawData}
            columns={columns}
            scroll={{ x: 1500 }}
            pagination={{
              pageSize: 8,
            }}
            style={{
              border: "2px solid #043929",
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
        )}
      </div>

      {rederDialogConfirmDelete()}
      {rederDialogConfirmApprove()}
      {rederDialogCancelDelete()}

      <CircleLoading open={isExpenseLoading} />
      <CircleLoading open={isEmployeeLoading} />
    </div>
  );
};

export default WithdrawAdminPage;
