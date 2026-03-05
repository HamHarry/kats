import "./CalendarAdminPage.css";
import { Badge, Calendar, CalendarProps, Tooltip, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/store";
import { getAllBookings } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";
import MobileCalendar from "./MobileCalendar";
import { useMobileMatch } from "../../hooks/useMobileMatch";

const CalendarAdminPage = () => {
  const dispath = useAppDispatch();
  const isMobile = useMobileMatch(600);

  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsCalendarLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookings(DeleteStatus.ISNOTDELETE),
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

  const renderBookedCalendar = (payload: {
    status: BookingStatus;
    label: string;
    isBG?: boolean;
  }) => {
    const { status, label, isBG = false } = payload;

    const getBackgroundColor = (status: BookingStatus): string => {
      switch (status) {
        case BookingStatus.PENDING:
        case BookingStatus.CHECKING:
          return "bg-amber-50"; // yellow
        case BookingStatus.PAID:
          return "bg-blue-50"; // blue
        case BookingStatus.COMPLETED:
          return "bg-green-50"; // green
        case BookingStatus.CANCELED:
          return "bg-red-50"; // red
        default:
          return "bg-[#fff]";
      }
    };

    return (
      <div
        className={`flex gap-1 rounded-md ${isBG ? `${getBackgroundColor(status)}  px-2 py-1` : ""}`}
      >
        <Badge status={getStatus(status)} />
        <Typography className="truncate" title={label}>
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
      <Tooltip
        title={() => {
          return (
            <div className="flex flex-col gap-2 p-3 bg-white rounded-md shadow-lg -m-3">
              {cellDict.map((data, index) => {
                return (
                  <div key={index}>
                    {renderBookedCalendar({ ...data, isBG: true })}
                  </div>
                );
              })}
            </div>
          );
        }}
        overlayStyle={{
          backgroundColor: "white !important",
          borderRadius: "0.375rem",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
      >
        <div className="booking">
          {cellDict.map((data, index) => {
            return <div key={index}>{renderBookedCalendar(data)}</div>;
          })}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="container-calendarAdmin">
      {/* Header */}
      <div className="sticky pt-4 top-0 -mx-3 px-3 z-50 w-full bg-[#f2f6f4]">
        <div className="header-calendarAdmin">
          <h1>ปฏิทินการจอง</h1>
        </div>
      </div>

      {/* Mobile: Show custom mobile calendar */}
      {isMobile ? (
        <>
          {/* Legend */}
          <div className="sticky top-[57px] -mx-3 px-3 z-50 w-full bg-[#f2f6f4]">
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

          {/* Mobile Calendar */}
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

          {/* Desktop Ant Design Calendar */}
          <div className="wrap-calendarAdmin">
            <Calendar cellRender={cellRender} />
          </div>
        </>
      )}

      <CircleLoading open={isCalendarLoading} />
    </div>
  );
};

export default CalendarAdminPage;
