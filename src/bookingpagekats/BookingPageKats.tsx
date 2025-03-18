import { Badge, Calendar, CalendarProps, Typography } from "antd";
import "./BookingPageKats.css";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import { guarantee } from "../data/MockUpGuarantee";
import { BookingStatus, Bookings } from "../model/booking.type";

const BookingPageKats = () => {
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

  const renderBookedCalendar = (bookingData: Bookings) => {
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
    const bookingData = guarantee.filter((data) =>
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
    </div>
  );
};

export default BookingPageKats;
