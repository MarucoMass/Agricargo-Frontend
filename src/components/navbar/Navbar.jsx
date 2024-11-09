// import SearchForm from "../searchForm/SearchForm";
import Button from "../button/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDarkModeContext } from "../context/DarkModeProvider";
import { RxMoon, RxSun } from "react-icons/rx";

const Navbar = ({searchInNav, islogged, backButton}) => {

  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const searchingCLass = searchInNav ? "w-4/5 flex justify-between" : "";
  const navigate = useNavigate();

  const flexSpacing = backButton ? "justify-between" : "justify-end";

  return (
    <nav className={`w-full h-28 fixed top-0 left-0 z-30 flex ${flexSpacing} pl-8 md:pl-80 items-center pr-8 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
      {backButton && (
        <Button
          className={"rounded-lg py-2 px-4 mr-[0%] justify-self-center"}
          bgColor="bg-gray-500"
          actionClick={() => navigate(-1, { replace: true })}
        >
          Volver
        </Button>
      )}
      <div className={searchingCLass}>
        {/* {searchInNav && <SearchForm isSearchMode={false} />} */}

        <ul className="flex items-center gap-8">
          <li>    
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-between w-16 h-8 px-1 bg-gray-300 dark:bg-gray-700 rounded-full focus:outline-none transition-colors duration-300"
            >
              <div
                className={`flex w-6 h-6 bg-white dark:bg-yellow-500 rounded-full transform transition-transform duration-300 ${
                  darkMode ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {darkMode ? (
                  <RxMoon className="w-4 h-4 text-white m-auto" />
                ) : (
                  <RxSun className="w-4 h-4 text-yellow-500 m-auto" />
                )}
              </div>
            </button>
          </li>
          <li>
            {islogged ? (
              <div className="relative size-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg
                  className="absolute size-10 text-gray-400 -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            ) : (
              <Link to={"/login"}>
                <Button className={"rounded-lg py-2 px-4"}>Login</Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
