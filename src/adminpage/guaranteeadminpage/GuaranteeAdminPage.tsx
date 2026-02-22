import { useCallback, useEffect, useState } from "react";
import "./GuaranteeAdminPage.css";
import {
  BookingStatus,
  BookingData,
  CarStructure,
} from "../../model/booking.type";
import { useAppDispatch } from "../../stores/store";
import CircleLoading from "../../shared/circleLoading";
import {
  getAllBookingPaginations,
  getBookingById,
  isDeleteBookingById,
  setBookingUpdateImg,
  updateGuaranteeByBookingId,
} from "../../stores/slices/bookingSlice";
import dayjs from "dayjs";
import { Modal, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { cloneDeep, debounce } from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePickerStyle, StyledSelect } from "../../AppStyle";
import { DeleteStatus } from "../../model/delete.type";
import { getImagePath } from "../../shared/utils/common";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { uploadFile } from "../../services/coreService";

export interface GuaranteeForm {
  guarantees: CarStructure[];
}

const defaultValues: GuaranteeForm = { guarantees: [] };

const bookingTimeList = [
  { time: "08:00" },
  { time: "09:00" },
  { time: "10:00" },
  { time: "11:00" },
  { time: "12:00" },
  { time: "13:00" },
  { time: "14:00" },
  { time: "15:00" },
  { time: "16:00" },
  { time: "17:00" },
];

/* ── helpers ─────────────────────────────────────────── */
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

