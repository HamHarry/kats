import { Link } from "react-scroll";
import "./HomePagekats.css";
import BookingPage from "../bookingpagekats/BookingPageKats";
import ProductPage from "../productpagekats/ProductPageKats";
import MapPage from "../mappagekats/MapPagekats";
const HomePageKats = () => {
  return (
    <div className="container-HomePageKats">
      <div className="header-HomePageKats">
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
            ร้านเปิด 8:00 น. - 18:00 น.
            <br />
            หยุดทุกวันจันทร์
          </h3>
          <div className="btn-content">
            <div className="btn-group-top">
              <button className="btn">
                <Link to="Productkats" smooth={true} duration={200}>
                  แนะนำสินค้า
                </Link>
              </button>
              <button className="btn">
                <Link to="Mapkats" smooth={true} duration={200}>
                  แผนที่
                </Link>
              </button>
            </div>
            <button className="btn">
              <Link to="Bookingkats" smooth={true} duration={200}>
                ตรวจสอบคิว
              </Link>
            </button>
            <button className="btn-gun">
              <Link to="Bookingkats" smooth={true} duration={200}>
                GUN Protection
              </Link>
            </button>
          </div>
        </div>

        <div className="center-mid">
          <div className="compare">
            <h3>Before</h3>
            <img src="/public/assets/kats_compare1.jpg" alt="compare1" />
          </div>
          <div className="compare">
            <h3>After</h3>
            <img src="/public/assets/kats_compare2.jpg" alt="compare2" />
          </div>
        </div>

        <div className="center-right">
          <div className="image-top">
            <img src="/public/assets/kats_page.png" alt="page" />
          </div>
          <div className="image-botton">
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

      <div className="bookingpagekats" id="Bookingkats">
        <BookingPage />
      </div>
      <div className="productpagekats" id="Productkats">
        <ProductPage />
      </div>
      <div className="mappagekats" id="Mapkats">
        <MapPage />
      </div>
    </div>
  );
};

export default HomePageKats;
