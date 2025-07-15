import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import { AccountCircleOutlined } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = ({ searchTerm, onSearchChange, handleSearch, user }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  console.log(searchTerm,user)


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex flex-col bg-blue-950 w-full sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap p-3 flex-row sm:flex-row items-center justify-between">
        <Link to="/">
          <div>
            <span className="font-mont text-blue-300 text-4xl font-bold">
              Tender
            </span>
    
          </div>
        </Link>

        <div className="sm:hidden flex items-center">
          <button onClick={toggleDrawer}>
            {isDrawerOpen ? (
              <AiOutlineClose className="text-white text-3xl" />
            ) : (
              <AiOutlineMenu className="text-white text-3xl" />
            )}
          </button>
        </div>

        <div className="relative flex-1 px-4 hidden md:block">
          <div className="absolute color-gray-900 inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <AiOutlineSearch />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="w-full py-2 text-sm text-gray-700 bg-gray-50 rounded-md pl-10 pr-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full bg-blue-400 px-3 flex items-center justify-center hover:bg-blue-600"
          >
            <RiSearchLine className="text-white" />
          </button>
        </div>

        <nav className="hidden md:flex md:ml-auto flex-wrap pl-3 items-center text-base justify-center">
          <Link to="/home">
            <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
              Home
            </span>
          </Link>
          {user && user.role === "company" && (
            <Link to="/createtender">
              <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
                Create
              </span>
            </Link>
          )}
          <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
            Hello,{" "}
            {user?.name.length > 20
              ? user?.name.substring(0, 20) + "..."
              : user?.name}
          </span>
          <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
            <Link
              onClick={() => {
                localStorage.removeItem("token");
              }}
              to="/login"
            >
              <LogoutIcon style={{ color: "white", fontSize: 32 }} />
            </Link>
          </span>
        </nav>

        <div className="hidden md:flex mt-4 md:mt-0">
          <Link to="/myprofile">
            <AccountCircleOutlined style={{ color: "white", fontSize: 32 }} />
          </Link>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 h-full bg-blue-950 p-5 shadow-lg fixed right-0 top-0 z-50">
            <button onClick={toggleDrawer} className="text-white mb-4">
              <AiOutlineClose className="text-3xl" />
            </button>
            <nav className="flex flex-col space-y-4">
              <Link to="/home" onClick={toggleDrawer}>
                <span className="font-mont text-gray-50 text-lg font-bold hover:text-blue-300">
                  Home
                </span>
              </Link>
              {user && user.role === "company" && (
                <Link to="/createtender" onClick={toggleDrawer}>
                  <span className="font-mont text-gray-50 text-lg font-bold hover:text-blue-300">
                    Create
                  </span>
                </Link>
              )}
              <span className="font-mont text-gray-50 text-lg font-bold hover:text-blue-300">
                Hello,{" "}
                {user?.name.length > 20
                  ? user?.name.substring(0, 20) + "..."
                  : user?.name}
              </span>
              <span className="font-mont text-gray-50 text-lg font-bold hover:text-blue-300">
                <Link
                  onClick={() => {
                    localStorage.removeItem("token");
                  }}
                  to="/login"
                >
                  <LogoutIcon style={{ color: "white", fontSize: 32 }} />
                </Link>
              </span>
              <Link to="/myprofile" onClick={toggleDrawer}>
                <AccountCircleOutlined
                  style={{ color: "white", fontSize: 32 }}
                />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
