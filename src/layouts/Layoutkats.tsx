import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbarkats from "./navbarkats/Navbarkats";
import Footerkats from "./footerkats/Footerkats";

const Layoutkats = () => {
  return (
    <div className="cotainer-all" id="Home">
      <Navbarkats />
      <Suspense>
        <>
          <Outlet />
        </>
      </Suspense>
      <Footerkats />
    </div>
  );
};

export default Layoutkats;
