import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./navbaradmin/NavbarAdmin";

const LayoutAdmin = () => {
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

export default LayoutAdmin;
