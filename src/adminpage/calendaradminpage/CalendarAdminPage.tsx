import "./CalendarAdminPage.css";
import { Badge, Calendar, CalendarProps, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/store";
import { getAllBookings } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { useNavigate } from "react-router-dom";

const CalendarAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState<BookingData[]>([]);
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
    const bookings = bookingData.filter((data) =>
      dayjs(data.bookDate).isSame(current, "date")
    );

    return (
      <div className="booking">
        {bookings.map((data, index) => {
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

      <div className="guid">
        <div className="guid-yellow">
          <div className="box-yellow"></div>
          <p>กำลังรอการชำระ</p>
        </div>
        <div className="guid-blue">
          <div className="box-blue"></div>
          <p>จ่ายสำเร็จ</p>
        </div>
        <div className="guid-green">
          <div className="box-green"></div>
          <p>ใช้บริการสำเร็จ</p>
        </div>
        <div className="guid-red">
          <div className="box-red"></div>
          <p>ยกเลิก</p>
        </div>
      </div>

      <div className="wrap-calendarAdmin">
        <Calendar
          cellRender={cellRender}
          onSelect={(targetDate) => {
            navigate(
              `/admin/booking/create?targetDate=${targetDate.toISOString()}`
            );
          }}
        />
      </div>

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default CalendarAdminPage;
