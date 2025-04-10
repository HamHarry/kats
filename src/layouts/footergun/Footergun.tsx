import "./Footergun.css";
const FooterGun = () => {
  return (
    <div className="FooterGun">
      <p>ติดต่อสอบถามเพิ่มเติม</p>
      <div
        className="contact"
        onClick={() => window.open("https://www.facebook.com/gunenggroup")}
      >
        <p>: เพจ Facebook Gun-Eng Innovation สำนักงานใหญ่</p>
      </div>
    </div>
  );
};

export default FooterGun;
