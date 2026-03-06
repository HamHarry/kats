import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "../../stores/store";
import { getDashboardSummary } from "../../stores/slices/dashboardSlice";
import {
  DashboardSummary,
  ExpensesByCategory,
} from "../../model/dashboard.type";
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
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Wallet,
  Percent,
} from "lucide-react";

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
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD"),
  );
  const [expenseDetails, setExpenseDetails] = useState<any[]>([]);
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
        generateExpenseDetails(SummaryDataRes, period);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, period],
  );

  const generateExpenseDetails = (
    data: DashboardSummary,
    selectedPeriod: "month" | "year",
  ) => {
    const periodData = selectedPeriod === "month" ? data?.month : data?.year;
    if (!periodData?.expensesByCategory) return;
    const expenses = periodData.expensesByCategory;
    const details = Object.entries(expenseCategoryLabels).map(
      ([key, label]) => {
        const amount = expenses[key as keyof ExpensesByCategory] as number;
        return {
          key,
          category: label,
          amount: amount || 0,
          percentage:
            expenses.total > 0
              ? (((amount || 0) / expenses.total) * 100).toFixed(2)
              : "0.00",
        };
      },
    );
    setExpenseDetails(details.filter((item) => item.amount > 0));
  };

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

  const handlePeriodChange = (newPeriod: "month" | "year") => {
    setPeriod(newPeriod);
    if (summaryData) generateExpenseDetails(summaryData, newPeriod);
  };

  const currentData =
    period === "month" ? summaryData?.month : summaryData?.year;
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

          {/* Date range */}
          <div className="finance-date-range">
            <Calendar size={16} />
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
        </div>
      </div>

      <div className="wrap-container-financeAdminPage">
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
                {period === "year"
                  ? "รายรับ-รายจ่ายรายเดือน"
                  : "ภาพรวมรายรับ-รายจ่าย"}
              </h2>
            </div>
            <div className="finance-panel-body">
              <ResponsiveContainer width="100%" height={360}>
                {period === "year" ? (
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
