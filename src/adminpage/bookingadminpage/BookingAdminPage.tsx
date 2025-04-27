import { useCallback, useEffect, useState } from "react";
import "./BookingAdminPage.css";
import { useNavigate } from "react-router-dom";
import { BookingData, BookingStatus } from "../../model/booking.type";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  PayCircleFilled,
} from "@ant-design/icons";
import { ProductType } from "../../model/product.type";
import { useAppDispatch } from "../../stores/store";
import {
  approveBookingById,
  getAllBookingPaginations,
  isDeleteBookingById,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { DeleteStatus } from "../../model/delete.type";

const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [selectDataBooking, setSelectDataBooking] = useState<BookingData>();
  const [selectImagePay, setSelectImagePay] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState<boolean>(false);
  const [openDialogCancelApprove, setOpenDialogCancelApprove] =
    useState<boolean>(false);
  const [openDialogPay, setOpenDialogPay] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReceiptBookNo, setSelectedReceiptBookNo] =
    useState<string>("all");

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);

      const query = {
        term: searchTerm,
        receiptBookNo: selectedReceiptBookNo,
      };

      const { data: bookingsRes = [] } = await dispath(
        getAllBookingPaginations(query)
      ).unwrap();

      const filteredExpenses = bookingsRes.filter((item: BookingData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setBookingDatas(filteredExpenses);
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

  const approved = async () => {
    try {
      setIsBookingLoading(true);
      if (!selectDataBooking?._id) return;

      const data: BookingData = {
        ...selectDataBooking,
        status: BookingStatus.COMPLETED,
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

      await dispath(approveBookingById(data)).unwrap();
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
          <option value="all">All</option>

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
          <img src={selectImagePay} alt="" />
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
              isStatusDelete();
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

  const rederDialogConfirmApprove = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogApprove"
        open={openDialogConfirmApprove}
        onCancel={() => setOpenDialogConfirmApprove(false)}
      >
        <h1>ยืนยันการชำระสำเร็จ</h1>

        <div className="btn-DialogApprove-Navbar">
          <button
            type="button"
            onClick={() => {
              approved();
              setOpenDialogConfirmApprove(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmApprove(false);
            }}
          >
            ยกเลิก
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
        <h1>ยืนยันการยกเลิก</h1>

        <div className="btn-DialogApprove-Navbar">
          <button
            type="button"
            onClick={() => {
              cancel();
              setOpenDialogCancelApprove(false);
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

  return (
    <div className="container-BookingAdmin">
      <div className="header-BookingAdmin">
        <h1>Bookings</h1>
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
            สร้าง
          </button>
        </div>
      </div>
      <div className="wrap-container-BookingAdmin">
        {bookingDatas.map((item, index) => {
          const productType = item.product.productType;

          const formattedDate = item.bookDate
            ? dayjs(item.bookDate).format("DD/MM/YYYY")
            : "-";

          return (
            <div
              key={index}
              className="grid-BookingAdmin"
              style={{
                backgroundColor:
                  productType === ProductType.GUN ? "#043829" : "#2656A2",
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
                  <p>วันที่: {formattedDate}</p>
                  <div className="icon">
                    {item.status === 0 ? (
                      <ClockCircleFilled className="icon-check-wait" />
                    ) : item.status === 1 ? (
                      <i className="fa-solid fa-circle"></i>
                    ) : item.status === 2 ? (
                      <CheckCircleFilled className="icon-check-complete" />
                    ) : (
                      <CloseCircleFilled className="icon-check-cancel" />
                    )}
                    <PayCircleFilled
                      className="icon-pay"
                      onClick={() => {
                        setSelectImagePay(item.image);
                        setOpenDialogPay(true);
                      }}
                    />
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        if (item._id) {
                          navigate(`/admin/booking/edit/${item._id}`);
                        }
                      }}
                    ></i>
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => {
                        setOpenDialogConfirmDelete(true);
                        setSelectDataBooking(item);
                      }}
                    ></i>
                  </div>
                </div>
                <p>ชื่อ: คุณ{item.name}</p>
                <p>เบอร์: {item.tel}</p>
                <p>เลขที่: {item.number}</p>
                <p>เล่มที่: {item.receiptBookNo}</p>
                <p>
                  สินค้า: {item.product.name} {item.price.amount} บาท
                </p>
                <p>
                  รถ: {item.carType} {item.carModel}
                </p>
                <div className="licensePlate-approve">
                  <p>
                    ทะเบียน: {item.licensePlate} {item.province}
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
                      สำเร็จ
                    </button>

                    <button
                      onClick={() => {
                        setOpenDialogCancelApprove(true);
                        setSelectDataBooking(item);
                      }}
                    >
                      ยกเลิก
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
