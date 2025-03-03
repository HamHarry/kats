import { Suspense } from "react";
import Footer from "./footerkats/Footerkats";
import { Outlet } from "react-router-dom";
import Navbarkats from "./navbarkats/Navbarkats";

const Layout = () => {
  return (
    <div className="cotainer-all" id="Home">
      <Navbarkats />
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
