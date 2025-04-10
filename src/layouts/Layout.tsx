import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavbarGun from "./navbargun/Navbargun";
import FooterGun from "./footergun/Footergun";

const Layout = () => {
  return (
    <div className="cotainer-all" id="Home">
      <NavbarGun />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
      <FooterGun />
    </div>
  );
};

export default Layout;
