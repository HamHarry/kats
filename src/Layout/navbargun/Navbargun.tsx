import { Link } from "react-scroll";
import "./Navbargun.css";
import { useNavigate } from "react-router-dom";
const NavbarGun = () => {
  const navigate = useNavigate();

  return (
    <div className="NavbarGun">
      <div className="logo">
        <Link
          to="Home"
          smooth={true}
          duration={200}
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="/public/assets/logoG.png" alt="logo" />
        </Link>
      </div>
      <div className="list-menu">
        <ul>
          <li>
            <Link
              to="Home"
              smooth={true}
              duration={200}
              onClick={() => {
                navigate("/");
              }}
            >
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link to="Bookingkats" smooth={true} duration={200}>
              ตรวจสอบคิว
            </Link>
          </li>
          <li>
            <Link to="Productkats" smooth={true} duration={200}>
              สินค้า
            </Link>
          </li>
          <li>
            <Link to="Mapkats" smooth={true} duration={200}>
              แผนที่
            </Link>
          </li>
          <li
            onClick={() => {
              navigate("login");
            }}
          >
            เข้าสู่ระบบ
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarGun;
