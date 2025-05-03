import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import HomePageGun from "./homepagegun/HomePageGun";
import LoginPage from "./loginpage/Loginpage";
import HomePageKats from "./homepagekats/HomePagekats";
import UserAdminPage from "./adminpage/useradminpage/UserAdminPage";
import EmployeeAdminPage from "./adminpage/employeeadminpage/EmployeeAdminPage";
import CreateEmployeeAdminPage from "./adminpage/createemployeeadminpage/CreateEmployeeAdminPage";
import BookingAdminPage from "./adminpage/bookingadminpage/BookingAdminPage";
import CreateBookingAdminPage from "./adminpage/createbookingadminpage/CreateBookingAdminPage";
import CalendarAdminPage from "./adminpage/calendaradminpage/CalendarAdminPage";
import GuaranteeAdminPage from "./adminpage/guaranteeadminpage/GuaranteeAdminPage";
import EditGuaranteeAdminPage from "./adminpage/editguaranteeadminpage/EditGuaranteeAdminPage";
import ProductAdminPage from "./adminpage/productadminpage/ProductAdminPage";
import CreateTypeProductPage from "./adminpage/createtypeproductpage/CreateTypeProductPage";
import CreateProductAdminPage from "./adminpage/createproductadminpage/CreateProductAdminPage";
import CatagoryAdminPage from "./adminpage/catagoryadminpage/CatagoryAdminPage";
import CreateCatagoryAdminPage from "./adminpage/createcatagoryadminpage/CreateCatagoryAdminPage";
import WithdrawAdminPage from "./adminpage/withdrawadminpage/WithdrawAdminPage";
import CreateWithdrawAdminPage from "./adminpage/createwithdrawadminpage/CreateWithdrawAdminPage";
import SalaryAdminPage from "./adminpage/salaryadminpage/SalaryAdminPage";
import CreateSalaryAdvanceAdminPage from "./adminpage/createsalaryadvanceadminpage/CreateSalaryAdvanceAdminPage";
import FinanceAdminPage from "./adminpage/financeadminpage/FinanceAdminPage";
import BinAdminPage from "./adminpage/binadminpage/BinAdminPage";
import SettingAdminPage from "./adminpage/settingadminpage/SettingAdminPage";
import Layout from "./layouts/Layout.tsx";
import Layoutkats from "./layouts/Layoutkats.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import CalendarPage from "./calendarpage/CalendarPage";
import LayoutCalendar from "./layouts/LayoutCalendar.tsx";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePageGun />} />
        </Route>
        <Route path="/kats" element={<Layoutkats />}>
          <Route path="" element={<HomePageKats />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/calendar" element={<LayoutCalendar />}>
          <Route path="" element={<CalendarPage />} />
        </Route>
        <Route path="admin" element={<LayoutAdmin />}>
          <Route path="user" element={<UserAdminPage />} />
          <Route path="employee" element={<EmployeeAdminPage />} />
          <Route path="employee/create" element={<CreateEmployeeAdminPage />} />
          <Route
            path="employee/edit/:employeeId"
            element={<CreateEmployeeAdminPage />}
          />
          <Route path="booking" element={<BookingAdminPage />} />
          <Route path="booking/create" element={<CreateBookingAdminPage />} />
          <Route
            path="booking/edit/:bookingId"
            element={<CreateBookingAdminPage />}
          />
          <Route path="calendar" element={<CalendarAdminPage />} />
          <Route path="guarantee" element={<GuaranteeAdminPage />} />
          <Route
            path="guarantee/edit/:bookingId"
            element={<EditGuaranteeAdminPage />}
          />
          <Route path="product" element={<ProductAdminPage />} />
          <Route
            path="product/createProduct"
            element={<CreateProductAdminPage />}
          />
          <Route
            path="product/edit/Product/:productId"
            element={<CreateProductAdminPage />}
          />
          <Route path="catagory" element={<CatagoryAdminPage />} />
          <Route
            path="catagory/createCatagory"
            element={<CreateCatagoryAdminPage />}
          />
          <Route
            path="catagory/edit/Catagory/:catagoryId"
            element={<CreateCatagoryAdminPage />}
          />
          <Route path="withdraw" element={<WithdrawAdminPage />} />
          <Route
            path="withdraw/createWithdraw"
            element={<CreateWithdrawAdminPage />}
          />
          <Route
            path="withdraw/createSalaryAdvance"
            element={<CreateSalaryAdvanceAdminPage />}
          />
          <Route
            path="withdraw/edit/withdraw/:expenseId"
            element={<CreateWithdrawAdminPage />}
          />
          <Route
            path="withdraw/edit/salaryadvance/:expenseId"
            element={<CreateSalaryAdvanceAdminPage />}
          />
          <Route path="salary" element={<SalaryAdminPage />} />
          <Route path="finance" element={<FinanceAdminPage />} />
          <Route path="bin" element={<BinAdminPage />} />
          <Route path="setting/:lang" element={<SettingAdminPage />} />
          {/* สร้าง type */}
          <Route
            path="setting/createTypeProduct"
            element={<CreateTypeProductPage />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
