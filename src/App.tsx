import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import UserAdminPage from "./addminpage/useradminpage/UserAdminPage";
import BookingAdminPage from "./addminpage/bookingadminpage/BookingAdminPage";
import CalendarAdminPage from "./addminpage/calendaradminpage/CalendarAdminPage";
import GuaranteeAdminPage from "./addminpage/guaranteeadminpage/GuaranteeAdminPage";
import FinanceAdminPage from "./addminpage/financeadminpage/FinanceAdminPage";
import BinAdminPage from "./addminpage/binadminpage/BinAdminPage";
import LoginPage from "./loginpage/Loginpage";
import ProductAdminPage from "./addminpage/productadminpage/ProductAdminPage";
import Layout from "./Layout/Layout";
import HomePage from "./HomePage/HomePage";
import LayoutAdmin from "./Layout/LayoutAdmin";
import CreateBookingAdminPage from "./addminpage/createbookingadminpage/CreateBookingAdminPage";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="main" element={<LayoutAdmin />}>
          <Route path="" element={<UserAdminPage />} />
          <Route path="booking" element={<BookingAdminPage />} />
          <Route path="booking/create" element={<CreateBookingAdminPage />} />
          <Route
            path="booking/edit/:bookingId"
            element={<CreateBookingAdminPage />}
          />
          <Route path="calendar" element={<CalendarAdminPage />} />
          <Route path="guarantee" element={<GuaranteeAdminPage />} />
          <Route path="product" element={<ProductAdminPage />} />
          <Route path="finance" element={<FinanceAdminPage />} />
          <Route path="bin" element={<BinAdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
