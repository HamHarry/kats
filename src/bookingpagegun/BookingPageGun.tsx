import { Badge, Calendar, CalendarProps, Typography } from "antd";
import "./BookingPageGun.css";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus, BookingData } from "../model/booking.type";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../stores/store";
import { getAllBookingForPreview } from "../stores/slices/bookingSlice";
import CircleLoading from "../shared/circleLoading";
import { DeleteStatus } from "../model/delete.type";

const BookingPageGun = () => {
  const dispath = useAppDispatch();
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(getAllBookingForPreview(DeleteStatus.ISNOTDELETE)).unwrap();

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
    <div className="container-orderpage-Gun" id="bookingGun">
      <div className="header-orderpage-Gun">
        <Typography className="text-header">ตรวจสอบคิว ได้แล้วโว้ยยย!!!</Typography>
      </div>

      <div className="wrap-calendar-Gun">
        <Calendar cellRender={cellRender} />
      </div>

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default BookingPageGun;
