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
  deleteBookingById,
  getAllBookingPaginations,
  getAllBookings,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";

const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [selectBookingId, setSelectBookingId] = useState<string>();
  const [selectDataBooking, setSelectDataBooking] = useState<BookingData>();
  const [selectImagePay, setSelectImagePay] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
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

      setBookingDatas(bookingsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath, searchTerm, selectedReceiptBookNo]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const fetchAllBookingLite = useCallback(async () => {
    const { data: allBookings = [] } = await dispath(getAllBookings()).unwrap();

    setBookingDataLites(allBookings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAllBookingLite();
  }, [fetchAllBookingLite]);

  const handleSetSearchTerm = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const deleted = async () => {
    try {
      if (!selectBookingId) return;

      setIsBookingLoading(true);
      await dispath(deleteBookingById(selectBookingId)).unwrap();

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

      if (selectDataBooking.status === 0) {
        const data: BookingData = {
          ...selectDataBooking,
          status: BookingStatus.PAID,
        };
        console.log(data);

        await dispath(approveBookingById(data)).unwrap();
      } else if (selectDataBooking.status === 1) {
        const data: BookingData = {
          ...selectDataBooking,
          status: BookingStatus.COMPLETED,
        };
        console.log(data);

        await dispath(approveBookingById(data)).unwrap();
      }
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

  const rederDialogConfirmApprove = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogApprove"
        open={openDialogConfirmApprove}
        onCancel={() => setOpenDialogConfirmApprove(false)}
      >
        <h1>ยืนยันการอนุมัติ</h1>

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
                      ? "/public/assets/logokats.jpg"
                      : "/public/assets/logoGun.jpg"
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
                        setSelectBookingId(item._id);
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
                  <button
                    className={
                      item.status === BookingStatus.COMPLETED
                        ? "btn-approve-none"
                        : "btn-approve"
                    }
                    onClick={() => {
                      setOpenDialogConfirmApprove(true);
                      setSelectDataBooking(item);
                    }}
                  >
                    อนุมัติ
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {rederDialogConfirmDelete()}
      {rederDialogConfirmApprove()}
      {renderDialogPay()}
      <CircleLoading open={isBookingLoading} />
    </div>
  );
};
export default BookingAdminPage;
