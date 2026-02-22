import { useCallback, useEffect, useState } from "react";
import "./BookingAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { BookingData, BookingStatus } from "../../model/booking.type";
import { useAppDispatch } from "../../stores/store";
import {
  approveBookingById,
  cancelBookingById,
  getAllBookingPaginations,
  isDeleteBookingById,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { DeleteStatus } from "../../model/delete.type";
import { useTranslation } from "react-i18next";
import { getImagePath } from "../../shared/utils/common";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { useSelector } from "react-redux";

/* ── helpers ────────────────────────────────────────────── */
const getStatusMeta = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.PENDING:
      return { label: "รอชำระ", key: "pending" };
    case BookingStatus.PAID:
      return { label: "ชำระแล้ว", key: "paid" };
    case BookingStatus.COMPLETED:
      return { label: "สำเร็จ", key: "completed" };
    case BookingStatus.CANCELED:
      return { label: "ยกเลิก", key: "canceled" };
    default:
      return { label: "ตรวจสภาพ", key: "checking" };
  }
};

/* ── component ──────────────────────────────────────────── */
const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { t, i18n } = useTranslation();
  const userInfo = useSelector(userInfoSelector);
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [selectDataBooking, setSelectDataBooking] = useState<BookingData>();
  const [selectImagePay, setSelectImagePay] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] = useState(false);
  const [openDialogPay, setOpenDialogPay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceiptBookNo, setSelectedReceiptBookNo] = useState("all");

  /* ── data fetching ──────────────────────────────────── */
  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookingPaginations({
          term: searchTerm,
          receiptBookNo: selectedReceiptBookNo,
        }),
      ).unwrap();
      setBookingDatas(
        bookingsRes.filter(
          (item: BookingData) => item.delete === DeleteStatus.ISNOTDELETE,
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath, searchTerm, selectedReceiptBookNo]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const initailBookingLites = useCallback(() => {
    if (!bookingDataLites.length) setBookingDataLites(bookingDatas);
  }, [bookingDataLites, bookingDatas]);

  useEffect(() => {
    initailBookingLites();
  }, [initailBookingLites]);

  const handleSetSearchTerm = debounce((v) => setSearchTerm(v), 500);

  /* ── actions ────────────────────────────────────────── */
  const isStatusDelete = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;
      await dispath(
        isDeleteBookingById({
          ...selectDataBooking,
          delete: DeleteStatus.ISDELETE,
        }),
      ).unwrap();
      setOpenDialogConfirmDelete(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsBookingLoading(false);
      fetchAllBooking();
    }
  };

  const onSubmit = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;
      const status =
        selectDataBooking.status === BookingStatus.CHECKING
          ? selectDataBooking.status
          : BookingStatus.COMPLETED;
      await dispath(
        approveBookingById({ ...selectDataBooking, status }),
      ).unwrap();
    } catch (e) {
      console.log(e);
    } finally {
      setIsBookingLoading(false);
      navigate("/admin/guarantee");
    }
  };

  const cancel = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;
      await dispath(
        cancelBookingById({
          ...selectDataBooking,
          status: BookingStatus.CANCELED,
        }),
      ).unwrap();
    } catch (e) {
      console.log(e);
    } finally {
      setIsBookingLoading(false);
      fetchAllBooking();
    }
  };

  /* ── select menu ────────────────────────────────────── */
  const receiptBookNoList = bookingDataLites
    .map((b) => b.receiptBookNo)
    .filter((v, i, s) => s.indexOf(v) === i);

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="container-BookingAdmin">
      {/* Header */}
      <div className="header-BookingAdmin">
        <h1>{t("จองคิว")}</h1>
      </div>

      {/* Search / Filter */}
      <div className="search-BookingAdmin">
        <div className="btn-menu">
          <select onChange={(e) => setSelectedReceiptBookNo(e.target.value)}>
            <option value="all">{t("ทั้งหมด")}</option>
            {receiptBookNoList.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="search-content-right">
          <input
            type="text"
            placeholder="Search… (Name, Phone, Number)"
            onChange={(e) => handleSetSearchTerm(e.target.value)}
          />
          <button
            className="btn-crate"
            type="button"
            onClick={() => navigate("/admin/booking/create")}
          >
            + {t("สร้าง")}
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="wrap-container-BookingAdmin">
        {bookingDatas.length === 0 && !isBookingLoading && (
          <div className="booking-empty">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p>ไม่มีข้อมูลการจอง</p>
          </div>
        )}

        {bookingDatas.map((item, index) => {
          const productType = item.product.typeProductSnapshot.name;
          const isGun = productType === "GUN";
          const completedGuarantees =
            item.guarantees?.filter(
              (g) => g.status === BookingStatus.COMPLETED,
            ) ?? [];
          const currentGuarantee =
            item.guarantees?.[completedGuarantees.length];
          const bookDate = currentGuarantee?.serviceDate || item.bookDate;
          const formattedDate = dayjs(bookDate).format("DD/MM/YYYY");
          const statusMeta = getStatusMeta(item.status);
          const isDone =
            item.status === BookingStatus.COMPLETED ||
            item.status === BookingStatus.CANCELED;

          return (
            <div
              key={index}
              className={`grid-BookingAdmin ${isGun ? "type-gun" : "type-coat"}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Card Header */}
              <div className="BookingAdmin-card-header">
                <div className="BookingAdmin-image">
                  <img
                    src={
                      item.product.name === "KATS Coating"
                        ? "/assets/logokats.jpg"
                        : "/assets/logoGun.jpg"
                    }
                    alt="product"
                  />
                </div>

                <div className="BookingAdmin-header-meta">
                  <p className="BookingAdmin-product-name">
                    {item.product.name}
                  </p>
                  <div className="BookingAdmin-date-time">
                    <span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <p
                        style={{
                          display: "flex",
                          marginTop: "4px",
                        }}
                      >
                        {formattedDate}
                      </p>
                    </span>
                    <span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p
                        style={{
                          display: "flex",
                          marginTop: "4px",
                        }}
                      >
                        {item.bookTime} น.
                      </p>
                    </span>
                  </div>
                </div>

                <div className={`status-badge ${statusMeta.key}`}>
                  <span className="status-badge-dot" />
                  {statusMeta.label}
                </div>
              </div>

              {/* Card Body */}
              <div className="BookingAdmin-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">{t("ชื่อ")}</span>
                    <span className="info-value">{item.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("โทรศัพท์")}</span>
                    <span className="info-value">{item.tel}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("เลขที่")}</span>
                    <span className="info-value">{item.number}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("เล่มที่")}</span>
                    <span className="info-value">{item.receiptBookNo}</span>
                  </div>
                  <div className="info-item full">
                    <span className="info-label">{t("สินค้า / ราคา")}</span>
                    <span
                      className={`info-value accent ${isGun ? "gun" : "coat"}`}
                    >
                      {item.product.name} — {item.price.amount} {t("บาท")}
                    </span>
                  </div>

                  <div
                    className="info-divider"
                    style={{ gridColumn: "1 / -1" }}
                  />

                  <div className="info-item">
                    <span className="info-label">{t("รถ")}</span>
                    <span className="info-value">
                      {item.carType} {item.carModel}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t("ทะเบียน")}</span>
                    <span className="info-value">
                      {item.licensePlate} {item.province}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="BookingAdmin-card-footer">
                <div className="footer-actions">
                  <Tooltip title="รูปภาพการชำระเงิน">
                    <button
                      className="icon-btn pay"
                      onClick={() => {
                        setSelectImagePay(item.slip);
                        setOpenDialogPay(true);
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
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </button>
                  </Tooltip>

                  <Tooltip title="แก้ไขข้อมูล">
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        item._id && navigate(`/admin/booking/edit/${item._id}`)
                      }
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
                    </button>
                  </Tooltip>

                  <Tooltip title="ลบข้อมูล">
                    <button
                      className="icon-btn delete"
                      onClick={() => {
                        setOpenDialogConfirmDelete(true);
                        setSelectDataBooking(item);
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
                    </button>
                  </Tooltip>
                </div>

                <div className={`approve-btns${isDone ? " hidden" : ""}`}>
                  <button
                    className="btn-approve-action success"
                    onClick={() => {
                      setOpenDialogConfirmApprove(true);
                      setSelectDataBooking(item);
                    }}
                  >
                    {t("สำเร็จ")}
                  </button>
                  <button
                    className="btn-approve-action cancel"
                    onClick={() => {
                      setOpenDialogCancelApprove(true);
                      setSelectDataBooking(item);
                    }}
                  >
                    {t("ยกเลิก")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Dialogs ──────────────────────────────────────── */}
      {/* Pay Image */}
      <Modal
        centered
        className="wrap-container-DialogPay"
        open={openDialogPay}
        onOk={() => setOpenDialogPay(false)}
        onCancel={() => setOpenDialogPay(false)}
      >
        <div className="ImagePay">
          <img
            src={getImagePath("booking", userInfo?.dbname, selectImagePay)}
            alt="slip"
          />
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>{t("ยืนยันการลบ")}</h1>
        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              isStatusDelete();
              setOpenDialogConfirmDelete(false);
            }}
          >
            {t("ยืนยัน")}
          </button>
          <button onClick={() => setOpenDialogConfirmDelete(false)}>
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>

      {/* Confirm Approve */}
      <Modal
        centered
        className="wrap-container-DialogApprove"
        open={openDialogConfirmApprove}
        onCancel={() => setOpenDialogConfirmApprove(false)}
      >
        <h1>{t("ยืนยันการชำระสำเร็จ")}</h1>
        <div className="btn-DialogApprove-Navbar">
          <button
            type="button"
            onClick={() => {
              onSubmit();
              setOpenDialogConfirmApprove(false);
            }}
          >
            {t("ยืนยัน")}
          </button>
          <button onClick={() => setOpenDialogConfirmApprove(false)}>
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>

      {/* Confirm Cancel */}
      <Modal
        centered
        className="wrap-container-DialogApprove"
        open={openDialogCancelApprove}
        onCancel={() => setOpenDialogCancelApprove(false)}
      >
        <h1>{t("ยืนยันการยกเลิก")}</h1>
        <div className="btn-DialogApprove-Navbar">
          <button
            type="button"
            onClick={() => {
              cancel();
              setOpenDialogCancelApprove(false);
            }}
          >
            {t("ยืนยัน")}
          </button>
          <button onClick={() => setOpenDialogCancelApprove(false)}>
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default BookingAdminPage;
