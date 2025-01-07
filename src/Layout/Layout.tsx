import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./Navbar/Navbar";

const Layout = () => {
  return (
    <div className="cotainer-all">
      <Navbar />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
    </div>
  );
};

export default Layout;
