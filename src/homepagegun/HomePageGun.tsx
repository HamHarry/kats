import { Link } from "react-scroll";
import "./HomePageGun.css";
import CoatingPageGun from "../productpageguncoating/CoatingPageGun";
import { useNavigate } from "react-router-dom";
const HomePageGun = () => {
  const navigate = useNavigate();
  return (
    <div className="container-HomePageGun">
      <div className="header-HomePageGun">
        <h1>
          ยินดีต้อนรับ <br />
          Guneng Innovation Co.,Ltd.
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
                <Link to="/" smooth={true} duration={200}>
                  Guard
                </Link>
              </button>
            </div>
            <button className="btn-kats">
              <Link
                to="Home"
                smooth={true}
                duration={200}
                onClick={() => {
                  navigate("/kats");
                }}
              >
                KATS Coatings
              </Link>
            </button>
          </div>
        </div>

        <div className="center-mid">
          <div className="compare">
            <img src="/public/assets/gun/gun5.jpg" alt="compare1" />
          </div>
          <div className="compare">
            <img src="/public/assets/gun/gun2.jpg" alt="compare2" />
          </div>
        </div>

        <div className="center-right">
          <div className="image-botton">
            <img
              className="demo1"
              src="/public/assets/gun/gun6.jpg"
              alt="demo1"
            />
            <img
              className="demo2"
              src="/public/assets/gun/gun4.jpg"
              alt="demo2"
            />
          </div>
        </div>
      </div>

      <CoatingPageGun />

      {/* <div className="guardGun" id="guardGun"></div> */}
    </div>
  );
};

export default HomePageGun;
