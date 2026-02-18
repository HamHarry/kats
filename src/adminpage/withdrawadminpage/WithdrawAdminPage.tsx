import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Button, Modal, Space, Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { FileAddFilled } from "@ant-design/icons";
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
import { useMobileMatch } from "../../hooks";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { getImagePath } from "../../shared/utils/common";

const WithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(userInfoSelector);
  const [withdrawData, setWithdrawData] = useState([]);

  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);

  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState<boolean>(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] =
    useState<boolean>(false);
  const [selectedExpenseData, setSelectedExpenseData] = useState<FinanceData>();
  const [baseImage, setBaseImage] = useState("");
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [currentMobilePage, setCurrentMobilePage] = useState<number>(1);

  const isMobile = useMobileMatch(640);

  const fetchAllExpense = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: ExpensesRes = [] } =
        await dispath(getAllExpenses()).unwrap();

      const filteredExpenses = ExpensesRes.filter((item: FinanceData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      }).sort((a: any, b: any) => {
        const dateA = new Date(a.date || "").getTime();
        const dateB = new Date(b.date || "").getTime();
        return dateB - dateA; // เรียงจากวันที่สุดท้ายก่อน (ล่างสุด)
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
      const { data: EmployeesRes = [] } =
        await dispath(getAllEmployees()).unwrap();

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
        const formattedDate = datePrice
          ? dayjs(datePrice).format("DD/MM/YYYY")
          : "";
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
        const totalA = (a.categorys || []).reduce(
          (prev, item) => prev + item.amount,
          0,
        );
        const totalB = (b.categorys || []).reduce(
          (prev, item) => prev + item.amount,
          0,
        );
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
            className={
              item.status === 1
                ? "linkIsNone"
                : item.status === 2
                  ? "linkIsNone"
                  : ""
            }
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/withdraw/edit/withdraw/${item._id}`);
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
    const formattedDate = selectedExpenseData
      ? dayjs(selectedExpenseData.date).format("DD/MM/YYYY")
      : "";

    const formattedDatePrice = selectedExpenseData?.datePrice
      ? dayjs(selectedExpenseData.datePrice).format("DD/MM/YYYY")
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
                <img
                  src={getImagePath(
                    "profile",
                    userInfo?.dbname,
                    employeeName?.image,
                  )}
                  alt="profile"
                />
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

  const rederDialogCancelDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogCancelApprove}
        onCancel={() => setOpenDialogCancelApprove(false)}
      >
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
  const renderTableForMobile = () => {
    const pageSize = 10;
    const totalPages = Math.ceil(withdrawData.length / pageSize);
    const startIndex = (currentMobilePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = withdrawData.slice(startIndex, endIndex);

    return (
      <>
        <div
          className="mobile-table-container"
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "4px",
          }}
        >
          {paginatedData.map((item: FinanceData, index: number) => {
            const total = item.categorys.reduce(
              (prev, cat) => prev + cat.amount,
              0,
            );
            const statusText =
              item.status === 0
                ? "รออนุมัติ"
                : item.status === 1
                  ? "อนุมัติแล้ว"
                  : "ยกเลิกเอกสาร";
            const statusColor =
              item.status === 0
                ? "#FFD700"
                : item.status === 1
                  ? "#008B00"
                  : "#FF0000";
            const formattedDate = dayjs(item.date).format("DD/MM/YYYY");
            const section = item.section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน";

            return (
              <div
                key={index}
                className="mobile-card-item"
                onClick={() => {
                  setSelectedExpenseData(item);
                  setOpenDialogConfirmApprove(true);
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
              >
                {/* Header with Code and Status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#043929",
                      }}
                    >
                      {item.codeId}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#f0f0f0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {section}
                    </span>
                  </div>
                  <span
                    style={{
                      color: statusColor,
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {statusText}
                  </span>
                </div>

                {/* Employee Info */}
                <div
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={getImagePath(
                      "profile",
                      userInfo?.dbname,
                      item?.employee?.image,
                    )}
                    alt="employee"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {item.employee?.firstName} {item.employee?.lastName}
                    </p>
                  </div>
                </div>

                {/* Owner Name */}
                <div style={{ marginBottom: "8px" }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    หัวข้อ
                  </p>
                  <p
                    style={{ margin: "0", fontSize: "13px", fontWeight: "500" }}
                  >
                    {item.ownerName}
                  </p>
                </div>

                {/* Detail */}
                <div style={{ marginBottom: "8px" }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    รายละเอียด
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      color: "#333",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.detel}
                  </p>
                </div>

                {/* Date and Amount Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "11px",
                        color: "#666",
                      }}
                    >
                      วันที่สร้าง
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {formattedDate}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "11px",
                        color: "#666",
                      }}
                    >
                      ยอดค่าใช้จ่าย
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#008B00",
                      }}
                    >
                      {total} ฿
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                    paddingTop: "8px",
                    borderTop: "1px solid #eee",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    style={{
                      flex: 1,
                      padding: "6px",
                      textAlign: "center",
                      fontSize: "12px",
                      color:
                        item.status === 1 || item.status === 2
                          ? "#ccc"
                          : "#043929",
                      textDecoration: "none",
                      cursor:
                        item.status === 1 || item.status === 2
                          ? "not-allowed"
                          : "pointer",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f5",
                      opacity: item.status === 1 || item.status === 2 ? 0.5 : 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/withdraw/edit/withdraw/${item._id}`);
                    }}
                  >
                    แก้ไข
                  </a>
                  <a
                    style={{
                      flex: 1,
                      padding: "6px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#d32f2f",
                      textDecoration: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                      backgroundColor: "#ffebee",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExpenseData(item);
                      setOpenDialogConfirmDelete(true);
                    }}
                  >
                    ลบ
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "12px",
          }}
        >
          <button
            onClick={() =>
              setCurrentMobilePage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentMobilePage === 1}
            style={{
              width: "100px",
              height: "36px",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "6px",
              border: "1px solid #043929",
              backgroundColor: currentMobilePage === 1 ? "#e8f5e9" : "#043929",
              color: currentMobilePage === 1 ? "#043929" : "#fff",
              cursor: currentMobilePage === 1 ? "not-allowed" : "pointer",
              opacity: currentMobilePage === 1 ? 0.6 : 1,
              transition: "all 0.3s ease",
            }}
          >
            ← ก่อนหน้า
          </button>

          <span
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#043929",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            หน้า {currentMobilePage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentMobilePage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentMobilePage === totalPages}
            style={{
              width: "100px",
              height: "36px",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "6px",
              border: "1px solid #043929",
              backgroundColor:
                currentMobilePage === totalPages ? "#e8f5e9" : "#043929",
              color: currentMobilePage === totalPages ? "#043929" : "#fff",
              cursor:
                currentMobilePage === totalPages ? "not-allowed" : "pointer",
              opacity: currentMobilePage === totalPages ? 0.6 : 1,
              transition: "all 0.3s ease",
            }}
          >
            ถัดไป →
          </button>
        </div>
      </>
    );
  };

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
          <>{renderTableForMobile()}</>
        ) : (
          <Table
            dataSource={withdrawData}
            columns={columns}
            scroll={{ x: 1500 }}
            pagination={{
              pageSize: 9,
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
