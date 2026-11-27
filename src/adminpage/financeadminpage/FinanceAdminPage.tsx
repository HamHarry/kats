import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "../../stores/store";
import { getDashboardSummary } from "../../stores/slices/dashboardSlice";
import { DashboardSummary } from "../../model/dashboard.type";
import CircleLoading from "../../shared/circleLoading";
import { formatNumberWithComma } from "../../shared/utils/common";
import "./FinanceAdminPage.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Wallet, Percent } from "lucide-react";

const expenseCategoryLabels: { [key: string]: string } = {
  FUEL: "เชื้อเพลิง",
  TRAVEL: "ค่าเดินทาง",
  ACCOMMODATION: "ที่พัก",
  ALLOWANCE: "เบี้ยเลี้ยง",
  TRANSPORT: "ขนส่ง",
  TOOL: "เครื่องมือ",
  MEDICAL: "ค่ารักษา",
  OTHER: "อื่นๆ",
  SALARY_ADVANCE: "เงินเดือนล่วงหน้า",
  PAYROLL: "เงินเดือนพนักงาน",
};

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#84cc16",
];

const thaiMonthsShort = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

// จำกัดจำนวนเดือนสูงสุดที่เลือกได้ (1 เดือน = 1 request)
const MAX_RANGE_MONTHS = 36;

type PeriodType = "month" | "year" | "range";

interface RangeSummary {
  bookingsRevenue: { totalRevenue: number; bookingCount: number };
  bookingsRevenuePending: { totalRevenue: number; bookingCount: number };
  expensesByCategory: Record<string, number>;
  netProfit: number;
  monthlyChartData: {
    month: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }[];
  yearlyChartData: {
    year: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }[];
}

// รวมข้อมูลรายเดือนหลายเดือนให้เป็นสรุปเดียว
const buildRangeSummary = (
  months: { label: string; year: string; data: any }[],
): RangeSummary => {
  const expensesByCategory: Record<string, number> = { total: 0 };
  Object.keys(expenseCategoryLabels).forEach((k) => {
    expensesByCategory[k] = 0;
  });

  const summary: RangeSummary = {
    bookingsRevenue: { totalRevenue: 0, bookingCount: 0 },
    bookingsRevenuePending: { totalRevenue: 0, bookingCount: 0 },
    expensesByCategory,
    netProfit: 0,
    monthlyChartData: [],
    yearlyChartData: [],
  };
  const yearMap: Record<
    string,
    { year: string; revenue: number; expenses: number; netProfit: number }
  > = {};

  months.forEach(({ label, year, data }) => {
    const revenue = data?.bookingsRevenue?.totalRevenue || 0;
    const expenses = data?.expensesByCategory?.total || 0;
    const netProfit = data?.netProfit ?? revenue - expenses;

    summary.bookingsRevenue.totalRevenue += revenue;
    summary.bookingsRevenue.bookingCount +=
      data?.bookingsRevenue?.bookingCount || 0;
    summary.bookingsRevenuePending.totalRevenue +=
      data?.bookingsRevenuePending?.totalRevenue || 0;
    summary.bookingsRevenuePending.bookingCount +=
      data?.bookingsRevenuePending?.bookingCount || 0;
    summary.netProfit += netProfit;

    Object.keys(expensesByCategory).forEach((k) => {
      expensesByCategory[k] += data?.expensesByCategory?.[k] || 0;
    });

    summary.monthlyChartData.push({
      month: label,
      revenue,
      expenses,
      netProfit,
    });

    // รวมยอดรายปีสำหรับกราฟ
    if (!yearMap[year]) {
      yearMap[year] = { year, revenue: 0, expenses: 0, netProfit: 0 };
    }
    yearMap[year].revenue += revenue;
    yearMap[year].expenses += expenses;
    yearMap[year].netProfit += netProfit;
  });

  summary.yearlyChartData = Object.values(yearMap).sort((a, b) =>
    a.year.localeCompare(b.year),
  );

  return summary;
};

