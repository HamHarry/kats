import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavbarFinance from "./navbarfinance/NavbarFinance";

const LayoutFinance = () => {
  return (
    <div className="container-financeAdmin">
      <div className="header-financeAdmin">
        <h1>การเงิน</h1>
      </div>

      <NavbarFinance />

      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
    </div>
  );
};

export default LayoutFinance;
