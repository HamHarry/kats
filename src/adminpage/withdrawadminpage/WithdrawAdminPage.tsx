import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Modal, Space, Table, Tooltip, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "../../model/finance.type";
import dayjs from "dayjs";
import { DeleteStatus } from "../../model/delete.type";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { useMobileMatch } from "../../hooks";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { getImagePath } from "../../shared/utils/common";
import { uploadFile } from "../../services/coreService";

/* ── helpers ─────────────────────────────────────────── */
const getStatusMeta = (status: number) => {
  switch (status) {
    case 0:
      return { label: "รออนุมัติ", key: "pending" };
    case 1:
      return { label: "อนุมัติแล้ว", key: "approved" };
    default:
      return { label: "ยกเลิกเอกสาร", key: "cancelled" };
  }
};

/* ── component ───────────────────────────────────────── */
const WithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(userInfoSelector);

  const [withdrawData, setWithdrawData] = useState<FinanceData[]>([]);
  const [isExpenseLoading, setIsExpenseLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);

  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] = useState(false);

  const [selectedExpenseData, setSelectedExpenseData] = useState<FinanceData>();
  const [baseImage, setBaseImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [currentMobilePage, setCurrentMobilePage] = useState(1);

  const isMobile = useMobileMatch(640);

  /* ── data fetching ──────────────────────────────────── */
  const fetchAllExpense = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: ExpensesRes = [] } =
        await dispath(getAllExpenses()).unwrap();
      const filtered = ExpensesRes.filter(
        (item: FinanceData) => item.delete === DeleteStatus.ISNOTDELETE,
      ).sort((a: any, b: any) =>
        b.codeId.localeCompare(a.codeId, undefined, { numeric: true }),
      );
      setWithdrawData(filtered);
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

  /* ── image upload ───────────────────────────────────── */
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setBaseImage(file);
  };

  const getExpenseSlipImage = useMemo(() => {
    if (imageUrl) return imageUrl;
    return getImagePath(
      "expenses",
      userInfo?.dbname,
      selectedExpenseData?.slip,
    );
  }, [selectedExpenseData, imageUrl, userInfo]);

  /* ── actions ────────────────────────────────────────── */
  const onClose = () => {
    setImageUrl(undefined);
    setBaseImage(undefined);
    setSelectedExpenseData(undefined);
    setCurrentMobilePage(1);
  };

  const approved = async () => {
    try {
      setIsExpenseLoading(true);
      if (!selectedExpenseData?._id) return;
      let slipImageName = "";
      if (baseImage) slipImageName = await uploadFile(baseImage);
      await dispath(
        approveExpenseById({
          ...selectedExpenseData,
          datePrice: dayjs().toISOString(),
          status: ExpenseStatus.APPROVE,
          slip: slipImageName.trim(),
        }),
      ).unwrap();
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
      await dispath(
        approveExpenseById({
          ...selectedExpenseData,
          datePrice: dayjs().toISOString(),
          status: ExpenseStatus.CANCEL,
        }),
      ).unwrap();
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
      await dispath(
        isDeleteExpenseById({
          ...selectedExpenseData,
          delete: DeleteStatus.ISDELETE,
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllExpense();
    }
  };

  /* ── table columns ──────────────────────────────────── */
  const columns = [
    {
      title: "เลขที่",
      dataIndex: "codeId",
      key: "codeId",
      width: 55,
      sorter: (a: FinanceData, b: FinanceData) =>
        String(a.codeId || "").localeCompare(String(b.codeId || "")),
      defaultSortOrder: "descend" as const,
    },
    {
      title: "ผู้สร้างเอกสาร",
      dataIndex: "employee",
      key: "employee",
      width: 120,
      render: (employee: EmployeeData) => (
        <Typography>
          {employee.firstName} {employee.lastName}
        </Typography>
      ),
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
      sorter: (a: FinanceData, b: FinanceData) =>
        String(a.ownerName || "").localeCompare(String(b.ownerName || "")),
    },
    {
      title: "รายละเอียด",
      dataIndex: "detel",
      key: "detel",
      width: 200,
      sorter: (a: FinanceData, b: FinanceData) =>
        String(a.detel || "").localeCompare(String(b.detel || "")),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "date",
      key: "date",
      width: 80,
      render: (date: string) => (
        <Typography>{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</Typography>
      ),
      sorter: (a: FinanceData, b: FinanceData) =>
        new Date(a.date || "").getTime() - new Date(b.date || "").getTime(),
    },
    {
      title: "วันที่ชำระเงิน",
      dataIndex: "datePrice",
      key: "datePrice",
      width: 80,
      render: (datePrice: string) => (
        <Typography>
          {datePrice ? dayjs(datePrice).format("DD/MM/YYYY") : ""}
        </Typography>
      ),
      sorter: (a: FinanceData, b: FinanceData) =>
        new Date(a.datePrice || "").getTime() -
        new Date(b.datePrice || "").getTime(),
    },
    {
      title: "รวมยอดค่าใช้จ่าย",
      dataIndex: "categorys",
      key: "categorys",
      width: 90,
      render: (categorys: CatagoryDetail[]) => (
        <Typography>{categorys.reduce((p, i) => p + i.amount, 0)}</Typography>
      ),
      sorter: (a: FinanceData, b: FinanceData) => {
        const tA = (a.categorys || []).reduce((p, i) => p + i.amount, 0);
        const tB = (b.categorys || []).reduce((p, i) => p + i.amount, 0);
        return tA - tB;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 65,
      fixed: "right" as const,
      render: (status: number) => {
        const meta = getStatusMeta(status);
        return (
          <span className={`withdraw-status-badge ${meta.key}`}>
            {meta.label}
          </span>
        );
      },
      sorter: (a: FinanceData, b: FinanceData) =>
        (a.status || 0) - (b.status || 0),
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
            fontSize: "14px",
          }}
        >
          <Tooltip title="แก้ไขข้อมูล">
            <a
              className={
                item.status === 1 || item.status === 2 ? "linkIsNone" : ""
              }
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/withdraw/edit/withdraw/${item._id}`);
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </a>
          </Tooltip>
          <Tooltip title="ลบข้อมูล">
            <a
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExpenseData(item);
                setOpenDialogConfirmDelete(true);
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* ── mobile view ────────────────────────────────────── */
  const renderTableForMobile = () => {
    const pageSize = 10;
    const totalPages = Math.ceil(withdrawData.length / pageSize);
    const startIndex = (currentMobilePage - 1) * pageSize;
    const paginatedData = withdrawData.slice(startIndex, startIndex + pageSize);

    return (
      <>
        <div
          className="withdraw-mobile-list"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          {paginatedData.map((item: FinanceData, index: number) => {
            const total = item.categorys.reduce((p, c) => p + c.amount, 0);
            const statusMeta = getStatusMeta(item.status ?? 0);
            const formattedDate = dayjs(item.date).format("DD/MM/YYYY");
            const section = item.section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน";

            return (
              <div
                key={index}
                className="withdraw-mobile-card"
                onClick={() => {
                  setSelectedExpenseData(item);
                  setOpenDialogConfirmApprove(true);
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontFamily: "'Rajdhani',sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--accent-primary)",
                      }}
                    >
                      {item.codeId}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--bg-surface)",
                        padding: "2px 8px",
                        borderRadius: 6,
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      {section}
                    </span>
                  </div>
                  <span className={`mobile-status-badge ${statusMeta.key}`}>
                    {statusMeta.label}
                  </span>
                </div>

                {/* Employee */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
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
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--border-active)",
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {item.employee?.firstName} {item.employee?.lastName}
                  </span>
                </div>

                {/* Info grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 12px",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      หัวข้อ
                    </p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>
                      {item.ownerName}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      วันที่สร้าง
                    </p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>
                      {formattedDate}
                    </p>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      รายละเอียด
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "var(--text-primary)",
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
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Rajdhani',sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--status-approved)",
                    }}
                  >
                    {total.toLocaleString()} ฿
                  </span>
                  <div
                    style={{ display: "flex", gap: 8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      style={{
                        padding: "5px 14px",
                        fontSize: 12,
                        borderRadius: 8,
                        fontWeight: 600,
                        textDecoration: "none",
                        color:
                          item.status === 1 || item.status === 2
                            ? "var(--text-muted)"
                            : "var(--accent-primary)",
                        border: "1px solid",
                        borderColor:
                          item.status === 1 || item.status === 2
                            ? "var(--border)"
                            : "rgba(4,57,41,0.3)",
                        background:
                          item.status === 1 || item.status === 2
                            ? "var(--bg-surface)"
                            : "rgba(4,57,41,0.06)",
                        cursor:
                          item.status === 1 || item.status === 2
                            ? "not-allowed"
                            : "pointer",
                        pointerEvents:
                          item.status === 1 || item.status === 2
                            ? "none"
                            : "auto",
                      }}
                      onClick={() =>
                        navigate(`/admin/withdraw/edit/withdraw/${item._id}`)
                      }
                    >
                      แก้ไข
                    </a>
                    <a
                      style={{
                        padding: "5px 14px",
                        fontSize: 12,
                        borderRadius: 8,
                        fontWeight: 600,
                        textDecoration: "none",
                        color: "var(--status-canceled)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        background: "rgba(239,68,68,0.06)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedExpenseData(item);
                        setOpenDialogConfirmDelete(true);
                      }}
                    >
                      ลบ
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="withdraw-mobile-pagination">
          <button
            onClick={() => setCurrentMobilePage((p) => Math.max(p - 1, 1))}
            disabled={currentMobilePage === 1}
          >
            ← ก่อนหน้า
          </button>
          <span>
            หน้า {currentMobilePage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentMobilePage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentMobilePage === totalPages}
          >
            ถัดไป →
          </button>
        </div>
      </>
    );
  };

  /* ── approve dialog ─────────────────────────────────── */
  const renderDialogConfirmApprove = () => {
    const formattedDate = selectedExpenseData
      ? dayjs(selectedExpenseData.date).format("DD/MM/YYYY")
      : "";
    const formattedDatePrice = selectedExpenseData?.datePrice
      ? dayjs(selectedExpenseData.datePrice).format("DD/MM/YYYY")
      : "";
    const statusMeta = getStatusMeta(selectedExpenseData?.status ?? 0);
    const total = selectedExpenseData?.categorys.reduce(
      (p, i) => p + i.amount,
      0,
    );
    const employeeName = employeeData.find(
      (e) => e._id === selectedExpenseData?.employeeId,
    );
    const section =
      selectedExpenseData?.section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน";

    return (
      <Modal
        centered
        className="container-DialogApprove-Expense"
        open={openDialogConfirmApprove}
        onCancel={() => {
          setOpenDialogConfirmApprove(false);
          onClose();
        }}
        footer={
          selectedExpenseData?.status === 0 ? (
            <div className="btn-DialogApprove-Navbar">
              <button
                type="button"
                onClick={() => {
                  approved();
                  onClose();
                  setOpenDialogConfirmApprove(false);
                }}
              >
                ชำระเงิน
              </button>
              <a onClick={() => setOpenDialogCancelApprove(true)}>
                ยกเลิกเอกสาร
              </a>
            </div>
          ) : null
        }
      >
        <div className="container-Expense-navbar">
          <h1>ค่าใช้จ่าย &amp; เบิกเงิน</h1>
          {/* <i
            className="fa-solid fa-circle-xmark"
            onClick={() => setOpenDialogConfirmApprove(false)}
          /> */}
        </div>

        <div className="container-Expense">
          {/* Left */}
          <div className="container-Expense-left">
            {/* Employee */}
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
                    <i className="fa-solid fa-phone" />
                  </div>
                  <p>{employeeName?.tel}</p>
                </div>
                <div className="previewRol">
                  <div className="width-40">
                    <i className="fa-solid fa-user" />
                  </div>
                  <p>{employeeName?.employmentInfo.role.name}</p>
                </div>
              </div>
            </div>

            {/* Data */}
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

            {/* List */}
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
                  <p>
                    <span className={`withdraw-status-badge ${statusMeta.key}`}>
                      {statusMeta.label}
                    </span>
                  </p>
                </div>
                <div className="previewPriceDate">
                  <div className="width-100">
                    <p>วันที่ชำระเงิน</p>
                  </div>
                  <p>{formattedDatePrice}</p>
                </div>
              </div>
            </div>

            {/* Upload */}
            {selectedExpenseData?.status === 0 && (
              <div className="wrap-inputImage">
                <h4>หลักฐานการโอน</h4>
                <div className="inputImage">
                  <label htmlFor="file" className="text-image">
                    <FileAddFilled className="icon-file" />
                    <span>อัพโหลดหลักฐานการชำระ</span>
                  </label>
                  <input type="file" id="file" onChange={uploadImage} />
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="container-Expense-right">
            {getExpenseSlipImage && (
              <div className="PreviewImage">
                <h2>รูปภาพหลักฐานการชำระ</h2>
                <img src={getExpenseSlipImage} alt="slip" />
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  /* ── delete dialog ──────────────────────────────────── */
  const renderDialogConfirmDelete = () => (
    <Modal
      centered
      className="wrap-container-DialogDelete"
      open={openDialogConfirmDelete}
      onCancel={() => setOpenDialogConfirmDelete(false)}
      footer={null}
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
        <button onClick={() => setOpenDialogConfirmDelete(false)}>
          ยกเลิก
        </button>
      </div>
    </Modal>
  );

  /* ── cancel dialog ──────────────────────────────────── */
  const renderDialogCancelDelete = () => (
    <Modal
      centered
      className="wrap-container-DialogCancel"
      open={openDialogCancelApprove}
      onCancel={() => setOpenDialogCancelApprove(false)}
      footer={null}
    >
      <h1>ยืนยันการยกเลิกเอกสาร</h1>
      <div className="btn-DialogCancel-Navbar">
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
        <button onClick={() => setOpenDialogCancelApprove(false)}>
          ยกเลิก
        </button>
      </div>
    </Modal>
  );

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="container-WithdrawAdminPage">
      {/* Header */}
      <div className="header-WithdrawAdminPage">
        <h1>ค่าใช้จ่าย &amp; เบิกเงิน</h1>
      </div>

      {/* Create button */}
      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <button
            type="button"
            onClick={() => navigate("/admin/withdraw/createWithdraw")}
          >
            + สร้าง
          </button>
        </div>
      </div>

      {/* Table / Mobile */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        {isMobile ? (
          renderTableForMobile()
        ) : (
          <div className="withdraw-table-wrapper">
            <Table
              dataSource={withdrawData}
              columns={columns}
              scroll={{ x: 1500 }}
              pagination={{ pageSize: 9 }}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedExpenseData(record);
                  setOpenDialogConfirmApprove(true);
                },
              })}
            />
          </div>
        )}
      </div>

      {/* Dialogs */}
      {renderDialogConfirmApprove()}
      {renderDialogConfirmDelete()}
      {renderDialogCancelDelete()}

      <CircleLoading open={isExpenseLoading} />
      <CircleLoading open={isEmployeeLoading} />
    </div>
  );
};

export default WithdrawAdminPage;
