import { useCallback, useEffect, useState } from "react";
import "./BookingAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { BookingData, BookingStatus } from "../../model/booking.type";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  PayCircleFilled,
} from "@ant-design/icons";
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

const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { t, i18n } = useTranslation();
  const userInfo = useSelector(userInfoSelector);
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [selectDataBooking, setSelectDataBooking] = useState<BookingData>();
  const [selectImagePay, setSelectImagePay] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] = useState<boolean>(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] = useState<boolean>(false);
  const [openDialogPay, setOpenDialogPay] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReceiptBookNo, setSelectedReceiptBookNo] = useState<string>("all");

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);

      const query = {
        term: searchTerm,
        receiptBookNo: selectedReceiptBookNo,
      };

      const { data: bookingsRes = [] } = await dispath(getAllBookingPaginations(query)).unwrap();

      const filteredBookings = bookingsRes.filter((item: BookingData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setBookingDatas(filteredBookings);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath, searchTerm, selectedReceiptBookNo]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const initailBookingLites = useCallback(() => {
    if (!bookingDataLites.length) {
      setBookingDataLites(bookingDatas);
    }
  }, [bookingDataLites, bookingDatas]);

  useEffect(() => {
    initailBookingLites();
  }, [initailBookingLites]);

  const handleSetSearchTerm = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const isStatusDelete = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;

      const data: BookingData = {
        ...selectDataBooking,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteBookingById(data)).unwrap();

      setOpenDialogConfirmDelete(false);
    } catch (error) {
      console.log(error);
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

      const data: BookingData = {
        ...selectDataBooking,
        status,
      };

      await dispath(approveBookingById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
      fetchAllBooking();
    }
  };

  const cancel = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;

      const data: BookingData = {
        ...selectDataBooking,
        status: BookingStatus.CANCELED,
      };

      await dispath(cancelBookingById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
      fetchAllBooking();
    }
  };

  const selectMenu = () => {
    const receiptBookNoList = bookingDataLites
      .map((booking) => booking.receiptBookNo)
      .filter((value, index, self) => self.indexOf(value) === index);

    return (
      <div className="btn-menu">
        <select onChange={(e) => setSelectedReceiptBookNo(e.target.value)}>
          <option value="all">{t("ทั้งหมด")}</option>

          {receiptBookNoList.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const renderDialogPay = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogPay"
        open={openDialogPay}
        onOk={() => {
          setOpenDialogPay(false);
        }}
        onCancel={() => setOpenDialogPay(false)}
      >
        <div className="ImagePay">
          <img src={getImagePath("booking", userInfo?.dbname, selectImagePay)} alt="" />
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
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmApprove = () => {
    return (
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
          <button
            onClick={() => {
              setOpenDialogConfirmApprove(false);
            }}
          >
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogCancelApprove = () => {
    return (
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
          <button
            onClick={() => {
              setOpenDialogCancelApprove(false);
            }}
          >
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-BookingAdmin">
      <div className="header-BookingAdmin">
        <h1>{t("จองคิว")}</h1>
      </div>
      <div className="search-BookingAdmin">
        <div>{selectMenu()}</div>
        <div className="search-content-right">
          <input
            type="text"
            placeholder="Search...(Name,Phone,Number)"
            onChange={(e) => handleSetSearchTerm(e.target.value)}
          />
          <button
            className="btn-crate"
            type="button"
            onClick={() => navigate("/admin/booking/create")}
          >
            {t("สร้าง")}
          </button>
        </div>
      </div>
      <div className="wrap-container-BookingAdmin">
        {bookingDatas.map((item, index) => {
          const productType = item.product.typeProductSnapshot.name;

          const completedGuarantees =
            item.guarantees?.filter((g) => g.status === BookingStatus.COMPLETED) ?? [];

          const currentGuarantee = item.guarantees?.[completedGuarantees.length];

          const bookDate = currentGuarantee?.serviceDate || item.bookDate;

          const formattedDate = dayjs(bookDate).format("DD/MM/YYYY");

          return (
            <div
              key={index}
              className="grid-BookingAdmin"
              style={{
                backgroundColor: productType === "GUN" ? "#043829" : "#2656A2",
              }}
            >
              <div className="BookingAdmin-image">
                <img
                  src={
                    item.product.name === "KATS Coating"
                      ? "/assets/logokats.jpg"
                      : "/assets/logoGun.jpg"
                  }
                  alt="Image"
                />
              </div>
              <div className="BookingAdmin-content">
                <div className="text-p">
                  <p>
                    {t("วันที่")}: {formattedDate}
                  </p>
                  <div className="icon">
                    {item.status === BookingStatus.PENDING ? (
                      <Tooltip title="รอการชำระ">
                        <ClockCircleFilled className="icon-check-wait" />
                      </Tooltip>
                    ) : item.status === BookingStatus.PAID ? (
                      <Tooltip title="จ่ายเงินแล้ว">
                        <i className="fa-solid fa-circle"></i>
                      </Tooltip>
                    ) : item.status === BookingStatus.COMPLETED ? (
                      <Tooltip title="สำเร็จ">
                        <CheckCircleFilled className="icon-check-complete" />
                      </Tooltip>
                    ) : item.status === BookingStatus.CANCELED ? (
                      <Tooltip title="ยกเลิก">
                        <CloseCircleFilled className="icon-check-cancel" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="ตรวจสภาพรถยนต์">
                        <i className="fa-solid fa-wrench"></i>
                      </Tooltip>
                    )}

                    <Tooltip title="รูปภาพการชำระเงิน">
                      <PayCircleFilled
                        className="icon-pay"
                        onClick={() => {
                          setSelectImagePay(item.slip);
                          setOpenDialogPay(true);
                        }}
                      />
                    </Tooltip>

                    <Tooltip title="แก้ไขข้อมูล">
                      <i
                        className="fa-solid fa-pen-to-square"
                        onClick={() => {
                          if (item._id) {
                            navigate(`/admin/booking/edit/${item._id}`);
                          }
                        }}
                      ></i>
                    </Tooltip>

                    <Tooltip title="ลบข้อมูล">
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => {
                          setOpenDialogConfirmDelete(true);
                          setSelectDataBooking(item);
                        }}
                      ></i>
                    </Tooltip>
                  </div>
                </div>
                <p>
                  {t("ชื่อ")}: {item.name}
                </p>
                <p>
                  {t("โทรศัพท์")}: {item.tel}
                </p>
                <p>
                  {t("เลขที่")}: {item.number}
                </p>
                <p>
                  {t("เล่มที่")}: {item.receiptBookNo}
                </p>
                <p>
                  {t("สินค้า")}: {item.product.name} {item.price.amount} {t("บาท")}
                </p>
                <p>
                  {t("รถ")}: {item.carType} {item.carModel}
                </p>
                <div className="licensePlate-approve">
                  <p>
                    {t("ทะเบียน")}: {item.licensePlate} {item.province}
                  </p>

                  <div
                    className={
                      item.status === BookingStatus.COMPLETED ||
                      item.status === BookingStatus.CANCELED
                        ? "btn-approve-none"
                        : "btn-approve"
                    }
                  >
                    <button
                      onClick={() => {
                        setOpenDialogConfirmApprove(true);
                        setSelectDataBooking(item);
                      }}
                    >
                      {t("สำเร็จ")}
                    </button>

                    <button
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
            </div>
          );
        })}
      </div>
      {rederDialogConfirmDelete()}
      {rederDialogConfirmApprove()}
      {rederDialogCancelApprove()}
      {renderDialogPay()}
      <CircleLoading open={isBookingLoading} />
    </div>
  );
};
export default BookingAdminPage;
