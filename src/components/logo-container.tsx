import { Link } from "react-router-dom";
import logo from "/assets/img/name.png";
export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img src={logo} alt="" className="w-25  object-contain" />
    </Link>
  );
};
