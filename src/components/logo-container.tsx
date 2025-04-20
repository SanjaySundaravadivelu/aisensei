import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src={`${process.env.PUBLIC_URL}/assets/svg/logo.svg`}
        alt=""
        className="min-w-10 min-h-10 object-contain"
      />
    </Link>
  );
};
