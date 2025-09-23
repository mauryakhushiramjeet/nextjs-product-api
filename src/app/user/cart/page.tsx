"use client";
import { getCartByUserId } from "@/store/getCartSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { useEffect } from "react";

const CartPage = () => {
  const getCartData = useAppSelector((store) => store.getCartData);
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (userId) {
      dispatch(getCartByUserId());
    }
  }, []);
  if (getCartData) {
    console.log(getCartData);
  }
  return <div>This is cart page</div>;
};

export default CartPage;
