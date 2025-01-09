import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

const Layout = () => {
  return (
    <div className="cotainer-all" id="Home">
      <Navbar />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Layout;
