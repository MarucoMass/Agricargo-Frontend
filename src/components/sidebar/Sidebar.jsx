import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useAuthContext } from "../context/AuthProvider";

const Sidebar = ({ userType }) => {
  const { setUserProfile } = useAuthContext();

  const menuOptions = {
    cliente: {
      paths: [
        { name: "Inicio", path: "/" },
        { name: "Mis Reservas", path: "/mis-reservas" },
        { name: "Mis Favoritos", path: "/mis-favoritos" },
      ],
      other: [
        { name: "Ajustes", path: "/ajustes" },
        { name: "Logout", path: "/login" },
      ],
    },
    empresa: {
      paths: [
        { name: "Viajes", path: "/empresa/viajes" },
        { name: "Barcos", path: "/empresa/barcos" },
      ],
      other: [
        { name: "Ajustes", path: "/empresa/ajustes" },
        { name: "Logout", path: "/login" },
      ],
    },
  };

  const handleLogOut = () => {
    setUserProfile({
      username: "",
      password: "",
    });
  };

  const mappedMenuOptions = menuOptions[userType].paths.map(
    (menuOption, index) => (
      <li key={index}>
        <NavLink
          to={menuOption.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-gray-900 rounded-lg dark:text-white hover:transition-all hover:bg-gray-100 dark:hover:bg-gray-700 group ${
              isActive
                ? "text-white bg-blue-700 hover:bg-blue-800"
                : "bg-transparent"
            }`
          }
          end
        >
          <svg
            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 21"
          >
            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
          </svg>
          <span className="ms-3">{menuOption.name}</span>
        </NavLink>
      </li>
    )
  );

  return (
    <aside
      className="fixed flex flex-col items-center justify-between top-0 left-0 z-40 w-60 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <img src={Logo} alt="Logo de Agricargo" className="pt-8" />
      <div className="h-3/4 pt-20 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">{mappedMenuOptions}</ul>
      </div>

      <div className="flex items-center justify-center h-1/4 w-full pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-t border-gray-200">
        <ul className="space-y-2 font-medium">
          <li>
            <NavLink
              to={`/${userType}/ajustes`}
              className="flex items-center px-4 py-3 text-gray-900 rounded-lg dark:text-white hover:transition-all hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ms-3">Ajustes</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={handleLogOut}
              to={"/login"}
              className="flex items-center px-4 py-3 text-gray-900 rounded-lg dark:text-white hover:transition-all hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ms-3">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
