import { Suspense } from "react";
import Footer from "./footer/Footer";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

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
