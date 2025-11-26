import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "../../stores/store";
import { getDashboardSummary } from "../../stores/slices/dashboardSlice";
import { DashboardSummary, ExpensesByCategory } from "../../model/dashboard.type";
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
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const expenseCategoryLabels: { [key: string]: string } = {
  FUEL: "เชื้อเพลิง",
  TRAVEL: "ค่าเดินทาง",
  ACCOMMODATION: "ที่พัก",
  ALLOWANCE: "เบี้ยเลี้ยง",
  TRANSPORT: "ค่าขนส่ง",
  TOOL: "เครื่องมือ",
  MEDICAL: "ค่ารักษาพยาบาล",
  OTHER: "อื่นๆ",
  SALARY_ADVANCE: "เงินเดือนล่วงหน้า",
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
];

const monthlyChartDataMock = [
  { month: "ม.ค.", รายรับ: 85000, รายจ่าย: 18000, กำไรสุทธิ: 67000 },
  { month: "ก.พ.", รายรับ: 92000, รายจ่าย: 22000, กำไรสุทธิ: 70000 },
  { month: "มี.ค.", รายรับ: 78000, รายจ่าย: 19500, กำไรสุทธิ: 58500 },
  { month: "เม.ย.", รายรับ: 95000, รายจ่าย: 25000, กำไรสุทธิ: 70000 },
  { month: "พ.ค.", รายรับ: 88000, รายจ่าย: 20000, กำไรสุทธิ: 68000 },
  { month: "มิ.ย.", รายรับ: 105000, รายจ่าย: 28000, กำไรสุทธิ: 77000 },
  { month: "ก.ค.", รายรับ: 98000, รายจ่าย: 24000, กำไรสุทธิ: 74000 },
  { month: "ส.ค.", รายรับ: 110000, รายจ่าย: 30000, กำไรสุทธิ: 80000 },
  { month: "ก.ย.", รายรับ: 102000, รายจ่าย: 26000, กำไรสุทธิ: 76000 },
  { month: "ต.ค.", รายรับ: 115000, รายจ่าย: 32000, กำไรสุทธิ: 83000 },
  { month: "พ.ย.", รายรับ: 100300, รายจ่าย: 13033, กำไรสุทธิ: 87267 },
  { month: "ธ.ค.", รายรับ: 95000, รายจ่าย: 21000, กำไรสุทธิ: 74000 },
];

