import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Badge, Typography, DatePicker } from "antd";
import { BookingData, BookingStatus } from "../../model/booking.type";
import "./MobileCalendar.css";

interface MobileCalendarProps {
  bookingData: BookingData[];
}

const MobileCalendar = ({ bookingData }: MobileCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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

  const getBookingsForDate = (date: Dayjs) => {
    return bookingData.reduce(
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

            if (dayjs(serviceDate).isSame(date, "date")) {
              prev.push({ status, label });
            }
          });
        } else {
          const { status, bookTime, carType, carModel } = item;
          const label = `${bookTime} ${carType} ${carModel}`;

          if (dayjs(item.bookDate).isSame(date, "date")) {
            prev.push({ status, label });
          }
        }

        return prev;
      },
      [],
    );
  };

  const getDaysInMonth = () => {
    const year = currentDate.year();
    const month = currentDate.month();
    const lastDay = dayjs(new Date(year, month + 1, 0));
    const daysInMonth = lastDay.date();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs(new Date(year, month, i)));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) setCurrentDate(date);
    setIsPickerOpen(false); // ปิดทันทีหลังเลือก
  };

  const days = getDaysInMonth();

  return (
    <div className="mobile-calendar">
      {/* Header with month/year navigation */}
      <div className="mobile-calendar-header sticky top-[152px] -mx-3 px-3 py-4 z-50 w-[107%] bg-[#f2f6f4]">
        <button onClick={handlePrevMonth} className="nav-btn">
          ←
        </button>
        <div className="relative">
          <h2 className="cursor-pointer select-none" onClick={() => setIsPickerOpen(true)}>
            {currentDate.format("MMMM YYYY")}
          </h2>

          <div className="absolute top-0 left-0" style={{ visibility: "hidden", width: 0, height: 0 }}>
            <DatePicker picker="month" value={currentDate} onChange={handleDateChange} format="MMMM YYYY" open={isPickerOpen} onOpenChange={setIsPickerOpen} getPopupContainer={() => document.body} />
          </div>
        </div>
        <button onClick={handleNextMonth} className="nav-btn">
          →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mobile-calendar-grid">
        {days.map((day) => {
          const bookings = getBookingsForDate(day);
          const isToday = day.isSame(dayjs(), "date");

          return (
            <div key={day.format("YYYY-MM-DD")} className={`calendar-day-card ${isToday ? "is-today" : ""}`}>
              <div className="day-header">
                <span className="day-number">{day.date()}</span>
                <span className={`day-name ${isToday ? "text-[#043929]!" : ""}`}>{day.format("ddd")}</span>
              </div>

              {bookings.length > 0 ? (
                <div className={`bookings-list`}>
                  {bookings.map((booking, idx) => (
                    <div key={idx} className={`booking-item-mobile ${isToday ? "bg-[#def1eb]" : "bg-[#00966408]"}`}>
                      <Badge status={getStatus(booking.status)} />
                      <Typography className="booking-text">{booking.label}</Typography>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <p>ไม่มีการจอง</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCalendar;
