import "./Navbar.css";
const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="Logo">
        <img src="/public/assets/logokats.jpg" alt="logo" />
      </div>
      <div className="List-menu">
        <ul>
          <li>Product</li>
          <li>Booking</li>
          <li>Login</li>
          <li>Register</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
