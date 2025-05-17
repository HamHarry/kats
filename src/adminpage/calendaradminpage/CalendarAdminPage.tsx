import "./CalendarAdminPage.css";
import { Badge, Calendar, CalendarProps, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/store";
import { getAllBookings } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";

const CalendarAdminPage = () => {
  const dispath = useAppDispatch();

  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookings()
      ).unwrap();

      const filteredBookings = bookingsRes.filter((item: BookingData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setBookingData(filteredBookings);
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
      case BookingStatus.CHECKING:
        return "processing";
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
    const { bookTime, guarantees, carType, carModel } = bookingData;
    const status = guarantees?.map((item) => {
      return item.status;
    });

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
      data.guarantees?.some((item) =>
        dayjs(item.serviceDate).isSame(current, "date")
      )
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
          <p>จ่ายสำเร็จ & ตรวจสภาพรถ</p>
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
        <Calendar cellRender={cellRender} />
      </div>

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default CalendarAdminPage;
