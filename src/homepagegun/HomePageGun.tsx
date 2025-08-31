import { Link } from "react-scroll";
import "./HomePageGun.css";
import CoatingPageGun from "../productpageguncoating/CoatingPageGun";
import GunGuardPage from "../productpagegunguard/GunGuardPage";
import BookingPageGun from "../bookingpagegun/BookingPageGun";

const HomePageGun = () => {
  return (
    <div className="container-HomePageGun">
      <div className="header-HomePageGun">
        <h1>
          ยินดีต้อนรับ <br />
          ศูนย์พ่นกันสนิม Gun Protection
        </h1>
      </div>

      <div className="centerGun">
        <div className="center-left">
          <h3>
            <span>GUN PROTECTION</span>
            <br />
            ผู้ผลิตและจำหน่าย สินค้าประเภทเคมีภัณฑ์และสินค้าอุตสาหกรรม
            <br />
            โดยเรามีทีมงานวิจัยและพัฒนาที่มากประสบการณ์ด้านเคมีอุตสาหกรรม
            <br />
            โดยตรงมากกว่า 30 ปี รวมทั้งมีโรงงานผลิตสินค้ารองรับการผลิตที่ได้
            <br />
            มาตรฐานและมีศักยภาพในการผลิตซึ่งสามารถบริหารจัดการสินค้าใน
            <br />
            ปริมาณมากในลูกค้าได้อย่างมีประสิทธิภาพ รวมทั้งสามารถพัฒนาสินค้า
            <br />
            ตามความต้องการของลูกค้าได้ในอนาคตอีกด้วย
          </h3>
          <div className="btn-content">
            <div className="btn-group-top">
              <button className="btn">
                <Link to="coatingGun" smooth={true} duration={200}>
                  Coatings
                </Link>
              </button>
              <button className="btn">
                <Link to="GunGuard" smooth={true} duration={200}>
                  Guard
                </Link>
              </button>
            </div>
            <button className="btn-booking">
              <Link to="bookingGun" smooth={true} duration={200}>
                ตรวจสอบคิว
              </Link>
            </button>
          </div>
        </div>

        <div className="center-mid">
          <div className="compare">
            <img src="/assets/gun/gun5.jpg" alt="compare1" />
          </div>
          <div className="compare">
            <img src="/assets/gun/gun4.jpg" alt="compare2" />
          </div>
        </div>

        <div className="center-right">
          <video src="/assets/gun/file.mov" autoPlay loop muted controls />
        </div>
      </div>

      <CoatingPageGun />

      <BookingPageGun />

      <GunGuardPage />
    </div>
  );
};

export default HomePageGun;
