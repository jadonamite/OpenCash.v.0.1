import logo from "../assets/Fulllogo.png";

const Logo = () => {
   return (
      <img
         src={logo}
         alt="OpenCash Logo"
         className=" object-cover rounded-lg w-45 h-14"
      />
   );
};

export default Logo;
