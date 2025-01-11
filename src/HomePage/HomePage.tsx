import { Link } from "react-scroll";
import "./HomePage.css";
import BookingPage from "../bookingpage/BookingPage";
import ProductPage from "../productpage/ProductPage";
import MapPage from "../mappage/MapPage";
const HomePage = () => {
  return (
    <div className="container-homepage">
      <div className="header-homepage">
        <img src="/public/assets/katoon.png" alt="katoon" />
        <h1>
          ยินดีต้อนรับ <br />
          ศูนย์พ่นกันสนิม KATS Coatings สาขาลาดกระบัง
        </h1>
      </div>
      <div className="center">
        <div className="center-left">
          <h3>
            ศูนย์พ่นกันสนิมใต้ท้องรถที่ได้มาตรฐาน
            <br />
            KATS COATINGS
            <br />
            นำเข้าจากอเมริกามีแบรนด์เดียวในไทยได้รับมาตรฐาน
            <br />
            ISO/TS16949 อุตสาหกรรมยานยนต์ให้การรับรอง
            <br />
            ร้านเปิด 8:00 - 18:00
            <br />
            หยุดทุกวันพุธ
          </h3>
          <div className="btn">
            <button className="btn-product">
              <Link to="Product" smooth={true} duration={200}>
                แนะนำสินค้า
              </Link>
            </button>
            <button className="btn-map">
              <Link to="Map" smooth={true} duration={200}>
                แผนที่
              </Link>
            </button>
            <button className="btn-order">
              <Link to="Booking" smooth={true} duration={200}>
                ตรวจสอบคิว
              </Link>
            </button>
          </div>
        </div>
        <div className="center-right">
          <div className="image-top">
            <img src="/public/assets/kats_page.png" alt="page" />
          </div>
          <div className="image-botton">
            <div className="image-compare">
              <div className="compare-before">
                <h3>Before</h3>
                <img src="/public/assets/kats_compare1.jpg" alt="compare1" />
              </div>
              <div className="compare-after">
                <h3>After</h3>
                <img src="/public/assets/kats_compare2.jpg" alt="compare2" />
              </div>
            </div>
            <div className="image-example">
              <img
                className="demo1"
                src="/public/assets/kats_demo1.jpg"
                alt="demo1"
              />
              <img
                className="demo2"
                src="/public/assets/kats_demo2.jpg"
                alt="demo2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bookingpage" id="Booking">
        <BookingPage />
      </div>
      <div className="productpage" id="Product">
        <ProductPage />
      </div>
      <div className="mappage" id="Map">
        <MapPage />
      </div>
    </div>
  );
};

export default HomePage;