const FinanceAdminPage = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<DashboardSummary>();
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [startDate, setStartDate] = useState<string>(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [expenseDetails, setExpenseDetails] = useState<any[]>([]);

  const fetchSummaryData = useCallback(
    async (start: string, end: string) => {
      try {
        setIsLoading(true);
        const { data: SummaryDataRes } = await dispatch(
          getDashboardSummary({ startDate: start, endDate: end })
        ).unwrap();

        setSummaryData(SummaryDataRes);
        generateExpenseDetails(SummaryDataRes, period);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, period]
  );

  const generateExpenseDetails = (data: DashboardSummary, selectedPeriod: "month" | "year") => {
    const periodData = selectedPeriod === "month" ? data?.month : data?.year;
    if (!periodData?.expensesByCategory) return;

    const expenses = periodData.expensesByCategory;
    const details = Object.entries(expenseCategoryLabels).map(([key, label]) => {
      const amount = expenses[key as keyof ExpensesByCategory] as number;
      return {
        key,
        category: label,
        amount: amount || 0,
        percentage:
          expenses.total > 0 ? (((amount || 0) / expenses.total) * 100).toFixed(2) : "0.00",
      };
    });

    setExpenseDetails(details.filter((item) => item.amount > 0));
  };

  useEffect(() => {
    fetchSummaryData(startDate, endDate);
  }, [startDate, endDate, fetchSummaryData]);

  const handlePeriodChange = (newPeriod: "month" | "year") => {
    setPeriod(newPeriod);
    if (summaryData) {
      generateExpenseDetails(summaryData, newPeriod);
    }
  };

  const currentData = period === "month" ? summaryData?.month : summaryData?.year;
  const totalRevenue = currentData?.bookingsRevenue.totalRevenue || 0;
  const pendingRevenue = currentData?.bookingsRevenuePending.totalRevenue || 0;
  const totalExpenses = currentData?.expensesByCategory.total || 0;
  const netProfit = currentData?.netProfit || 0;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0.00";

  // Data for Bar Chart
  const overviewData = [
    {
      name: "รายรับ",
      จำนวน: totalRevenue,
      fill: "#10b981",
    },
    {
      name: "รายจ่าย",
      จำนวน: totalExpenses,
      fill: "#ef4444",
    },
    {
      name: "กำไรสุทธิ",
      จำนวน: netProfit,
      fill: "#3b82f6",
    },
  ];

  // Data for Pie Chart
  const expensesData = Object.entries(currentData?.expensesByCategory || {})
    .filter(([key, value]) => key !== "total" && value > 0)
    .map(([key, value]) => ({
      name: expenseCategoryLabels[key],
      value: value,
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ paddingLeft: "calc(320px + 32px)" }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 flex-wrap gap-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard การเงิน</h1>
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => handlePeriodChange("month")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  period === "month"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                รายเดือน
              </button>
              <button
                onClick={() => handlePeriodChange("year")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  period === "year"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                รายปี
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-0 focus:outline-none text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-0 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">รายรับทั้งหมด</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {formatNumberWithComma(totalRevenue)}
              <span className="text-lg ml-1">฿</span>
            </div>
            <div className="text-xs text-gray-500">
              จำนวน {currentData?.bookingsRevenue.bookingCount} รายการ
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">รายจ่ายทั้งหมด</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-500 mb-1">
              {formatNumberWithComma(totalExpenses)}
              <span className="text-lg ml-1">฿</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">กำไรสุทธิ</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {formatNumberWithComma(netProfit)}
              <span className="text-lg ml-1">฿</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">% กำไร</span>
              <div
                className={`text-sm font-bold ${
                  Number(profitMargin) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(profitMargin) >= 0 ? "▲" : "▼"}
              </div>
            </div>
            <div
              className={`text-3xl font-bold mb-1 ${
                Number(profitMargin) >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {profitMargin}
              <span className="text-lg ml-1">%</span>
            </div>
            <div className="text-xs text-gray-500">
              รอดำเนินการ: {formatNumberWithComma(pendingRevenue)} ฿
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              📈 {period === "year" ? "รายรับ-รายจ่ายรายเดือน" : "ภาพรวมรายรับ-รายจ่าย"}
            </h2>
            <ResponsiveContainer width="100%" height={450}>
              {period === "year" ? (
                <LineChart data={monthlyChartDataMock}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString("th-TH") + " ฿"} />
                  <Legend />
                  <Line type="monotone" dataKey="รายรับ" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="รายจ่าย" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="กำไรสุทธิ" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString("th-TH") + " ฿"} />
                  <Bar dataKey="จำนวน">
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🥧 สัดส่วนค่าใช้จ่าย</h2>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={expensesData}
                margin={{
                  top: 20,
                  right: 30,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString("th-TH") + " ฿"} />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  radius={[8, 8, 0, 0]}
                  label={({ x, y, width, value }: any) => {
                    const totalVal = totalExpenses || 1;
                    const val = value || 0;
                    const percentage = totalVal > 0 ? ((val / totalVal) * 100).toFixed(2) : "0.00";
                    const xPos =
                      typeof x === "number" && typeof width === "number" ? x + width / 2 : 0;
                    const yPos = typeof y === "number" ? y - 25 : 0;
                    const yPos2 = typeof y === "number" ? y - 10 : 0;
                    return (
                      <g>
                        <text
                          x={xPos}
                          y={yPos}
                          fill="#333"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {val?.toLocaleString("th-TH") ?? 0} ฿
                        </text>
                        <text x={xPos} y={yPos2} fill="#666" textAnchor="middle" fontSize="11">
                          {percentage}%
                        </text>
                      </g>
                    );
                  }}
                >
                  {expensesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Implicit Costs */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">💰 ต้นทุนแฝง (Implicit Costs)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">ต้นทุนค่าเสียโอกาส</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatNumberWithComma(Math.round(netProfit * 0.05))}
                <span className="text-lg ml-1">฿</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">(5% ของกำไรสุทธิ)</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">ค่าเสื่อมราคาเครื่องมือ</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatNumberWithComma(
                  Math.round((currentData?.expensesByCategory.TOOL || 0) * 0.1)
                )}
                <span className="text-lg ml-1">฿</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">(10% ของค่าเครื่องมือ)</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-2">ค่าใช้จ่ายดำเนินงาน</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatNumberWithComma(Math.round(totalRevenue * 0.03))}
                <span className="text-lg ml-1">฿</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">(3% ของรายรับ)</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📋 รายละเอียดค่าใช้จ่ายแยกตามหมวด
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">หมวดหมู่</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    จำนวนเงิน (บาท)
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">สัดส่วน (%)</th>
                </tr>
              </thead>
              <tbody>
                {expenseDetails.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{row.category}</td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {row.amount.toLocaleString("th-TH")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 border-t-2 border-blue-200">
                  <td className="py-4 px-4 font-bold text-gray-800 text-lg">รวมทั้งหมด</td>
                  <td className="py-4 px-4 text-right font-bold text-gray-800 text-lg">
                    {totalExpenses.toLocaleString("th-TH")} ฿
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      100.00%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CircleLoading open={isLoading} />
    </div>
  );
};

export default FinanceAdminPage;
