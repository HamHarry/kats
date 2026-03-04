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
import { useMobileMatch } from "../hooks/useMobileMatch";
import MobileCalendar from "../adminpage/calendaradminpage/MobileCalendar";

const BookingPageGun = () => {
  const dispath = useAppDispatch();
  const isMobile = useMobileMatch(600);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookingForPreview(DeleteStatus.ISNOTDELETE),
      ).unwrap();

      const sorted = [...bookingsRes].sort((a, b) => {
        const [ah, am] = a.bookTime.split(":").map(Number);
        const [bh, bm] = b.bookTime.split(":").map(Number);
        const na = ah * 60 + am;
        const nb = bh * 60 + bm;
        return na - nb;
      });

      setBookingData(sorted);
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

  const renderBookedCalendar = (payload: {
    status: BookingStatus;
    label: string;
  }) => {
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

  const generateCellDict = (current: dayjs.Dayjs) => {
    const cellDict = bookingData.reduce(
      (
        prev: {
          status: BookingStatus;
          label: string;
        }[],
        item: BookingData,
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
      [],
    );
    return cellDict;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current) => {
    const cellDict = generateCellDict(current);
    return (
      <div className="booking">
        {cellDict.map((data, index) => (
          <div key={index}>{renderBookedCalendar(data)}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-orderpage-Gun" id="bookingGun">
      {/* Header */}
      <div className="header-orderpage-Gun">
        <Typography className="text-header">ตรวจสอบคิว</Typography>
      </div>

      {isMobile ? (
        <>
          {/* Legend — sticky เหมือน CalendarAdminPage */}
          <div className="sticky top-[57px] -mx-3 px-3 z-50 w-[107%] bg-[#f2f6f4]">
            <div className="guid">
              <div className="guid-yellow">
                <div className="box-yellow" />
                <p>กำลังรอการชำระ & ตรวจสภาพรถ</p>
              </div>
              <div className="guid-blue">
                <div className="box-blue" />
                <p>จ่ายสำเร็จ</p>
              </div>
              <div className="guid-green">
                <div className="box-green" />
                <p>ใช้บริการสำเร็จ</p>
              </div>
              <div className="guid-red">
                <div className="box-red" />
                <p>ยกเลิก</p>
              </div>
            </div>
          </div>

          {/* Mobile Calendar — เหมือน CalendarAdminPage */}
          <div className="wrap-calendarAdmin-mobile">
            <MobileCalendar bookingData={bookingData} />
          </div>
        </>
      ) : (
        <>
          {/* Legend */}
          <div className="guid">
            <div className="guid-yellow">
              <div className="box-yellow" />
              <p>กำลังรอการชำระ & ตรวจสภาพรถ</p>
            </div>
            <div className="guid-blue">
              <div className="box-blue" />
              <p>จ่ายสำเร็จ</p>
            </div>
            <div className="guid-green">
              <div className="box-green" />
              <p>ใช้บริการสำเร็จ</p>
            </div>
            <div className="guid-red">
              <div className="box-red" />
              <p>ยกเลิก</p>
            </div>
          </div>

          {/* Desktop Calendar */}
          <div className="wrap-calendar-Gun">
            <Calendar cellRender={cellRender} />
          </div>
        </>
      )}

      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default BookingPageGun;
