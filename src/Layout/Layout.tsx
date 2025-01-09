import { Suspense } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import HomePage from "../homepage/HomePage";
import OrderPage from "../orderpage/OrderPage";

const Layout = () => {
  return (
    <div className="cotainer-all" id="Home">
      <Navbar />
      <Suspense>
        <>
          <HomePage />
          <div className="orderpage" id="Order">
            <OrderPage />
          </div>
        </>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Layout;
