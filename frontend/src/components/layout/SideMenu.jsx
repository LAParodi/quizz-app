import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";

const SideMenu = ({ activeMenu }) => {
  const { clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogOut();
      return;
    }

    navigate(route);
  };

  const handleLogOut = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-gray-50/50 border-r border-neutral-200/70 p-5 sticky top-[61px] z-20">
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label ? "text-white bg-black" : ""
          } py-4 px-6 rounded-full mb-3 cursor-pointer transition-all hover:scale-[1.05]`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
