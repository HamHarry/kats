import "./Footergun.css";
const FooterGun = () => {
  return (
    <div className="FooterGun">
      <p>ติดต่อสอบถามเพิ่มเติม</p>
      <div
        className="contact"
        onClick={() =>
          window.open(
            "https://www.facebook.com/profile.php?id=100063764464833#"
          )
        }
      >
        <p>: เพจ Facebook ศูนย์พ่นกันสนิมรถยนต์ Gun Protection ลาดกระบัง</p>
      </div>
    </div>
  );
};

export default FooterGun;
