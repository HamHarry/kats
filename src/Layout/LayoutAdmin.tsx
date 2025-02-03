import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./navbaradmin/NavbarAdmin";

const Layout = () => {
  return (
    <div className="cotainer-all-admin">
      <NavbarAdmin />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
    </div>
  );
};

export default Layout;
