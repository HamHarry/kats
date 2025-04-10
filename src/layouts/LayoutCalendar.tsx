import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavbarCalendar from "./navbarcalendar/NavbarCalendar";
import Footerkats from "./footerkats/Footerkats";

const LayoutCalendar = () => {
  return (
    <div className="cotainer-all-admin">
      <NavbarCalendar />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
      <Footerkats />
    </div>
  );
};

export default LayoutCalendar;
