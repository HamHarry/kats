import "./CalendarAdminPage.css";
import { Badge, Calendar, CalendarProps, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { guarantee } from "../../data/MockUpGuarantee";
import { BookingStatus, Guarantees } from "../../model/guarantee.type";

const CalendarAdminPage = () => {
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

  const renderBookedCalendar = (bookingData: Guarantees) => {
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
    <div className="container-calendarAdmin">
      <div className="header-calendarAdmin">
        <h1>Calendar</h1>
      </div>

      <div className="wrap-calendarAdmin">
        <Calendar cellRender={cellRender} />
      </div>
    </div>
  );
};

export default CalendarAdminPage;
