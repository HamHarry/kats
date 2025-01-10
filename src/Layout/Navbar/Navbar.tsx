import { Link } from "react-scroll";
import "./Navbar.css";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="Home" smooth={true} duration={200}>
          <img src="/public/assets/logokats.jpg" alt="logo" />
        </Link>
      </div>
      <div className="list-menu">
        <ul>
          <li>
            <Link to="Product" smooth={true} duration={200}>
              Product
            </Link>
          </li>
          <li>
            <Link to="Booking" smooth={true} duration={200}>
              Booking
            </Link>
          </li>
          <li>
            <Link to="Map" smooth={true} duration={200}>
              map
            </Link>
          </li>
          <li>Login</li>
          <li>Register</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
