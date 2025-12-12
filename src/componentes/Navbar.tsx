"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import cookie from "js-cookie";
import { FaShoppingCart } from "react-icons/fa";
import { IoMenuSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCartByUserId } from "@/store/getCartSlice";
import { RoleContext } from "@/lib/contex/roleContext";
import Image from "next/image";
import Cookies from "js-cookie";
const Navbar = () => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const count = useAppSelector((store) => store.getCartData.cartData);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { setRole, role } = useContext(RoleContext);
  interface MenuType {
    menuName: string;
    route: string;
  }
  const MENU_MAP: Record<string, MenuType[]> = {
    user: [
      {
        menuName: "Home",
        route: "/",
      },
      {
        menuName: "Shopping",
        route: "/user/shopping",
      },
      {
        menuName: "About Us",
        route: "/user/aboutUs",
      },
      {
        menuName: "Order",
        route: "/user/order",
      },
    ],
    admin: [{ menuName: "Order", route: "/admin/order" }],
  };

  // };
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("role");
    cookie.remove("token");
    // setRole(null);
    router.push("/login");
    setShowProfile(false);
    Cookies.set("token", "");
  };
  useEffect(() => {
    dispatch(getCartByUserId());
  }, []);
  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log("localstorage role", role);
    setRole(role);
  }, []);
  // console.log(role);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!role) return;
  const menuItems = MENU_MAP[role] || [];
  console.log("length of cart items",count?.length)
  return (
    <>
      <header className="px-1 sm:px-5 flex sticky top-0 z-50 right-[2px] justify-between w-full bg-gray-50 border border-[#FDFEF9] text-black shadow rounded-md  ">
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Image
            src="/images/logok.png"
            height={200}
            width={200}
            alt="logo"
            className="h-[75px] md:h-[90px]"
          />
        </div>
        <div className="hidden lg:flex gap-3 items-center  font-semibold text-base">
          {menuItems.map((nav, index) => (
            <div
              className="hover:bg-[#340D0E] hover:text-white px-3 py-1 rounded-lg text-base xl:text-lg 2xl:text-[22px] cursor-pointer"
              key={index}
              onClick={() => router.push(nav.route)}
            >
              {nav.menuName}
            </div>
          ))}
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          {role === "user" && (
            <div className="text-black flex px-3 py-1 cursor-pointer items-center gap-1 rounded-lg">
              <FaShoppingCart />
              <div
                className="text-base relative w-fit"
                onClick={() => router.push("/user/cart")}
              >
                <p className="text-base xl:text-lg 2xl:text-[22px]">Cart</p>
                {count?.length != 0 && (
                  <p className="w-5 lg:w-6 h-5 lg:h-6 absolute top-[-9px] lg:top-[-12px] right-[-15px] flex justify-center items-center bg-black text-white rounded-full text-xs lg:text-base">
                    {count ? count.length : 0}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="text-black text-base xl:text-lg 2xl:text-[22px] relative">
            <FaRegUser
              className="cursor-pointer"
              onClick={() => setShowProfile((prev) => !prev)}
            />
            {showProfile && (
              <div className="absolute z-20 right-[19px] top-[88px] bg-gray-800 rounded-[6px] flex flex-col p-5 gap-2 items-center justify-center">
                <button
                  className="bg-red-500 text-white text-sm cursor-pointer px-5 py-1 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <p
            className="text-xl block lg:hidden w-fit cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <RxCross1 /> : <IoMenuSharp />}
          </p>
          <div
            className={`absolute flex flex-col lg:hidden ${
              isMenuOpen ? "block" : "hidden"
            } gap-8 items-center bg-[#FDFEF9] rounded-bl-xl py-5 right-0 top-[76px] md:top-[90px] w-full sm:w-[50%] font-semibold text-base`}
          >
            {menuItems.map((nav, index) => (
              <div
                className="hover:bg-[#340D0E] hover:text-white px-3 py-1 rounded-lg text-base xl:text-lg 2xl:text-[22px] cursor-pointer"
                key={index}
                onClick={() => {
                  router.push(nav.route);
                  setIsMenuOpen(false);
                }}
              >
                {nav.menuName}
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
