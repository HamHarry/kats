import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./homepage/HomePage";
import { Suspense } from "react";
import "./App.css";
import LoginPage from "./loginpage/LoginPage";
import LayoutAdmin from "./layout/LayoutAdmin";
import UserAdminPage from "./useradminpage/UserAdminPage";

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
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
