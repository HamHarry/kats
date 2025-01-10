import { Suspense } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import HomePage from "../homepage/HomePage";
import BookingPage from "../bookingpage/BookingPage";
import ProductPage from "../productpage/ProductPage";
import MapPage from "../mappage/MapPage";

const Layout = () => {
  return (
    <div className="cotainer-all" id="Home">
      <Navbar />
      <Suspense>
        <>
          <HomePage />
          <div className="bookingpage" id="Booking">
            <BookingPage />
          </div>
          <div className="productpage" id="Product">
            <ProductPage />
          </div>
          <div className="mappage" id="Map">
            <MapPage />
          </div>
        </>
      </Suspense>
      <Footer />
    </div>
  );
};

export default Layout;
