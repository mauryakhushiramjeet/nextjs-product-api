"use client";
import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  interface MenuType {
    menuName: string;
    route: string;
  }
  const navbarMenu: MenuType[] = [
    {
      menuName: "Home",
      route: "/",
    },
    {
      menuName: "Shopping",
      route: "/user/Shopping",
    },
    {
      menuName: "Contact Us",
      route: "/user/contactUs",
    },
    {
      menuName: "About Us",
      route: "/user/aboutUs",
    },
  ];
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("role");
    cookie.remove("token");
    router.push("/login");
    setShowProfile(false);
  };
  return (
    <div className="py-3 my-5 px-5 flex  justify-between w-full bg-white text-black shadow rounded-md  ">
      <div>logo</div>
      <div className="flex gap-[200px] items-center">
        <div className="flex gap-4 items-center  font-semibold text-base">
          {navbarMenu.map((nav, index) => (
            <div
              className="hover:bg-[#ACBBA2] px-3 py-1 rounded-lg cursor-pointer"
              key={index}
              onClick={() => router.push(nav.route)}
            >
              {nav.menuName}
            </div>
          ))}
        </div>
        <div className="flex  gap-6 items-center">
          <div>
            <input
              type="text"
              placeholder="search items here.."
              className="px-3 py-2 text-sm rounded-lg outline-none text-gray-500 bg-gray-100"
            />
          </div>
          <div className="text-black">
            <FaRegHeart />
          </div>
          <div className="text-black " onClick={() => setShowProfile(true)}>
            <FaRegUser className="cursor-pointer" />
            {showProfile && (
              <div className="absolute right-[19px] top-[88px] bg-gray-800 rounded-[6px] flex flex-col p-5 gap-2 items-center justify-center">
                <button
                  className="bg-red-500 text-white text-sm cursor-pointer px-5 py-1 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
