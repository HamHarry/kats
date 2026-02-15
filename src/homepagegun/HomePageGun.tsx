import { Link } from "react-scroll";
import "./HomePageGun.css";
import CoatingPageGun from "../productpageguncoating/CoatingPageGun";
// import GunGuardPage from "../productpagegunguard/GunGuardPage";
import BookingPageGun from "../bookingpagegun/BookingPageGun";

const HomePageGun = () => {
  return (
    <div className="container-HomePageGun">
      <div className="header-HomePageGun">
        <h1>
          ยินดีต้อนรับ <br />
          ศูนย์พ่นกันสนิม Gun Protection สาขาลาดกระบัง
        </h1>
      </div>

      <div className="centerGun">
        <div className="center-left">
          <h3>
            <span>GUN PROTECTION</span>
            <br />
            สถานบริการเฉพาะทางด้านการป้องกันและชะลอการเกิดสนิมใต้ท้องรถยนต์
            <br />
            โดยเน้นการดูแลบริเวณใต้ท้องรถ โครงสร้างแชสซี ซอกมุม
            <br />
            และชิ้นส่วนโลหะที่เสี่ยงต่อความชื้น น้ำ และคราบเกลือ
            <br />
            ซึ่งเป็นสาเหตุหลักของการเกิดสนิม
            <br />
            เเละเป็นศูนย์บริการที่เลือกใช้น้ำยาสูตรน้ำ (Water-Based)
            <br />
            โดยเน้นความปลอดภัยต่อผู้ใช้งาน เป็นมิตรต่อสิ่งแวดล้อม
            <br />
            และให้ประสิทธิภาพการป้องกันสนิมที่ดียิ่งขึ้น
          </h3>
          <div className="btn-content">
            <div className="btn-group-top">
              <button className="btn">
                <Link to="bookingGun" smooth={true} duration={200}>
                  ตรวจสอบคิว
                </Link>
              </button>
              <button className="btn">
                <Link to="coatingGun" smooth={true} duration={200}>
                  Coating
                </Link>
              </button>
            </div>
            {/* <button className="btn-booking">
              <Link to="bookingGun" smooth={true} duration={200}>
                ตรวจสอบคิว
              </Link>
            </button> */}
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

      <BookingPageGun />

      <CoatingPageGun />

      {/* <GunGuardPage /> */}
    </div>
  );
};

export default HomePageGun;
