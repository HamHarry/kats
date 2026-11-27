import { useCallback, useEffect, useMemo, useState } from "react";
import CircleLoading from "../../shared/circleLoading";
import "./DashBoardPage.css";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import { formatNumberWithComma, getImagePath } from "../../shared/utils/common";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { getDashboardSummary } from "../../stores/slices/dashboardSlice";
import { DashboardSummary } from "../../model/dashboard.type";
import dayjs from "dayjs";
import { DeleteStatus } from "../../model/delete.type";
import { useNavigate } from "react-router-dom";
import { getAllBookings } from "../../stores/slices/bookingSlice";
import { BookingData } from "../../model/booking.type";

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
const thaiDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

/* ── attendance status type ────────────────────────── */
type AttendStatus = "attend" | "leave" | "missing";

/* ── individual employee attendance map ────────────── */
type AttendMap = Record<string, AttendStatus>;

const DashBoardPage = () => {
  const dispath = useAppDispatch();
  const userInfo = useSelector(userInfoSelector);
  const navigate = useNavigate();

  const [isDashBoardLoading, setIsDashBoardLoading] = useState<boolean>(false);
  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendMap, setAttendMap] = useState<AttendMap>({});
  const [summaryData, setSummaryData] = useState<DashboardSummary>();
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isSlidePaused, setIsSlidePaused] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const dayName = thaiDays[currentTime.getDay()];
  const date = currentTime.getDate();
  const month = thaiMonths[currentTime.getMonth()];
  const year = currentTime.getFullYear() + 543;

  /* ── data booking fetching ──────────────────────────────────── */
  const fetchAllBooking = useCallback(async () => {
    try {
      setIsDashBoardLoading(true);
      const { data: bookingsRes = [] } =
        await dispath(getAllBookings()).unwrap();
      setBookingDatas(
        bookingsRes.filter(
          (item: BookingData) => item.delete === DeleteStatus.ISNOTDELETE,
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsDashBoardLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  /* ── fetch employees ──────────────────────────────── */
  const fetchAllEmployee = useCallback(async () => {
    try {
      setIsDashBoardLoading(true);
      const { data: employeesRes = [] } =
        await dispath(getAllEmployees()).unwrap();
      const filtered = employeesRes.filter(
        (item: EmployeeData) => item.delete === DeleteStatus.ISNOTDELETE,
      );
      setEmployeeData(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDashBoardLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllEmployee();
  }, [fetchAllEmployee]);

  /* ── fetch summary ────────────────────────────────── */
  const fetchSummaryData = useCallback(async () => {
    try {
      const startMonth = dayjs().startOf("month").format("YYYY-MM-DD");
      const endMonth = dayjs().endOf("month").format("YYYY-MM-DD");
      const { data: SummaryDataForMonthRes } = await dispath(
        getDashboardSummary({ startDate: startMonth, endDate: endMonth }),
      ).unwrap();
      setSummaryData(SummaryDataForMonthRes);
    } catch (error) {
      console.log(error);
    }
  }, [dispath]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  /* ── today's booking helper ───────────────────────────── */
  const mapBooking = (b: BookingData) => ({
    date: b.bookDate,
    time: b.bookTime,
    name: b.name,
    phone: b.tel,
    car: `${b.carType} ${b.carModel}`.trim(),
    province: `${b.licensePlate} ${b.province}`.trim(),
    product: b.product?.name,
    price: b.price?.amount,
    status: b.status,
  });

  const getBookingDateTime = (
    date: string,
    time: string,
  ): dayjs.Dayjs | null => {
    if (!date) return null;
    const day = dayjs(date).format("YYYY-MM-DD");
    const dt = dayjs(`${day} ${time || "00:00"}`, "YYYY-MM-DD HH:mm");
    return dt.isValid() ? dt : null;
  };

  /** คิวทั้งหมดของวันปัจจุบัน โดยรองรับตารางรับประกัน */
  const getTodayBookings = (bookings: BookingData[], today: dayjs.Dayjs) => {
    return bookings
      .flatMap((b) => {
        const mapped = mapBooking(b);
        const schedules = b.guarantees?.length
          ? b.guarantees.map((guarantee) => ({
              date: guarantee.serviceDate,
              time: guarantee.serviceTime,
            }))
          : [{ date: mapped.date, time: mapped.time }];

        return schedules.map((schedule) => ({
          booking: b,
          dt: getBookingDateTime(schedule.date, schedule.time),
        }));
      })
      .filter(
        (x): x is { booking: BookingData; dt: dayjs.Dayjs } =>
          x.dt !== null && x.dt.isSame(today, "day"),
      )
      .sort((a, b) => a.dt.valueOf() - b.dt.valueOf());
  };

  /* ── clock ────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  /* ── today's bookings ───────────────────────────────── */
  const todayMinute = dayjs(currentTime).format("YYYY-MM-DD HH:mm");

  const todayBookings = useMemo(
    () => getTodayBookings(bookingDatas, dayjs(todayMinute)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingDatas, todayMinute],
  );

  /* ── slider: keep index in range when list changes ── */
  useEffect(() => {
    if (slideIndex >= todayBookings.length) setSlideIndex(0);
  }, [todayBookings.length, slideIndex]);

  /* ── slider: auto play every 5s (pause on hover/touch) ── */
  useEffect(() => {
    if (todayBookings.length <= 1 || isSlidePaused) return;
    const id = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % todayBookings.length);
    }, 5000);
    return () => clearInterval(id);
  }, [todayBookings.length, isSlidePaused, slideIndex]);

  const goToSlide = (index: number) => {
    const total = todayBookings.length;
    if (!total) return;
    setSlideIndex((index + total) % total);
  };

  const handleTouchEnd = (endX: number) => {
    if (touchStartX === null) return;
    const diff = touchStartX - endX;
    if (Math.abs(diff) > 40) goToSlide(slideIndex + (diff > 0 ? 1 : -1));
    setTouchStartX(null);
  };

  /* ── attendance toggle per employee ──────────────── */
  const setEmployeeAttend = (id: string, status: AttendStatus) => {
    setAttendMap((prev) => ({ ...prev, [id]: status }));
  };

  const getStatus = (id: string): AttendStatus => attendMap[id] ?? "attend";

  /* ── net profit color helper ──────────────────────── */
  const netColor = (val: number) => (val >= 0 ? "#10b981" : "#ef4444");

  return (
    <div className="container-dashBoradAdminPage">
      {/* ── Header ────────────────────────────────────── */}
      <div className="header-dashBoradAdminPage">
        <div className="header-date-block">
          <h1>
            {dayName} {date} {month} พ.ศ. {year}
          </h1>
        </div>
        <div className="header-time-block">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-secondary)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h1>{timeStr} น.</h1>
        </div>
      </div>

      <div className="wrap-container-dashBoradAdminPage">
        {/* ── Summary Cards ─────────────────────────────── */}
        <div className="navbar-dashboard">
          {/* Card 1 – Today's bookings */}
          <div className="grid-dashboard">
            <h2>คิวของวันปัจจุบันทั้งหมด</h2>
            <div className="wrap-grid-showBooking">
              <div className="grid-showBooking-right">
                {todayBookings.length ? (
                  <>
                    <div
                      className="booking-slider"
                      onMouseEnter={() => setIsSlidePaused(true)}
                      onMouseLeave={() => setIsSlidePaused(false)}
                      onTouchStart={(e) => {
                        setIsSlidePaused(true);
                        setTouchStartX(e.touches[0].clientX);
                      }}
                      onTouchEnd={(e) => {
                        handleTouchEnd(e.changedTouches[0].clientX);
                        setIsSlidePaused(false);
                      }}
                    >
                      <div
                        className="booking-slider-track"
                        style={{
                          transform: `translateX(-${slideIndex * 100}%)`,
                        }}
                      >
                        {todayBookings.map(({ booking, dt }) => {
                          const item = mapBooking(booking);
                          return (
                            <div
                              className="today-booking-slide"
                              key={`${booking._id ?? booking.number}-${dt.valueOf()}`}
                            >
                              <span className="slide-time">
                                {dt.format("HH:mm")} น.
                              </span>
                              <p>
                                <strong>ชื่อ:</strong> {item.name || "-"}
                              </p>
                              <p>
                                <strong>เบอร์:</strong> {item.phone || "-"}
                              </p>
                              <p>
                                <strong>รถ:</strong> {item.car || "-"}
                              </p>
                              <p>
                                <strong>ทะเบียน:</strong> {item.province || "-"}
                              </p>
                              <p>
                                <strong>สินค้า:</strong> {item.product || "-"}
                                {item.price != null &&
                                  ` ${formatNumberWithComma(item.price)} บาท`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="slider-footer">
                      <div className="slider-dots">
                        {todayBookings.map(({ booking, dt }, i) => (
                          <button
                            type="button"
                            key={`dot-${booking._id ?? booking.number}-${dt.valueOf()}`}
                            className={`slider-dot${i === slideIndex ? " active" : ""}`}
                            aria-label={`คิวที่ ${i + 1}`}
                            onClick={() => goToSlide(i)}
                          />
                        ))}
                      </div>
                      {/* <span className="slider-counter">
                        {slideIndex + 1}/{todayBookings.length}
                      </span> */}
                    </div>
                  </>
                ) : (
                  <p className="no-booking-text">ไม่มีคิวในวันปัจจุบัน</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 – Monthly booking count */}
          <div
            className="grid-dashboard"
            onClick={() => {
              navigate("/admin/calendar");
            }}
          >
            <h2>สรุปยอดจองต่อเดือน</h2>
            <div className="wrap-grid-totalBooking">
              {/* Left – total */}
              <div className="grid-totalBooking-left">
                <p className="total-number">
                  {(summaryData?.month.bookingsRevenuePending.bookingCount ||
                    0) + (summaryData?.month.bookingsRevenue.bookingCount || 0)}
                </p>
                <span className="total-label">ทั้งหมด</span>
              </div>

              {/* Divider */}
              <div className="totalBooking-divider" />

              {/* Right – breakdown */}
              <div className="grid-totalBooking-right">
                <div className="stat-item">
                  <span className="stat-label">เสร็จแล้ว</span>
                  <p className="stat-number" style={{ color: "#10b981" }}>
                    {summaryData?.month.bookingsRevenue.bookingCount || 0}
                  </p>
                </div>
                <div className="stat-item">
                  <span className="stat-label">กำลังดำเนินการ</span>
                  <p className="stat-number" style={{ color: "#f59e0b" }}>
                    {summaryData?.month.bookingsRevenuePending.bookingCount ||
                      0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 – Monthly P&L */}
          <div className="grid-dashboard">
            <h2>รายรับ/รายจ่าย เดือนปัจจุบัน</h2>
            <div className="wrap-grid-financial">
              <div className="grid-financial-top">
                <div className="grid-financial-left">
                  <p>รายรับ</p>
                  <h2 style={{ color: "#10b981" }}>
                    {formatNumberWithComma(
                      summaryData?.month.bookingsRevenue.totalRevenue || 0,
                    )}{" "}
                    ฿
                  </h2>
                </div>
                <div
                  className="grid-financial-right"
                  style={{ textAlign: "right" }}
                >
                  <p>รายจ่าย</p>
                  <h2 style={{ color: "#ef4444" }}>
                    {formatNumberWithComma(
                      summaryData?.month.expensesByCategory.total || 0,
                    )}{" "}
                    ฿
                  </h2>
                </div>
              </div>
              <div className="grid-financial-divider" />
              <div className="grid-financial-bottom">
                <span className="net-label">กำไรสุทธิ</span>
                <h1
                  style={{ color: netColor(summaryData?.month.netProfit || 0) }}
                >
                  {formatNumberWithComma(summaryData?.month.netProfit || 0)} บาท
                </h1>
              </div>
            </div>
          </div>

          {/* Card 4 – Yearly P&L */}
          <div className="grid-dashboard">
            <h2>รายรับ/รายจ่าย ทั้งปี</h2>
            <div className="wrap-grid-financial">
              <div className="grid-financial-top">
                <div className="grid-financial-left">
                  <p>รายรับ</p>
                  <h2 style={{ color: "#10b981" }}>
                    {formatNumberWithComma(
                      summaryData?.year.bookingsRevenue.totalRevenue || 0,
                    )}{" "}
                    ฿
                  </h2>
                </div>
                <div
                  className="grid-financial-right"
                  style={{ textAlign: "right" }}
                >
                  <p>รายจ่าย</p>
                  <h2 style={{ color: "#ef4444" }}>
                    {formatNumberWithComma(
                      summaryData?.year.expensesByCategory.total || 0,
                    )}{" "}
                    ฿
                  </h2>
                </div>
              </div>
              <div className="grid-financial-divider" />
              <div className="grid-financial-bottom">
                <span className="net-label">กำไรสุทธิ</span>
                <h1
                  style={{ color: netColor(summaryData?.year.netProfit || 0) }}
                >
                  {formatNumberWithComma(summaryData?.year.netProfit || 0)} บาท
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Row ───────────────────────────────── */}
        <div className="content-dashboard">
          {/* Employee attendance panel – full width */}
          <div className="wrap-content-dashboard-left">
            <div className="header-content-dashboard-left">
              <i className="fa-solid fa-user" />
              <h1>เข้า-ออกงาน ของพนักงาน</h1>
            </div>

            <div className="overflow">
              {employeeData.map((item, index) => {
                const empId = item._id ?? String(index);
                const status = getStatus(empId);
                return (
                  <div key={index} className="wrap-grid-employee-name">
                    <div className="grid-employee-name">
                      <img
                        src={getImagePath(
                          "profile",
                          userInfo?.dbname,
                          item?.image,
                        )}
                        alt="profile"
                      />
                      <div className="employee-name">
                        {item.firstName} {item.lastName}
                        <p>สถานะพนักงาน</p>
                      </div>
                    </div>

                    <div className="checking">
                      <div
                        className={
                          status === "missing"
                            ? "checkbox-Missing-work-selected"
                            : "checkbox-Missing-work"
                        }
                        onClick={() => setEmployeeAttend(empId, "missing")}
                      >
                        ขาดงาน
                      </div>
                      <div
                        className={
                          status === "leave"
                            ? "checkbox-Leave-work-selected"
                            : "checkbox-Leave-work"
                        }
                        onClick={() => setEmployeeAttend(empId, "leave")}
                      >
                        ลางาน
                      </div>
                      <div
                        className={
                          status === "attend"
                            ? "checkbox-Attend-work-selected"
                            : "checkbox-Attend-work"
                        }
                        onClick={() => setEmployeeAttend(empId, "attend")}
                      >
                        เข้างาน
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CircleLoading open={isDashBoardLoading} />
    </div>
  );
};

export default DashBoardPage;