const monthlyChartDataMock = [
  { month: "ม.ค." },
  { month: "ก.พ." },
  { month: "มี.ค." },
  { month: "เม.ย." },
  { month: "พ.ค." },
  { month: "มิ.ย." },
  { month: "ก.ค." },
  { month: "ส.ค." },
  { month: "ก.ย." },
  { month: "ต.ค." },
  { month: "พ.ย." },
  { month: "ธ.ค." },
];

const FinanceAdminPage = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<DashboardSummary>();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD"),
  );
  // ── โหมดช่วงเวลาแบบกำหนดเอง (เช่น ม.ค. 2025 – มี.ค. 2026) ──
  const [rangeStart, setRangeStart] = useState<string>(
    dayjs().subtract(1, "year").startOf("year").format("YYYY-MM"),
  );
  const [rangeEnd, setRangeEnd] = useState<string>(dayjs().format("YYYY-MM"));
  const [rangeSummary, setRangeSummary] = useState<RangeSummary>();
  const [rangeError, setRangeError] = useState<string>("");
  const rangeRequestId = useRef(0);
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY"),
  );

  const fetchSummaryData = useCallback(
    async (start: string, end: string) => {
      try {
        setIsLoading(true);
        const { data: SummaryDataRes } = await dispatch(
          getDashboardSummary({ startDate: start, endDate: end, period }),
        ).unwrap();
        setSummaryData(SummaryDataRes);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, period],
  );

  // ดึงข้อมูลทีละเดือนในช่วงที่เลือก แล้วรวมเป็นสรุปเดียว
  const fetchRangeSummary = useCallback(
    async (from: string, to: string) => {
      const start = dayjs(`${from}-01`);
      const end = dayjs(`${to}-01`);

      // ยกเลิกผลของ request เก่าที่ยังค้างอยู่
      const requestId = ++rangeRequestId.current;

      if (!from || !to || !start.isValid() || !end.isValid()) {
        setRangeSummary(undefined);
        setRangeError("กรุณาเลือกเดือนเริ่มต้นและเดือนสิ้นสุด");
        setIsLoading(false);
        return;
      }
      if (end.isBefore(start)) {
        setRangeSummary(undefined);
        setRangeError("เดือนสิ้นสุดต้องไม่อยู่ก่อนเดือนเริ่มต้น");
        setIsLoading(false);
        return;
      }
      const monthCount = end.diff(start, "month") + 1;
      if (monthCount > MAX_RANGE_MONTHS) {
        setRangeSummary(undefined);
        setRangeError(`เลือกช่วงเวลาได้สูงสุด ${MAX_RANGE_MONTHS} เดือน`);
        setIsLoading(false);
        return;
      }

      setRangeError("");
      try {
        setIsLoading(true);
        const results = await Promise.all(
          Array.from({ length: monthCount }, (_, i) => {
            const m = start.add(i, "month");
            return dispatch(
              getDashboardSummary({
                startDate: m.startOf("month").format("YYYY-MM-DD"),
                endDate: m.endOf("month").format("YYYY-MM-DD"),
                period: "month",
              }),
            )
              .unwrap()
              .then((res) => ({
                label: `${thaiMonthsShort[m.month()]} ${m.year()}`,
                year: String(m.year()),
                data: res.data?.month,
              }));
          }),
        );
        if (requestId !== rangeRequestId.current) return;
        setRangeSummary(buildRangeSummary(results));
      } catch (error) {
        console.log(error);
      } finally {
        if (requestId === rangeRequestId.current) setIsLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (period === "month") fetchSummaryData(startDate, endDate);
  }, [startDate, endDate, period, fetchSummaryData]);

  useEffect(() => {
    if (period === "year" && selectedYear) {
      const start = dayjs(`${selectedYear}-01-01`).format("YYYY-MM-DD");
      const end = dayjs(`${selectedYear}-12-31`).format("YYYY-MM-DD");
      fetchSummaryData(start, end);
    }
  }, [selectedYear, period, fetchSummaryData]);

  useEffect(() => {
    if (period === "range") fetchRangeSummary(rangeStart, rangeEnd);
  }, [period, rangeStart, rangeEnd, fetchRangeSummary]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
  };

  const currentData = (period === "range"
    ? rangeSummary
    : period === "month"
      ? summaryData?.month
      : summaryData?.year) as unknown as RangeSummary | undefined;

  const rangeMonthCount = rangeSummary?.monthlyChartData.length || 0;
  const rangeLabel = `${thaiMonthsShort[dayjs(`${rangeStart}-01`).month()]} ${dayjs(`${rangeStart}-01`).year()} – ${thaiMonthsShort[dayjs(`${rangeEnd}-01`).month()]} ${dayjs(`${rangeEnd}-01`).year()}`;

  const expenseDetails = useMemo(() => {
    const expenses = currentData?.expensesByCategory;
    if (!expenses) return [];
    const total = expenses.total || 0;
    return Object.entries(expenseCategoryLabels)
      .map(([key, label]) => {
        const amount = expenses[key] || 0;
        return {
          key,
          category: label,
          amount,
          percentage: total > 0 ? ((amount / total) * 100).toFixed(2) : "0.00",
        };
      })
      .filter((item) => item.amount > 0);
  }, [currentData]);
  const totalRevenue = currentData?.bookingsRevenue.totalRevenue || 0;
  const pendingRevenue = currentData?.bookingsRevenuePending.totalRevenue || 0;
  const totalExpenses = currentData?.expensesByCategory.total || 0;
  const netProfit = currentData?.netProfit || 0;
  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0.00";

  const overviewData = [
    { name: "รายรับ", จำนวน: totalRevenue, fill: "#10b981" },
    { name: "รายจ่าย", จำนวน: totalExpenses, fill: "#ef4444" },
    { name: "กำไรสุทธิ", จำนวน: netProfit, fill: "#3b82f6" },
  ];

  const expensesData = Object.entries(currentData?.expensesByCategory || {})
    .filter(([key, value]) => key !== "total" && value > 0)
    .map(([key, value]) => ({
      name: expenseCategoryLabels[key],
      value,
    }));

  const tooltipStyle = {
    background: "#fff",
    border: "1px solid rgba(0,150,100,0.2)",
    borderRadius: "10px",
    fontFamily: "'Sarabun', sans-serif",
    fontSize: "0.85rem",
    color: "#1a2e22",
    boxShadow: "0 4px 16px rgba(0,120,80,0.1)",
  };

  return (
    <div className="container-financeAdminPage">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="header-financeAdminPage">
        <h1>การเงิน</h1>

        <div className="finance-controls">
          {/* Period toggle */}
          <div className="finance-period-group">
            <button
              className={`finance-period-btn${period === "month" ? " active" : ""}`}
              onClick={() => handlePeriodChange("month")}
            >
              รายเดือน
            </button>
            <button
              className={`finance-period-btn${period === "year" ? " active" : ""}`}
              onClick={() => handlePeriodChange("year")}
            >
              รายปี
            </button>
            <button
              className={`finance-period-btn${period === "range" ? " active" : ""}`}
              onClick={() => handlePeriodChange("range")}
            >
              สรุปทั้งหมด
            </button>
          </div>

          {/* Year selector */}
          {period === "year" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="finance-year-select"
            >
              {Array.from(
                { length: dayjs().year() - 2025 + 1 },
                (_, i) => 2025 + i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}

          {/* Date range (รายเดือน) */}
          {period === "month" && (
            <div className="finance-date-range">
              {/* <Calendar size={16} /> */}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="date-sep">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          {/* Month range (ช่วงเวลา เช่น 2025-2026) */}
          {period === "range" && (
            <div className="finance-date-range">
              <input
                type="month"
                value={rangeStart}
                max={rangeEnd}
                onChange={(e) => setRangeStart(e.target.value)}
              />
              <span className="date-sep">–</span>
              <input
                type="month"
                value={rangeEnd}
                min={rangeStart}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="wrap-container-financeAdminPage">
        {period === "range" && (
          <p className={`finance-range-note${rangeError ? " error" : ""}`}>
            {rangeError ||
              `สรุปยอดรวม ${rangeLabel} (${rangeMonthCount} เดือน)`}
          </p>
        )}

        {/* ── Summary Cards ────────────────────────────── */}
        <div className="finance-summary-cards">
          {/* Revenue */}
          <div className="finance-card">
            <div className="finance-card-header">
              <p className="finance-card-label">รายรับทั้งหมด</p>
              <div className="finance-card-icon green">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="finance-card-value green">
              {formatNumberWithComma(totalRevenue)}{" "}
              <span style={{ fontSize: "1.2rem" }}>฿</span>
            </p>
            <p className="finance-card-sub">
              จำนวน {currentData?.bookingsRevenue.bookingCount || 0} รายการ
            </p>
          </div>

          {/* Expenses */}
          <div className="finance-card">
            <div className="finance-card-header">
              <p className="finance-card-label">รายจ่ายทั้งหมด</p>
              <div className="finance-card-icon red">
                <TrendingDown size={16} />
              </div>
            </div>
            <p className="finance-card-value red">
              {formatNumberWithComma(totalExpenses)}{" "}
              <span style={{ fontSize: "1.2rem" }}>฿</span>
            </p>
            <p className="finance-card-sub">รายจ่ายรวมทุกหมวด</p>
          </div>

          {/* Net Profit */}
          <div className="finance-card">
            <div className="finance-card-header">
              <p className="finance-card-label">กำไรสุทธิ</p>
              <div className="finance-card-icon blue">
                <Wallet size={16} />
              </div>
            </div>
            <p className="finance-card-value blue">
              {formatNumberWithComma(netProfit)}{" "}
              <span style={{ fontSize: "1.2rem" }}>฿</span>
            </p>
            <p className="finance-card-sub">
              รอดำเนินการ: {formatNumberWithComma(pendingRevenue)} ฿
            </p>
          </div>

          {/* Profit Margin */}
          <div className="finance-card">
            <div className="finance-card-header">
              <p className="finance-card-label">% กำไร</p>
              <div
                className={`finance-card-icon ${Number(profitMargin) >= 0 ? "green" : "red"}`}
              >
                <Percent size={16} />
              </div>
            </div>
            <p
              className={`finance-card-value ${Number(profitMargin) >= 0 ? "green" : "red"}`}
            >
              {profitMargin}
              <span style={{ fontSize: "1.2rem" }}> %</span>
            </p>
            <p className="finance-card-sub">
              {Number(profitMargin) >= 0 ? "▲ กำไร" : "▼ ขาดทุน"}
            </p>
          </div>
        </div>

        {/* ── Charts Row ───────────────────────────────── */}
        <div className="finance-charts-row">
          {/* Chart 1 – Overview / Monthly line */}
          <div className="finance-panel">
            <div className="finance-panel-header">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#043929" }}
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h2>
                {period === "month"
                  ? "ภาพรวมรายรับ-รายจ่าย"
                  : period === "range"
                    ? "รายรับ-รายจ่ายรายปี"
                    : "รายรับ-รายจ่ายรายเดือน"}
              </h2>
            </div>
            <div className="finance-panel-body">
              <ResponsiveContainer width="100%" height={360}>
                {period === "range" ? (
                  <BarChart
                    data={rangeSummary?.yearlyChartData || []}
                    margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,150,100,0.1)"
                    />
                    <XAxis
                      dataKey="year"
                      tick={{
                        fontFamily: "Sarabun",
                        fontSize: 13,
                        fill: "#4a7a5e",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontFamily: "Sarabun",
                        fontSize: 11,
                        fill: "#8ab5a0",
                      }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: any) => v.toLocaleString("th-TH") + " ฿"}
                    />
                    <Legend
                      formatter={(v) =>
                        v === "revenue"
                          ? "รายรับ"
                          : v === "expenses"
                            ? "รายจ่าย"
                            : "กำไรสุทธิ"
                      }
                      wrapperStyle={{ fontFamily: "Sarabun", fontSize: 13 }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      name="revenue"
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                      name="expenses"
                    />
                    <Bar
                      dataKey="netProfit"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      name="netProfit"
                    />
                  </BarChart>
                ) : period === "year" ? (
                  <LineChart
                    data={
                      summaryData?.year?.monthlyChartData ||
                      monthlyChartDataMock
                    }
                    margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,150,100,0.1)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontFamily: "Sarabun",
                        fontSize: 12,
                        fill: "#4a7a5e",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontFamily: "Sarabun",
                        fontSize: 11,
                        fill: "#8ab5a0",
                      }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: any) => v.toLocaleString("th-TH") + " ฿"}
                    />
                    <Legend
                      formatter={(v) =>
                        v === "revenue"
                          ? "รายรับ"
                          : v === "expenses"
                            ? "รายจ่าย"
                            : "กำไรสุทธิ"
                      }
                      wrapperStyle={{ fontFamily: "Sarabun", fontSize: 13 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name="revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name="expenses"
                    />
                    <Line
                      type="monotone"
                      dataKey="netProfit"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name="netProfit"
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={overviewData}
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,150,100,0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontFamily: "Sarabun",
                        fontSize: 13,
                        fill: "#4a7a5e",
                      }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: any) => v.toLocaleString("th-TH") + " ฿"}
                    />
                    <Bar
                      dataKey="จำนวน"
                      radius={[8, 8, 0, 0]}
                      label={({ x, y, width, value }: any) => (
                        <text
                          x={(x ?? 0) + (width ?? 0) / 2}
                          y={(y ?? 0) - 8}
                          fill="#4a7a5e"
                          textAnchor="middle"
                          fontSize="12"
                          fontFamily="Sarabun"
                          fontWeight="600"
                        >
                          {(value ?? 0).toLocaleString("th-TH")} ฿
                        </text>
                      )}
                    >
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 – Expense breakdown */}
          <div className="finance-panel">
            <div className="finance-panel-header">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#043929" }}
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <h2>สัดส่วนค่าใช้จ่าย</h2>
            </div>
            <div className="finance-panel-body">
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={expensesData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,150,100,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontFamily: "Sarabun",
                      fontSize: 11,
                      fill: "#4a7a5e",
                    }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: any) => v.toLocaleString("th-TH") + " ฿"}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    label={({ x, y, width, value }: any) => {
                      const pct =
                        totalExpenses > 0
                          ? (((value ?? 0) / totalExpenses) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <g>
                          <text
                            x={(x ?? 0) + (width ?? 0) / 2}
                            y={(y ?? 0) - 18}
                            fill="#4a7a5e"
                            textAnchor="middle"
                            fontSize="11"
                            fontFamily="Sarabun"
                            fontWeight="600"
                          >
                            {(value ?? 0).toLocaleString("th-TH")} ฿
                          </text>
                          <text
                            x={(x ?? 0) + (width ?? 0) / 2}
                            y={(y ?? 0) - 5}
                            fill="#8ab5a0"
                            textAnchor="middle"
                            fontSize="10"
                            fontFamily="Sarabun"
                          >
                            {pct}%
                          </text>
                        </g>
                      );
                    }}
                  >
                    {expensesData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Expense Table ─────────────────────────────── */}
        <div className="finance-table-panel">
          <div className="finance-panel-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#043929" }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2>รายละเอียดค่าใช้จ่ายแยกตามหมวด</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="finance-table">
              <thead>
                <tr>
                  <th>หมวดหมู่</th>
                  <th>จำนวนเงิน (บาท)</th>
                  <th>สัดส่วน (%)</th>
                </tr>
              </thead>
              <tbody>
                {expenseDetails.map((row, index) => (
                  <tr key={index}>
                    <td>{row.category}</td>
                    <td>{row.amount.toLocaleString("th-TH")}</td>
                    <td>
                      <span className="finance-badge blue">
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>รวมทั้งหมด</td>
                  <td>{totalExpenses.toLocaleString("th-TH")} ฿</td>
                  <td>
                    <span className="finance-badge gun">100.00%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <CircleLoading open={isLoading} />
    </div>
  );
};

export default FinanceAdminPage;
