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
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsCalendarLoading(true);
      const { data: bookingsRes = [] } = await dispath(getAllBookings(DeleteStatus.ISNOTDELETE)).unwrap();

      setBookingData(bookingsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCalendarLoading(false);
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

  const renderBookedCalendar = (payload: { status: BookingStatus; label: string }) => {
    const { status, label } = payload;

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
          {label}
        </Typography>
      </div>
    );
  };

  // reduce ข้อมูล
  const generateCellDict = (current: dayjs.Dayjs) => {
    const cellDict = bookingData.reduce(
      (
        prev: {
          status: BookingStatus;
          label: string;
        }[],
        item: BookingData
      ) => {
        if (item.guarantees?.length) {
          item.guarantees?.map((guarantee) => {
            const { status, serviceDate, serviceTime } = guarantee;

            const label = `${serviceTime} ${item.carType} ${item.carModel}`;

            if (dayjs(serviceDate).isSame(current, "date")) {
              prev.push({ status, label });
            }
          });
        } else {
          const { status, bookTime, carType, carModel } = item;
          const label = `${bookTime} ${carType} ${carModel}`;

          if (dayjs(item.bookDate).isSame(current, "date")) {
            prev.push({ status, label });
          }
        }

        return prev;
      },
      []
    );

    return cellDict;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current) => {
    const cellDict = generateCellDict(current);

    return (
      <div className="booking">
        {cellDict.map((data, index) => {
          return <div key={index}>{renderBookedCalendar(data)}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="container-calendarAdmin">
      <div className="header-calendarAdmin">
        <h1>ปฏิทินการจอง</h1>
      </div>

      <div className="guid">
        <div className="guid-yellow">
          <div className="box-yellow"></div>
          <p>กำลังรอการชำระ & ตรวจสภาพรถ</p>
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
        <Calendar cellRender={cellRender} />
      </div>

      <CircleLoading open={isCalendarLoading} />
    </div>
  );
};

export default CalendarAdminPage;
