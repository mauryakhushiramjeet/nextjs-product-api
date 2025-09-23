"use client";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import cookie from "js-cookie";
import { FaShoppingCart } from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
const Navbar = () => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  interface MenuType {
    menuName: string;
    route: string;
  }
  const path = usePathname();
  const navbarMenu: MenuType[] = [
    {
      menuName: "Home",
      route: "/",
    },
    {
      menuName: "Shopping",
      route: "/user/shopping",
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
    <div className="py-5 my-5 px-5 flex  justify-between w-full bg-gray-50 border border-[#FDFEF9] text-black shadow rounded-md  ">
      <div>logo</div>
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
        <div className="text-black flex px-3 py-1 cursor-pointer items-center gap-1 rounded-lg hover:bg-[#ACBBA2]">
          <FaShoppingCart />
          <p className="text-base" onClick={()=>router.push("/user/cart")}>Cart</p>
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
  );
};

export default Navbar;
