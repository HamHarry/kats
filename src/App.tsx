import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import BookingAdminPage from "./adminpage/bookingadminpage/BookingAdminPage";
import CalendarAdminPage from "./adminpage/calendaradminpage/CalendarAdminPage";
import GuaranteeAdminPage from "./adminpage/guaranteeadminpage/GuaranteeAdminPage";
import FinanceAdminPage from "./adminpage/financeadminpage/FinanceAdminPage";
import BinAdminPage from "./adminpage/binadminpage/BinAdminPage";
import LoginPage from "./loginpage/Loginpage";
import ProductAdminPage from "./adminpage/productadminpage/ProductAdminPage";
import LayoutAdmin from "./Layout/LayoutAdmin";
import CreateBookingAdminPage from "./adminpage/createbookingadminpage/CreateBookingAdminPage";
import HomePageKats from "./homepagekats/HomePagekats";
import HomePageGun from "./homepagegun/HomePageGun";
import Layoutkats from "./Layout/Layoutkats";
import Layout from "./Layout/Layout";
import CreateProductAdminPage from "./adminpage/createproductadminpage/CreateProductAdminPage";
import EmployeeAdminPage from "./adminpage/employeeadminpage/EmployeeAdminPage";
import UserAdminPage from "./adminpage/useradminpage/UserAdminPage";
import CreateTypeProductPage from "./adminpage/createtypeproductpage/CreateTypeProductPage";
import CreateEmployeeAdminPage from "./adminpage/createemployeeadminpage/CreateEmployeeAdminPage";
import CatagoryAdminPage from "./adminpage/catagoryadminpage/CatagoryAdminPage";
import CreateCatagoryAdminPage from "./adminpage/createcatagoryadminpage/CreateCatagoryAdminPage";
import EditGuaranteeAdminPage from "./adminpage/editguaranteeadminpage/EditGuaranteeAdminPage";
import SettingAdminPage from "./adminpage/settingadminpage/SettingAdminPage";
import WithdrawAdminPage from "./adminpage/withdrawadminpage/WithdrawAdminPage";
import SalaryAdminPage from "./adminpage/salaryadminpage/SalaryAdminPage";
import CreateWithdrawAdminPage from "./adminpage/createwithdrawadminpage/CreateWithdrawAdminPage";
import CreateSalaryAdvanceAdminPage from "./adminpage/createsalaryadvanceadminpage/CreateSalaryAdvanceAdminPage";
import EditEmployeeAdminPage from "./adminpage/editemployeeadminpage/EditEmployeeAdminPage";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePageGun />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/kats" element={<Layoutkats />}>
          <Route path="" element={<HomePageKats />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="admin" element={<LayoutAdmin />}>
          <Route path="user" element={<UserAdminPage />} />
          <Route path="employee" element={<EmployeeAdminPage />} />
          <Route path="employee/create" element={<CreateEmployeeAdminPage />} />
          <Route
            path="employee/edit/:employeeId"
            element={<EditEmployeeAdminPage />}
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
            path="product/createTypeProduct"
            element={<CreateTypeProductPage />}
          />
          <Route
            path="product/createProduct"
            element={<CreateProductAdminPage />}
          />
          <Route path="catagory" element={<CatagoryAdminPage />} />
          <Route
            path="catagory/createCatagory"
            element={<CreateCatagoryAdminPage />}
          />
          <Route path="withdraw" element={<WithdrawAdminPage />} />
          <Route
            path="withdraw/createWithdraw"
            element={<CreateWithdrawAdminPage />}
          />
          <Route path="salary" element={<SalaryAdminPage />} />
          <Route
            path="salary/createSalaryAdvance"
            element={<CreateSalaryAdvanceAdminPage />}
          />
          <Route path="finance" element={<FinanceAdminPage />} />
          <Route path="bin" element={<BinAdminPage />} />
          <Route path="setting" element={<SettingAdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
