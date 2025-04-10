import { Link } from "react-scroll";
import "../navbarkats/Navbarkats.css";
import { useNavigate } from "react-router-dom";
const NavbarCalendar = () => {
  const navigate = useNavigate();

  return (
    <div className="Navbarkats">
      <div className="logo">
        <Link
          to="Home"
          smooth={true}
          duration={200}
          onClick={() => {
            navigate("/kats");
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
                navigate("/kats");
              }}
            >
              หน้าแรก
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarCalendar;
