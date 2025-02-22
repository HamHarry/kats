import { Link } from "react-scroll";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">
        <Link
          to="Home"
          smooth={true}
          duration={200}
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="/public/assets/logokats.jpg" alt="logo" />
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
            <Link to="Booking" smooth={true} duration={200}>
              ตรวจสอบคิว
            </Link>
          </li>
          <li>
            <Link to="Product" smooth={true} duration={200}>
              สินค้า
            </Link>
          </li>
          <li>
            <Link to="Map" smooth={true} duration={200}>
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

export default Navbar;
