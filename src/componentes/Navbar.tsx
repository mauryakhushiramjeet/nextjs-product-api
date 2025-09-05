"use client";
import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
const Navbar = () => {
  const navbarMenu: string[] = ["Home", "Shopping", "About us", "Contact us"];

  return (
    <div className="py-3 my-5 px-5 flex  justify-between w-full bg-white text-black shadow rounded-md">
      <div>logo</div>
      <div className="flex gap-[200px] items-center">
        <div className="flex gap-6 items-center font-semibold text-base">
          {navbarMenu.map((nav, index) => (
            <div className="" key={index}>
              {nav}
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
          <div className="text-black">
            <FaRegUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
