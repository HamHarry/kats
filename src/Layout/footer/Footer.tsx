import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <p>ติดต่อสอบถามเพิ่มเติม</p>
      <div
        className="contact"
        onClick={() =>
          window.open("https://www.facebook.com/profile.php?id=100063764464833")
        }
      >
        <p>: เพจ Facebook ศูนย์พ่นกันสนิมรถยนต์ KATS Coatings ลาดกระบัง</p>
      </div>
    </div>
  );
};

export default Footer;