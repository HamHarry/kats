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
          <img src="/assets/logoG.png" alt="logo" />
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
              หน้าหลัก
            </Link>
          </li>

          <li>
            <Link to="coatingGun" smooth={true} duration={200}>
              Coating
            </Link>
          </li>

          <li>
            <Link to="bookingGun" smooth={true} duration={200}>
              ตรวจสอบคิว
            </Link>
          </li>

          <li>
            <Link to="GunGuard" smooth={true} duration={200}>
              Guard
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
