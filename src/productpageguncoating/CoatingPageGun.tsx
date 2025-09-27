import { useState } from "react";
import "./CoatingPageGun.css";
import { MockUpSlidesBlackImage } from "../data/MockUpSlideBlackImage";
import { MockUpSlidesWhiteImage } from "../data/MockUpSlidesWhiteImage";
import { MockUpLatkrabang, MockUpTheparak } from "../data/MockUpTheparak";
import { Carousel } from "antd";
import { DampData } from "../data/MockUpSlideDamp";
const CoatingPageGun = () => {
  const [dataImageBlack] = useState(MockUpSlidesBlackImage);
  const [dataImageWhite] = useState(MockUpSlidesWhiteImage);
  const [dataImageTheparak] = useState(MockUpTheparak);
  const [dataImageLatkrabang] = useState(MockUpLatkrabang);
  const [dataImageDamp] = useState(DampData);

  return (
    <div className="container-CoatingPageGun" id="coatingGun">
      <div className="header-CoatingPageGun">
        <h1>Gun Coatings</h1>
      </div>

      <div className="content-series">
        <div className="text-box">
          <p>
            <span>GUN Protection Series 1 & Series 2</span>
            <br />
            น้ำยาพ่นกันสนิมสีดำเงา สูตรน้ำ 100% ราคาและคุณภาพดีที่สุดในประเทศไทย
            <br />
            นำเข้าจากสหรัฐอเมริกา
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
        <Carousel autoplay className="tanks">
          <img src="/assets/gun/tanks/black-tank.png" alt="tank-black" />
          <img src="/assets/gun/tanks/white-tank.png" alt="tank-white" />
        </Carousel>
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

          {dataImageWhite.map((item, index) => {
            return (
              <div className="slide" key={index}>
                <img src={item.image} alt="image" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="content-series">
        <img src="/assets/gun/tanks/tankDamp.png" alt="tank-Damp" />
        <div className="text-box">
          <p>
            <span>GUN Protection Series 3</span>
            <br />
            น้ำยาพ่นกันสนิมแบบเก็บเสียงพร้อมกันกระแทก
            <br />
            นำเข้าจากสหรัฐอเมริกา
            <br />- กันกระแทก กันเสียง กันสนิมในตัวเดียวกัน 3in1
            <br />- ไม่ลอกล่อน สูตรน้ำ100%
            <br />- ไม่กัดซีลยาง ไม่ติดไฟ ไม่มีสารระเหย ไม่มีสารก่อมะเร็ง
            <br />- ยืดหยุ่นได้ตามการเคลื่อนไหวต่อตัวรถเพิ่มน้ำหนักเบาไม่เกิน 2Kg./คัน
            <br />- ลดเสียงรบกวนจากพื้นห้องโดยสารได้ 50-60%
            <br />- ไม่ต้องรื้อห้องโดยสาร
            <br />- ติดทนถาวร 10 ปี
          </p>
        </div>
      </div>

      <div className="content-preview-damp">
        <video src="/assets/gun/MYOMK75_01.mov" autoPlay loop muted controls />

        <div className="container-preview-damp">
          <div className="header-preview-damp">
            <h1>ตัวอย่างรถ Mazda 2</h1>
          </div>

          <img src="/assets/gun/damps/mazda/mazda.png" alt="" />

          <div className="content-slide-Damp">
            <div className="slide-Damp">
              {dataImageDamp.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}

              {dataImageDamp.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="poster-row">
        <img src="/assets/gun/poster2.jpg" alt="poster" />
        <img src="/assets/gun/poster3.jpg" alt="poster" />
        <img src="/assets/gun/poster1.jpg" alt="poster" />
        <img src="/assets/gun/poster4.jpg" alt="poster" />
      </div>

      <div className="header-CoatingPageGun">
        <h1>สาขาที่เปิดบริการ</h1>
      </div>

      <div className="branch-theparak">
        <div className="text-box-theparak">
          <p>
            ศูนย์พ่นกันสนิม GUN Protection
            <br />
            สาขาเทพารักษ์
          </p>

          <img src="/assets/gun/theparak/theparak.jpg" alt="map" />

          <button
            type="button"
            onClick={() => {
              window.open(
                "https://www.google.com/maps/place/%E0%B8%A8%E0%B8%B9%E0%B8%99%E0%B8%A2%E0%B9%8C%E0%B8%9E%E0%B9%88%E0%B8%99%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B4%E0%B8%A1%E0%B8%A3%E0%B8%96%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B9%8C+KATS+Coatings+%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B9%8C/@13.5987354,100.6863939,14z/data=!4m6!3m5!1s0x311d5f2ec0d6d80f:0xe42c9067c9826cb!8m2!3d13.6073104!4d100.6883421!16s%2Fg%2F11tn7hqyqn?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D"
              );
            }}
          >
            แผนที่
          </button>
        </div>
        <div className="image-preview-theparak">
          <img
            src="/assets/gun/gunpage.jpg"
            alt="page"
            onClick={() => {
              window.open("https://www.facebook.com/guncoatings");
            }}
          />
          <div className="content-preview-theparak">
            <div className="slide-track-theparak">
              {dataImageTheparak.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}

              {dataImageTheparak.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="branch-theparak">
        <div className="text-box-theparak">
          <p>
            ศูนย์พ่นกันสนิม GUN Protection
            <br />
            สาขาลาดกระบัง
          </p>

          <img src="/assets/G_latkrabang.jpg" alt="map" />

          <button
            type="button"
            onClick={() => {
              window.open("https://maps.app.goo.gl/BovCTtAYmZAiPyd79?g_st=ipc");
            }}
          >
            แผนที่
          </button>
        </div>
        <div className="image-preview-theparak">
          <img
            src="/assets/gun/latkrabang/gunlatkrabangpage.jpg"
            alt="page"
            onClick={() => {
              window.open("https://www.facebook.com/profile.php?id=100063764464833");
            }}
          />
          <div className="content-preview-theparak">
            <div className="slide-track-theparak">
              {dataImageLatkrabang.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}

              {dataImageLatkrabang.map((item, index) => {
                return (
                  <div className="slide" key={index}>
                    <img src={item.image} alt="image" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <hr className="line-hr" />
    </div>
  );
};

export default CoatingPageGun;
