import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src={`${import.meta.env.BASE_URL}/assets/svg/logo.svg`}
        alt=""
        className="min-w-10 min-h-10 object-contain"
      />
    </Link>
  );
};
