import "./Footergun.css";
const FooterGun = () => {
  return (
    <div className="FooterGun">
      <p>ติดต่อสอบถามเพิ่มเติม</p>
      <div
        className="contact"
        onClick={() => window.open("https://www.facebook.com/guncoatings/")}
      >
        <p>
          : เพจ Facebook GUN Protection Coatings พ่นกันสนิมรถยนต์สูตรน้ำ
          ไร้กลิ่น ปลอดภัย เพจหลัก
        </p>
      </div>
    </div>
  );
};

export default FooterGun;
