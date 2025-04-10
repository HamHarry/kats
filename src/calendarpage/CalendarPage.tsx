import { Badge, Calendar, CalendarProps, Typography } from "antd";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus, BookingData } from "../model/booking.type";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../stores/store";
import { getAllBookings } from "../stores/slices/bookingSlice";
import CircleLoading from "../shared/circleLoading";
import "../bookingpagekats/BookingPageKats.css";

const CalendarPage = () => {
  const dispath = useAppDispatch();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookings()
      ).unwrap();

      setBookings(bookingsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const getStatus = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "warning";
      case BookingStatus.PAID:
        return "processing";
      case BookingStatus.COMPLETED:
        return "success";
      case BookingStatus.CANCELED:
        return "error";

      default:
        return "default";
    }
  };

  const renderBookedCalendar = (bookingData: BookingData) => {
    const { bookTime, status, carType, carModel } = bookingData;

    return (
      <div
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        <Badge status={getStatus(status)} />
        <Typography className="text-c" style={{ textWrap: "nowrap" }}>
          {bookTime} {carType} {carModel}
        </Typography>
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current) => {
    const bookingData = bookings.filter((data) =>
      dayjs(data.bookDate).isSame(current, "date")
    );

    return (
      <div className="booking">
        {bookingData.map((data, index) => {
          return <div key={index}>{renderBookedCalendar(data)}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="container-orderpage">
      <div className="header-orderpage">
        <img src="/public/assets/katoon.png" alt="katoon" />
        <Typography className="text-header">ตรวจสอบคิว</Typography>
      </div>

      <div className="wrap-calendar">
        <Calendar cellRender={cellRender} />
      </div>

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default CalendarPage;
