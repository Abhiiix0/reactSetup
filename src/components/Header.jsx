import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className=" border flex justify-between items-center h-24 w-full px-4 md:px-10 xl:px-20 bg-white">
      <Link to="/">OrganSecure</Link>
      <ul className=" hidden md:flex items-center justify-center gap-10">
        <li>
          <Link to="/Donate">Donate</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/Register">Register</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
