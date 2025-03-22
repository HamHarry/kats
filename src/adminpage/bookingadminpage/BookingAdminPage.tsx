import { useCallback, useEffect, useState } from "react";
import "./BookingAdminPage.css";
import { useNavigate } from "react-router-dom";
import { Bookings, BookingStatus } from "../../model/booking.type";
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
  getAllBookings,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [bookingData, setBookingData] = useState<Bookings[]>([]);
  const [selectBookingId, setSelectBookingId] = useState<string>();
  const [selectDataBooking, setSelectDataBooking] = useState<Bookings>();
  const [selectImagePay, setSelectImagePay] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [openDialogConfirmApprove, setOpenDialogConfirmApprove] =
    useState<boolean>(false);
  const [openDialogPay, setOpenDialogPay] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookings()
      ).unwrap();

      setBookingData(bookingsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

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
        const data: Bookings = {
          ...selectDataBooking,
          status: BookingStatus.PAID,
        };
        console.log(data);

        await dispath(approveBookingById(data)).unwrap();
      } else if (selectDataBooking.status === 1) {
        const data: Bookings = {
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
    return (
      <div className="btn-menu">
        <select onChange={() => {}}>
          <option value={"All"}>All</option>
          <option value={"001"}>001</option>
          <option value={"002"}>002</option>
          <option value={"003"}>003</option>
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
            placeholder="Search...(Name,Phone,Number,Volumer)"
            onChange={() => {}}
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
        {bookingData.map((item, index) => {
          const productType = item.product.productType;

          const formattedDate = item.bookDate
            ? dayjs.utc(item.bookDate).local().format("D/M") +
              "/" +
              (dayjs.utc(item.bookDate).year() + 543)
            : "ไม่ระบุวันที่";

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
                <p>ชื่อ: {item.name}</p>
                <p>เบอร์: {item.tel}</p>
                <p>เลขที่: {item.number}</p>
                <p>เล่มที่: {item.receiptBookNo}</p>
                <p>
                  สินค้า: {item.product.name} {item.price.amount}
                </p>
                <p>
                  รถ: {item.carType} {item.carModel}
                </p>
                <div
                  className={
                    item.status === BookingStatus.COMPLETED
                      ? "licensePlate-approve-none"
                      : "licensePlate-approve"
                  }
                >
                  <p>
                    ทะเบียน: {item.licensePlate} {item.province}
                  </p>
                  <button
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