/* ── component ───────────────────────────────────────── */
const GuaranteeAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(userInfoSelector);

  const [timeData] = useState(bookingTimeList);
  const [isGuaranteeLoading, setIsGuaranteeLoading] = useState(false);

  const [booking, setBooking] = useState<BookingData>();
  const [selectBookingId, setSelectBookingId] = useState<string>();

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [selectbookingData, setSelectBookingData] = useState<BookingData>();
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [imageFile, setImageFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [openDialogProfile, setOpenDialogProfile] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceiptBookNo, setSelectedReceiptBookNo] = useState("all");
  const [selectedProductName, setSelectedProductName] = useState("all");

  const { control, reset, handleSubmit } = useForm<GuaranteeForm>({
    defaultValues,
  });
  const guaranteeField = useFieldArray({ name: "guarantees", control });

  /* ── data fetching ──────────────────────────────────── */
  const fetchAllBooking = useCallback(async () => {
    try {
      setIsGuaranteeLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookingPaginations({
          term: searchTerm,
          receiptBookNo: selectedReceiptBookNo,
          productName: selectedProductName,
        }),
      ).unwrap();
      const finedData = bookingsRes.filter(
        (item: BookingData) =>
          (item.status === BookingStatus.COMPLETED ||
            item.status === BookingStatus.CHECKING) &&
          item.delete === DeleteStatus.ISNOTDELETE,
      );
      setBookingDatas(finedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  }, [dispath, searchTerm, selectedProductName, selectedReceiptBookNo]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const fetchBookingById = useCallback(async () => {
    try {
      if (!selectBookingId) return;
      setIsGuaranteeLoading(true);
      const { data: bookingRes } = await dispath(
        getBookingById(selectBookingId),
      ).unwrap();
      setBooking(bookingRes);
      const guarantees: CarStructure[] = bookingRes?.guarantees || [];
      const clonedGuarantees = cloneDeep(guarantees);
      Array.from({ length: 10 - clonedGuarantees.length }, (_, i) => {
        clonedGuarantees.push({
          serviceNo: guarantees.length + i + 1,
          serviceDate: "",
          status: BookingStatus.PENDING,
          isBeam: false,
          isWheelArch: false,
          isControlArm: false,
          isChassis: false,
          isUnderbody: false,
          serviceTime: "",
        });
      });
      reset({ guarantees: clonedGuarantees });
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  }, [dispath, reset, selectBookingId]);

  useEffect(() => {
    fetchBookingById();
  }, [fetchBookingById]);

  const initailGuaranteeLites = useCallback(() => {
    if (!bookingDataLites.length) setBookingDataLites(bookingDatas);
  }, [bookingDataLites, bookingDatas]);

  useEffect(() => {
    initailGuaranteeLites();
  }, [initailGuaranteeLites]);

  const handleSetSearchTerm = debounce((value) => setSearchTerm(value), 500);

  /* ── actions ────────────────────────────────────────── */
  const submit = async (data: GuaranteeForm) => {
    try {
      if (!booking) return;
      setIsGuaranteeLoading(true);
      const filterGuarantees = data.guarantees.filter(
        (item) => item.serviceDate,
      );
      if (!filterGuarantees.length) return;
      let imageName = "";
      if (imageFile) {
        imageName = await uploadFile(imageFile);
        dispath(setBookingUpdateImg({ imageName }));
      }
      await dispath(
        updateGuaranteeByBookingId({
          bookingId: booking._id,
          data: { ...booking, guarantees: filterGuarantees, image: imageName },
        }),
      ).unwrap();
      setOpenDialogProfile(false);
      fetchAllBooking();
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  };

  const deleted = async () => {
    try {
      setIsGuaranteeLoading(true);
      if (!selectbookingData?._id) return;
      await dispath(
        isDeleteBookingById({
          ...selectbookingData,
          delete: DeleteStatus.ISDELETE,
        }),
      ).unwrap();
      setOpenDialogDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
      fetchAllBooking();
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  /* ── filter menus ───────────────────────────────────── */
  const receiptBookNoList = bookingDataLites
    .map((b) => b.receiptBookNo)
    .filter((v, i, s) => s.indexOf(v) === i);

  const productNameList = bookingDataLites
    .map((b) => b.product.name)
    .filter((v, i, s) => s.indexOf(v) === i);

  /* ── guarantee table rows ───────────────────────────── */
  const renderGuarantee = () =>
    guaranteeField.fields.map((item, index) => {
      const isFirstGuarantee = index === 0;
      const isCompleted = item.status === BookingStatus.COMPLETED;
      const disable = isFirstGuarantee || isCompleted;
      return (
        <tr key={index} className="hover:bg-[#f5fdf8] cursor-pointer h-[50px]">
          <td>{item.serviceNo}</td>
          <td>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <Controller
                name={`guarantees.${index}.serviceTime`}
                control={control}
                render={({ field }) => (
                  <div className="input-time">
                    <StyledSelect
                      {...field}
                      placeholder="เลือกเวลา"
                      disabled={disable}
                      value={field.value || undefined}
                      options={timeData.map((t) => ({
                        label: `${t.time} น.`,
                        value: t.time,
                      }))}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={`guarantees.${index}.serviceDate`}
                render={({ field }) => (
                  <DatePickerStyle
                    className="input-date"
                    disabled={disable}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date?.toISOString() ?? "")
                    }
                  />
                )}
              />
            </div>
          </td>
          {(
            [
              "isBeam",
              "isWheelArch",
              "isControlArm",
              "isChassis",
              "isUnderbody",
            ] as const
          ).map((key) => (
            <td key={key}>
              <Controller
                control={control}
                name={`guarantees.${index}.${key}`}
                render={({ field }) => (
                  <input
                    className="checkbox"
                    type="checkbox"
                    disabled={disable}
                    checked={field.value as boolean}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </td>
          ))}
        </tr>
      );
    });

  /* ── booking detail modal ───────────────────────────── */
  const renderBookingModal = () => (
    <Modal
      centered
      className={
        booking?.product.name === "KATS Coating"
          ? "wrap-container-Edit-Profile-kats"
          : "wrap-container-Edit-Profile-gun"
      }
      open={openDialogProfile}
      width="60%"
      onCancel={() => {
        setBooking(undefined);
        setSelectBookingId(undefined);
        setImageUrl(undefined);
        setOpenDialogProfile(false);
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        {/* Modal Header */}
        <div className="container-Edit-Profile-Navbar">
          <button type="submit">
            <h3>บันทึก</h3>
          </button>
          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setBooking(undefined);
              setSelectBookingId(undefined);
              setImageUrl(undefined);
              setOpenDialogProfile(false);
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="content-Profile">
          <div className="card-profile">
            <div className="wrap-card-profile">
              {/* Image upload */}
              <div className="ImageProfile">
                {imageUrl || booking?.image ? (
                  <img
                    className="IsImageProfile"
                    src={
                      imageUrl ||
                      getImagePath("booking", userInfo?.dbname, booking?.image)
                    }
                    alt="ภาพรถ"
                  />
                ) : (
                  <div className="IsNotImageProfile">ไม่มีรูปภาพ</div>
                )}
                <label htmlFor="guarantee-file">
                  <i className="fa-solid fa-camera" />
                </label>
                <input type="file" id="guarantee-file" onChange={uploadImage} />
              </div>

              {/* Info grid */}
              <div className="text-all">
                <div className="modal-info-item">
                  <span className="modal-info-label">เลขที่</span>
                  <span className="modal-info-value">{booking?.number}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">สาขา</span>
                  <span className="modal-info-value">ลาดกระบัง</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">เล่มที่</span>
                  <span className="modal-info-value">
                    {booking?.receiptBookNo}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">วันที่</span>
                  <span className="modal-info-value">
                    {dayjs(booking?.bookDate).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">ชื่อ</span>
                  <span className="modal-info-value">{booking?.name}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">เบอร์</span>
                  <span className="modal-info-value">{booking?.tel}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">รถยนต์</span>
                  <span className="modal-info-value">
                    {booking?.carType} {booking?.carModel}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">ทะเบียน</span>
                  <span className="modal-info-value">
                    {booking?.licensePlate} {booking?.province}
                  </span>
                </div>
                <div className="modal-info-item full">
                  <span className="modal-info-label">ประกันสินค้า</span>
                  <span className="modal-info-value accent">
                    {booking?.product.name} — {booking?.price.amount} บาท
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-divider" />

            {/* Guarantee table */}
            <div className="guarante-date">
              <table>
                <thead>
                  <tr>
                    <th>ครั้งที่</th>
                    <th>วันที่เข้ารับบริการ</th>
                    <th>คาน</th>
                    <th>ซุ้มล้อ</th>
                    <th>ปีกนก</th>
                    <th>แชสซี่ส์</th>
                    <th>ใต้ท้อง</th>
                  </tr>
                </thead>
                <tbody>{renderGuarantee()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );

  /* ── delete dialog ──────────────────────────────────── */
  const renderDialogDelete = () => (
    <Modal
      centered
      className="wrap-container-DialogConfirm"
      open={openDialogDelete}
      onCancel={() => setOpenDialogDelete(false)}
    >
      <h1>ยืนยันการลบ</h1>
      <div className="btn-DialogConfirm-Navbar">
        <button
          type="button"
          onClick={() => {
            setOpenDialogDelete(false);
            deleted();
          }}
        >
          ยืนยัน
        </button>
        <button onClick={() => setOpenDialogDelete(false)}>ยกเลิก</button>
      </div>
    </Modal>
  );

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="container-guaranteeAdmin">
      {/* Header */}
      <div className="header-guaranteeAdmin">
        <h1>ข้อมูลรับประกัน</h1>
      </div>

      {/* Search / Filter */}
      <div className="search-guaranteeAdmin">
        <div className="btn-menu">
          <select onChange={(e) => setSelectedReceiptBookNo(e.target.value)}>
            <option value="all">ทั้งหมด</option>
            {receiptBookNoList.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedProductName(e.target.value)}>
            <option value="all">ทุกสินค้า</option>
            {productNameList.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search… (Name, Phone, Number)"
            onChange={(e) => handleSetSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="wrap-container-guaranteeAdmin">
        {bookingDatas.length === 0 && !isGuaranteeLoading && (
          <div className="guarantee-empty">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p>ไม่มีข้อมูลการรับประกัน</p>
          </div>
        )}

        {bookingDatas.map((item, index) => {
          const productType = item.product.typeProductSnapshot.name;
          const isGun = productType === "GUN";
          const statusMeta = getStatusMeta(item.status);
          const formattedDate = item.bookDate
            ? dayjs(item.bookDate).format("DD/MM/YYYY")
            : "-";

          const completedCount =
            item.guarantees?.filter((g) => g.status === BookingStatus.COMPLETED)
              .length ?? 0;
          const totalGuarantees = item.guarantees?.length ?? 0;

          return (
            <div
              key={index}
              className={`grid-guaranteeAdmin ${isGun ? "type-gun" : "type-coat"}`}
            >
              {/* Card Header */}
              <div className="guaranteeAdmin-card-header">
                <div className="guaranteeAdmin-image">
                  <img
                    src={getImagePath("booking", userInfo?.dbname, item?.image)}
                    alt={item.product.name}
                  />
                </div>
                <div className="guaranteeAdmin-header-meta">
                  <p className="guaranteeAdmin-product-name">
                    {item.product.name}
                  </p>
                  <div className="guaranteeAdmin-date-time">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
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
                  </div>
                </div>
                <span className={`status-badge ${statusMeta.key}`}>
                  <span className="status-badge-dot" />
                  {statusMeta.label}
                </span>
              </div>

              {/* Card Body */}
              <div className="guaranteeAdmin-card-body">
                <div className="guarantee-info-grid">
                  <div className="info-item">
                    <span className="info-label">ชื่อ</span>
                    <span className="info-value">{item.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">เบอร์</span>
                    <span className="info-value">{item.tel}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">เลขที่</span>
                    <span className="info-value">{item.number}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">เล่มที่</span>
                    <span className="info-value">{item.receiptBookNo}</span>
                  </div>
                  <div className="info-item full">
                    <span className="info-label">สินค้า / ราคา</span>
                    <span
                      className={`info-value accent ${isGun ? "gun" : "coat"}`}
                    >
                      {item.product.name} — {item.price.amount} บาท
                    </span>
                  </div>

                  <div
                    className="info-divider"
                    style={{ gridColumn: "1 / -1" }}
                  />

                  <div className="info-item">
                    <span className="info-label">รถ</span>
                    <span className="info-value">
                      {item.carType} {item.carModel}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ทะเบียน</span>
                    <span className="info-value">
                      {item.licensePlate} {item.province}
                    </span>
                  </div>
                </div>

                {/* Progress pips */}
                {totalGuarantees > 0 && (
                  <div className="guarantee-progress">
                    <span className="guarantee-progress-label">
                      ประกัน {completedCount}/10
                    </span>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`guarantee-pip ${
                          i < completedCount
                            ? "done"
                            : i === completedCount &&
                                completedCount < totalGuarantees
                              ? "active"
                              : ""
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="guaranteeAdmin-card-footer">
                <div className="footer-actions">
                  <Tooltip title="ประวัติการรับประกัน">
                    <button
                      className="icon-btn history"
                      onClick={() => {
                        setSelectBookingId(item._id);
                        setOpenDialogProfile(true);
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
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </button>
                  </Tooltip>

                  <Tooltip title="แก้ไขข้อมูล">
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        navigate(`/admin/guarantee/edit/${item._id}`)
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
                        setOpenDialogDelete(true);
                        setSelectBookingData(item);
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {renderBookingModal()}
      {renderDialogDelete()}

      <CircleLoading open={isGuaranteeLoading} />
    </div>
  );
};

export default GuaranteeAdminPage;
