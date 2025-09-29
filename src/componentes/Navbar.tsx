"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import cookie from "js-cookie";
import { FaShoppingCart } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCartByUserId } from "@/store/getCartSlice";
import { RoleContext } from "@/lib/contex/roleContext";
const Navbar = () => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const count = useAppSelector((store) => store.getCartData.cartData);
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
        menuName: "Contact Us",
        route: "/user/contactUs",
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
  // const getRole = () => {
  //   const role = localStorage.getItem("role");
  //   console.log(role);
  //   if (role) {
  //     setRole(role);
  //   }
  // };
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("role");
    cookie.remove("token");
    setRole(null);
    router.push("/login");
    setShowProfile(false);
  };
  useEffect(() => {
    dispatch(getCartByUserId());
  }, []);
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);
  console.log(role);
  if (!role) return;
  const menuItems = MENU_MAP[role] || [];
  return (
    <>
      {role != null && (
        <div className="py-5 my-5 px-5 flex  justify-between w-full bg-gray-50 border border-[#FDFEF9] text-black shadow rounded-md  ">
          <div>
            {/* <Image src="/images/logo3.png" height={200} width={200} alt="logo" /> */}
            lOGO
          </div>
          <div className="flex gap-4 items-center  font-semibold text-base">
            {menuItems.map((nav, index) => (
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
            {role === "user" && (
              <div className="text-black flex px-3 py-1 cursor-pointer items-center gap-1 rounded-lg hover:bg-[#ACBBA2]">
                <FaShoppingCart />
                <div
                  className="text-base relative w-fit"
                  onClick={() => router.push("/user/cart")}
                >
                  <p>Cart</p>
                  {count?.length != 0 && (
                    <p className="w-6 h-6 absolute top-[-12px] right-[-15px] flex justify-center items-center bg-black text-white rounded-full text-base">
                      {count ? count.length : 0}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="text-black ">
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
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
