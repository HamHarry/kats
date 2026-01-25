import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useCallback, useEffect } from "react";
import "./App.css";
import HomePageGun from "./homepagegun/HomePageGun";
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
import FinanceAdminPage from "./adminpage/financeadminpage/FinanceAdminPage";
import BinAdminPage from "./adminpage/binadminpage/BinAdminPage";
import SettingAdminPage from "./adminpage/settingadminpage/SettingAdminPage";
import Layout from "./layouts/Layout.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import PermissionPage from "./adminpage/permissionpage/PermissionPage.tsx";
import CreateRoleAdminPage from "./adminpage/createroleadminpae/CreateRoleAdminPage.tsx";
import NotFoundPage from "./notfoundpage/NotFoundPage.tsx";
import DocumentCountPage from "./adminpage/documentcountpage/DocumentCountPage.tsx";
import {
  checkedAuthenticatedSelector,
  isAuthentedSelector,
  restoreProfile,
} from "./stores/slices/authSlice.ts";
import { useAppDispatch } from "./stores/store.ts";
import PrivateRoutes from "./routes/PrivateRoutes.tsx";
import { useSelector } from "react-redux";
import CircleLoading from "./shared/circleLoading.tsx";
import LoginPageGun from "./loginpagegun/LoginPageGun.tsx";
import DashBoardPage from "./adminpage/dashboardpage/DashBoardPage.tsx";

function App() {
  const dispatch = useAppDispatch();
  const isAuthented = useSelector(isAuthentedSelector);
  const checkedAuthenticated = useSelector(checkedAuthenticatedSelector);

  const initailPage = useCallback(() => {
    dispatch(restoreProfile());
  }, [dispatch]);

  useEffect(() => {
    initailPage();
  }, [initailPage]);

  if (!checkedAuthenticated) {
    return <CircleLoading open={!checkedAuthenticated} />;
  }

  return (
    <Suspense fallback={<CircleLoading open={!checkedAuthenticated} />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePageGun />} />
          <Route path="login" element={<LoginPageGun />} />
        </Route>

        <Route
          path="/admin"
          element={<PrivateRoutes isAuthented={isAuthented} />}
        >
          <Route path="/admin" element={<Navigate to="user" />} />
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<DashBoardPage />} />
            <Route
              path="user/:employeeId"
              element={<CreateEmployeeAdminPage />}
            />
            <Route path="employee" element={<EmployeeAdminPage />} />
            <Route
              path="employee/create"
              element={<CreateEmployeeAdminPage />}
            />
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
              path="withdraw/edit/withdraw/:expenseId"
              element={<CreateWithdrawAdminPage />}
            />
            <Route path="salary" element={<SalaryAdminPage />} />
            <Route path="finance" element={<FinanceAdminPage />} />
            <Route path="bin" element={<BinAdminPage />} />
            <Route path="setting" element={<SettingAdminPage />} />
            <Route path="setting/role" element={<CreateRoleAdminPage />} />
            <Route path="setting/permission" element={<PermissionPage />} />
            {/* สร้าง type */}
            <Route
              path="setting/createTypeProduct"
              element={<CreateTypeProductPage />}
            />
            <Route
              path="setting/document-count"
              element={<DocumentCountPage />}
            ></Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
