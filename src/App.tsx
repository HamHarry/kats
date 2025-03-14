import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import BookingAdminPage from "./addminpage/bookingadminpage/BookingAdminPage";
import CalendarAdminPage from "./addminpage/calendaradminpage/CalendarAdminPage";
import GuaranteeAdminPage from "./addminpage/guaranteeadminpage/GuaranteeAdminPage";
import FinanceAdminPage from "./addminpage/financeadminpage/FinanceAdminPage";
import BinAdminPage from "./addminpage/binadminpage/BinAdminPage";
import LoginPage from "./loginpage/Loginpage";
import ProductAdminPage from "./addminpage/productadminpage/ProductAdminPage";
import LayoutAdmin from "./Layout/LayoutAdmin";
import CreateBookingAdminPage from "./addminpage/createbookingadminpage/CreateBookingAdminPage";
import HomePageKats from "./homepagekats/HomePagekats";
import HomePageGun from "./homepagegun/HomePageGun";
import Layoutkats from "./Layout/Layoutkats";
import Layout from "./Layout/Layout";
import CreateProductAdminPage from "./addminpage/createproductadminpage/CreateProductAdminPage";
import EmployeeAdminPage from "./addminpage/employeeadminpage/EmployeeAdminPage";
import UserAdminPage from "./addminpage/useradminpage/UserAdminPage";
import CreateTypeProductPage from "./addminpage/createtypeproductpage/CreateTypeProductPage";

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
          <Route path="" element={<UserAdminPage />} />
          <Route path="employee" element={<EmployeeAdminPage />} />
          <Route path="booking" element={<BookingAdminPage />} />
          <Route path="booking/create" element={<CreateBookingAdminPage />} />
          <Route
            path="booking/edit/:bookingId"
            element={<CreateBookingAdminPage />}
          />
          <Route path="calendar" element={<CalendarAdminPage />} />
          <Route path="guarantee" element={<GuaranteeAdminPage />} />
          <Route path="product" element={<ProductAdminPage />} />
          <Route
            path="product/createTypeProduct"
            element={<CreateTypeProductPage />}
          />
          <Route
            path="product/createProduct"
            element={<CreateProductAdminPage />}
          />
          <Route path="finance" element={<FinanceAdminPage />} />
          <Route path="bin" element={<BinAdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
