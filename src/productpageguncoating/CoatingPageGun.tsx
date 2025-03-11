import { useState } from "react";
import "./CoatingPageGun.css";
import { MockUpSlidesBlackImage } from "../data/MockUpSlideBlackImage";
import { MockUpSlidesWhiteImage } from "../data/MockUpSlidesWhiteImage";
import { MockUpTheparak } from "../data/MockUpTheparak";
import { Carousel } from "antd";
const CoatingPageGun = () => {
  const [dataImageBlack] = useState(MockUpSlidesBlackImage);
  const [dataImageWhite] = useState(MockUpSlidesWhiteImage);
  const [dataImageTheparak] = useState(MockUpTheparak);
  return (
    <div className="container-CoatingPageGun" id="coatingGun">
      <div className="header-CoatingPageGun">
        <h1>Gun Protection Coatings</h1>
      </div>

      <div className="content-series">
        <div className="text-box">
          <p>
            <span>GUN Protection Series 1 & Series 2</span>
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
        <Carousel autoplay className="tanks">
          <img src="/public/assets/gun/tanks/black-tank.png" alt="tank-black" />
          <img src="/public/assets/gun/tanks/white-tank.png" alt="tank-white" />
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
        <img src="/public/assets/gun/tanks/tankDamp.png" alt="tank-Damp" />
        <div className="text-box">
          <p>
            <span>GUN Protection Series 3</span>
            <br />
            น้ำยาพ่นกันสนิมแบบเก็บเสียงพร้อมกันกระแทก
            <br />
            นำเข้าจากมาเลเซียเมืองร้อยเกาะ
            ผู้เชี่ยวชาญด้านกรดเกลือที่มีทะเลล้อมรอบ
            <br />- กันกระแทก กันเสียง กันสนิมในตัวเดียวกัน 3in1
            <br />- ไม่ลอกล่อน สูตรน้ำ100%
            <br />- ไม่กัดซีลยาง ไม่ติดไฟ ไม่มีสารระเหย ไม่มีสารก่อมะเร็ง
            <br />- ยืดหยุ่นได้ตามการเคลื่อนไหวต่อตัวรถเพิ่มน้ำหนักเบาไม่เกิน
            2Kg./คัน
            <br />- ลดเสียงรบกวนจากพื้นห้องโดยสารได้ 50-60%
            <br />- ไม่ต้องรื้อห้องโดยสาร
            <br />- ติดทนถาวร 10 ปี
          </p>
        </div>
      </div>

      <div className="content-preview-damp"></div>

      <div className="poster-row">
        <img src="/public/assets/gun/poster2.jpg" alt="poster" />
        <img src="/public/assets/gun/poster3.jpg" alt="poster" />
        <img src="/public/assets/gun/poster1.jpg" alt="poster" />
        <img src="/public/assets/gun/poster4.jpg" alt="poster" />
      </div>

      <hr className="line-hr" />

      <div className="header-CoatingPageGun">
        <h1>สาขาที่เปิดบริการ</h1>
      </div>

      <div className="branch-theparak">
        <div className="text-box-theparak">
          <p>
            GUN Protection Coatings พ่นกันสนิมรถยนต์
            <br />
            สูตรน้ำ ไร้กลิ่น ปลอดภัย สาขาเทพารักษ์
          </p>
          <img src="/public/assets/gun/theparak/theparak.jpg" alt="map" />
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
          <img src="/public/assets/gun/gunpage.jpg" alt="page" />
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

      <div className="branch-phetburi">
        <div className="text-box-phetburi">
          <p>
            3D auto wash เพชรบุรี
            <br />
            (And Car Detailing Center)
          </p>
          <img src="/public/assets/gun/phetburi/gun_phetburi.jpg" alt="map" />
          <button
            type="button"
            onClick={() => {
              window.open(
                "https://www.google.co.th/maps/place/3D+Auto+wash+เพชรบุรี/@13.101781,99.9415362,17z/data=!4m14!1m7!3m6!1s0x30fd2752e62548ef:0xa9e7acf30e8c0fc2!2zM0QgQXV0byB3YXNoIOC5gOC4nuC4iuC4o-C4muC4uOC4o-C4tQ!8m2!3d13.1017758!4d99.9441111!16s%2Fg%2F11wqnw23bn!3m5!1s0x30fd2752e62548ef:0xa9e7acf30e8c0fc2!8m2!3d13.1017758!4d99.9441111!16s%2Fg%2F11wqnw23bn?hl=th&entry=ttu&g_ep=EgoyMDI1MDMwOC4wIKXMDSoASAFQAw%3D%3D"
              );
            }}
          >
            แผนที่
          </button>
        </div>
        <div className="image-preview-phetburi">
          <img src="/public/assets/gun/phetburi/3D_page.jpg" alt="page" />
          <div className="content-preview-theparak"></div>
        </div>
      </div>
    </div>
  );
};

export default CoatingPageGun;
