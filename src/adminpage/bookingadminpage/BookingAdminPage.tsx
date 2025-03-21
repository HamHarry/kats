import { useCallback, useEffect, useState } from "react";
import "./BookingAdminPage.css";
import { useNavigate } from "react-router-dom";
import { Bookings } from "../../model/booking.type";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  PayCircleFilled,
} from "@ant-design/icons";
import { ProductType } from "../../model/product.type";
import { useAppDispatch } from "../../stores/store";
import {
  deleteBookingById,
  getAllBookings,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";

const BookingAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [bookingData, setBookingData] = useState<Bookings[]>([]);
  const [selectBookingId, setSelectBookingId] = useState<string>();
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
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

      setOpenDialogConfirm(false);
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
      <dialog open={openDialogPay}>
        <div className="container-DialogPay">
          <div className="wrap-container-DialogPay">
            <div className="container-DialogPay-Navbar">
              <CloseCircleFilled
                className="icon-close"
                onClick={() => {
                  setOpenDialogPay(false);
                }}
              />
            </div>
            <div className="ImagePay">
              <img src="/public/assets/pay/TestPay.jpg" alt="pay" />
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  const rederDialogConfirm = () => {
    return (
      <dialog open={openDialogConfirm}>
        <div className="container-DialogConfirmDelete">
          <div className="wrap-container-DialogConfirmDelete">
            <div className="container-DialogConfirmDelete-Navbar">
              <CloseCircleFilled
                className="icon-close"
                onClick={() => {
                  setOpenDialogConfirm(false);
                }}
              />
            </div>
            <h1>ยืนยันการลบ</h1>
            <div className="btn-DialogConfirmDelete-Navbar">
              <button
                type="submit"
                className="btn-submit-dialogConfirmDelete"
                onClick={() => {
                  deleted();
                }}
              >
                ยืนยัน
              </button>
              <button className="btn-edit-dialogConfirmDelete">ยกเลิก</button>
            </div>
          </div>
        </div>
      </dialog>
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
                <img src={item.image} alt="Image" />
              </div>
              <div className="BookingAdmin-content">
                <div className="text-p">
                  <p>วันที่: {item.bookDate}</p>
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
                        setOpenDialogConfirm(true);
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
                <div className="licensePlate-approve">
                  <p>ทะเบียน: {item.licensePlate}</p>
                  <button className="btn-approve">อนุมัติ</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {rederDialogConfirm()}
      {renderDialogPay()}
      <CircleLoading open={isBookingLoading} />
    </div>
  );
};
export default BookingAdminPage;
