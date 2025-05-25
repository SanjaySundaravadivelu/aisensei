import { Outlet } from "react-router-dom";

const AuthenticationLayout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative">
      <img
        src={`${import.meta.env.BASE_URL}/assets/img/bg.png`}
        className="absolute w-full h-full object-cover opacity-20"
        alt=""
      />
      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
