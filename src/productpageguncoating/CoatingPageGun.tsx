import { useState } from "react";
import { Link } from "react-scroll";
import "./CoatingPageGun.css";
import { MockUpSlidesBlackImage } from "../data/MockUpSlideBlackImage";
import { MockUpSlidesWhiteImage } from "../data/MockUpSlidesWhiteImage";
import { useNavigate } from "react-router-dom";
const CoatingPageGun = () => {
  const [dataImageBlack] = useState(MockUpSlidesBlackImage);
  const [dataImageWhite] = useState(MockUpSlidesWhiteImage);
  const navigate = useNavigate();
  return (
    <div className="container-CoatingPageGun">
      <div className="header-CoatingPageGun">
        <h1>Gun Protection Coating</h1>
      </div>

      <div className="content-series">
        <div className="text-box">
          <p>
            <span>GUN Protection Series 1</span>
            <br />
            น้ำยาพ่นกันสนิมสีดำเงา สูตรน้ำ 100% ราคาและคุณภาพดีที่สุดในประเทศไทย
            <br />
            นำเข้าจากมาเลเซียเมืองร้อยเกาะ
            ผู้เชี่ยวชาญด้านกรดเกลือที่มีทะเลล้อมรอบ
            <br />- สำหรับพ่นกันสนิมใต้ท้องรถยนต์
            <br />- ไม่ลอกล่อน สูตรน้ำ100%
            <br />- ไม่กัดซีลยาง ไม่ติดไฟ ไม่มีสารระเหย ไม่มีสารก่อมะเร็ง
            <br />- ยืดหยุ่นได้ตามการเคลื่อนไหวต่อตัวรถ
            <br />- ไม่ติดไฟ ไม่ลามไฟ
            <br />- ไม่มีกลิ่นเหม็น
            <br />- เป็นมิตรกับสิ่งแวดล้อม
            <br />- สามารถย่อยสลายได้เองตามธรรมชาติ
            <br />- มีสีดำเงาสวยงาม
            <br />- สามารถหยุดการลามของสนิมได้จริง
            <br />- ทนต่อน้ำทะเล และแช่น้ำได้นานกว่า 128 ชั่วโมง
          </p>
        </div>
        <img src="/public/assets/gun/tanks/tank-black.png" alt="tank-black" />
      </div>

      <div className="content-preview">
        <div className="slide-track">
          {dataImageBlack.map((item, index) => {
            return (
              <div className="slide" key={index}>
                <img src={item.image} alt="image" />
              </div>
            );
          })}
        </div>
      </div>

      <hr />

      <div className="content-series">
        <img src="/public/assets/gun/tanks/tank-white.png" alt="tank-white" />
        <div className="text-box">
          <p>
            <span>GUN Protection Series 2</span>
            <br />
            น้ำยาพ่นกันสนิมสีใส สูตรน้ำ 100% ราคาและคุณภาพดีที่สุดในประเทศไทย
            <br />
            นำเข้าจากมาเลเซียเมืองร้อยเกาะ
            ผู้เชี่ยวชาญด้านกรดเกลือที่มีทะเลล้อมรอบ
            <br />- สำหรับพ่นกันสนิมใต้ท้องรถยนต์
            <br />- ไม่ลอกล่อน สูตรน้ำ100%
            <br />- ไม่กัดซีลยาง ไม่ติดไฟ ไม่มีสารระเหย ไม่มีสารก่อมะเร็ง
            <br />- ยืดหยุ่นได้ตามการเคลื่อนไหวต่อตัวรถ
            <br />- ไม่ติดไฟ ไม่ลามไฟ - ไม่มีกลิ่นเหม็น
            <br />- เป็นมิตรกับสิ่งแวดล้อม
            <br />- สามารถย่อยสลายได้เองตามธรรมชาติ
            <br />- มีสีเงาใสสวยงาม
            <br />- สามารถหยุดการลามของสนิมได้จริง
            <br />- ทนต่อน้ำทะเล และแช่น้ำได้นานกว่า 128 ชั่วโมง
          </p>
        </div>
      </div>

      <div className="content-preview">
        <div className="slide-track">
          {dataImageWhite.map((item, index) => {
            return (
              <div className="slide" key={index}>
                <img src={item.image} alt="image" />
              </div>
            );
          })}
        </div>
      </div>

      <hr />

      <div className="content-kats">
        <div className="header-CoatingPageKats">
          <h3>KATS COATINGS</h3>
        </div>

        <div className="image-kats">
          <img className="katoon" src="/public/assets/katoon.png" alt="" />
          <img className="logokats" src="/public/assets/logokats.jpg" alt="" />
        </div>

        <Link
          to="Home"
          smooth={true}
          duration={200}
          onClick={() => {
            navigate("/kats");
          }}
        >
          <div className="btn-kats">ข้อมูลเพิ่มเติม</div>
        </Link>
      </div>
    </div>
  );
};

export default CoatingPageGun;
