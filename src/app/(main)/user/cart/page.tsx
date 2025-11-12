"use client";
import { CartSchemaType } from "@/lib/models/CartModel";
import { IoBagHandleOutline } from "react-icons/io5";
import { getCartByUserId } from "@/store/getCartSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cartDeleteById } from "@/store/cartDeletedBtIdSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { cartDataType } from "../product/[id]/page";
import { addProductInCart } from "@/store/cartSlice";
import mongoose from "mongoose";

const CartPage = () => {
  const [cartProductDetailes, setCartProductDetailes] = useState<
    CartSchemaType[] | null
  >(null);
  const [cartSubtotals, setCartSubTotal] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const router = useRouter();
  const shippingFees: number = 10;
  const getCartData = useAppSelector((store) => store.getCartData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getCartByUserId());
    }
  }, []);
  useEffect(() => {
    if (
      !getCartData.isError &&
      !getCartData.isLoading &&
      getCartData.cartData
    ) {
      setCartProductDetailes(getCartData?.cartData || []);
      const cardSubTotal =
        getCartData?.cartData.reduce(
          (total, product) => total + Number(product.total),
          0
        ) || 0;
      setCartSubTotal(cardSubTotal);
      setTotalAmount(cardSubTotal + shippingFees);
    }
  }, [getCartData]);

  const handleCartDelete = (id: string) => {
    dispatch(cartDeleteById(id))
      .then((res) => {
        console.log(res.payload);
        if (res.payload.success) {
          dispatch(getCartByUserId());
          return;
        } else {
          toast.error(res.payload.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleQuantityeDec = (
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ) => {
    const data: cartDataType = {
      userId: userId,
      productId: productId,
      quantityQuery: true,
    };
    dispatch(addProductInCart(data))
      .then((res) => {
        console.log(res, "res is ");
        if (res.payload.success) {
          toast.success(res.payload.message);
          dispatch(getCartByUserId());
          return;
        } else {
          toast.error(res.payload.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  const handleQuantityeInc = (
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ) => {
    const data: cartDataType = {
      userId: userId,
      productId: productId,
    };
    dispatch(addProductInCart(data))
      .then((res) => {
        console.log(res, "res is ");
        if (res.payload.success) {
          toast.success(res.payload.message);
          dispatch(getCartByUserId());
          return;
        } else {
          toast.error(res.payload.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  console.log(getCartData);

  const handlePlaceOrderDetails = () => {
    const order = {
      totalAmount,
      items: cartProductDetailes?.map((item) => ({
        product: {
          productId: new mongoose.Types.ObjectId(item.productId),
          productName: item.productDetailes.name,
        },
        quantity: item.quantity,
        price: item.productDetailes.price,
      })),
    };
    localStorage.setItem("orderDetails", JSON.stringify(order));
    router.push("/user/shippingDetailes");
  };
  
  return (
    <>
      {cartProductDetailes && cartProductDetailes?.length > 0 ? (
        <div className="w-full font-Inter mt-[112px]">
          <div className="font-semibold text-3xl flex gap-1 items-center ">
            {" "}
            <p className="w-16 h-1 bg-[#282C35] rounded-full "></p>
            <div className="text-3xl font-extrabold font-Inter text-[#282C35] flex items-center gap-1">
              <p>Shopping Cart</p>{" "}
              <p>
                <IoBagHandleOutline />
              </p>
            </div>{" "}
          </div>
          <div className="flex w-full gap-10 mt-[21px] ">
            {" "}
            <div className="bg-white p-4 w-full max-w-[900px]">
              <p className="text-lg text-gray-700">
                You Have{" "}
                {cartProductDetailes ? cartProductDetailes.length : "No"}{" "}
                product in your cart
              </p>

              <div className="overflow-y-auto max-h-[400px] mt-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 border-b border-gray-400">
                        Product
                      </th>
                      <th className="px-2 py-2 border-b border-gray-400">
                        Price
                      </th>
                      <th className="px-2 py-2 border-b text-center border-gray-400">
                        Quantity
                      </th>
                      <th className="px-2 py-2 border-b border-gray-400">
                        Total
                      </th>
                      <th className="px-2 py-2 border-b border-gray-400">
                        {"     "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProductDetailes?.map((item) => (
                      <tr key={item._id} className="">
                        <td className="py-3 px-2 ">
                          <div
                            className="flex gap-5 items-center cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/user/product/${item.productDetailes._id}`
                              )
                            }
                          >
                            <Image
                              src={item.productDetailes.image as string}
                              alt={item.productDetailes.name}
                              height={70}
                              width={70}
                              className="h-[70px] w-[70px] object-cover"
                            />
                            <div className="flex flex-col gap-1">
                              <p>{item.productDetailes.name}</p>
                              <p>
                                {item.productDetailes.available
                                  ? ".Available"
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 ">
                          {item.productDetailes.price} Rs.
                        </td>
                        <td className="py-1 px-3 text-center">
                          <div className="py-1 px-2 border border-gray-400 rounded-xl flex items-center justify-between">
                            <button
                              disabled={item.quantity === 1}
                              className={`w-fit  ${
                                item.quantity === 1
                                  ? "cursor-no-drop"
                                  : "cursor-pointer"
                              }`}
                              onClick={() =>
                                handleQuantityeDec(
                                  new mongoose.Types.ObjectId(item.userId),
                                  new mongoose.Types.ObjectId(item.productId)
                                )
                              }
                            >
                              <AiOutlineMinus />
                            </button>
                            <p>{item.quantity}</p>
                            <button
                              className="w-fit cursor-pointer"
                              onClick={() =>
                                handleQuantityeInc(
                                  new mongoose.Types.ObjectId(item.userId),
                                  new mongoose.Types.ObjectId(item.productId)
                                )
                              }
                            >
                              <GoPlus />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-2 ">{item.total}.00 Rs.</td>
                        <td className="py-1 px-2">
                          <p
                            className=" bg-gray-500 rounded-full w-fit cursor-pointer"
                            onClick={() => {
                              if (item?._id != null) {
                                handleCartDelete(item?._id);
                              }
                            }}
                          >
                            {" "}
                            <RxCross2 color="white" />
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white shadow  w-full max-w-[370px] flex-1 h-fit p-4">
              <p className="text-lg text-gray-700">Cart Totals</p>
              <div className="flex flex-col pt-2 text-gray-500">
                <div className="py-3 border-t border-t-gray-200 flex items-center justify-between">
                  <p>Subtotal</p>
                  <p>{cartSubtotals}.00 Rs</p>
                </div>
                <div className="py-3 border-t border-t-gray-200 flex items-center justify-between text-right">
                  <p>Shipping</p>
                  <div className="flex flex-col gap-1 ">
                    <p>Free Shipping</p>
                    <p>Pickup:{shippingFees}.00 Rs</p>
                    <p className="text-gray-400 text-base underline">
                      Calculate shipping
                    </p>
                  </div>
                </div>
                <div className="py-3 border-t border-t-gray-200 flex items-center justify-between">
                  <p>Total</p>
                  <p>{totalAmount}.00 Rs</p>
                </div>
                <button
                  className="bg-gray-800 text-white w-full cursor-pointer py-2 text-base"
                  // onClick={() => router.push("/user/shippingDetailes")}
                  onClick={() => handlePlaceOrderDetails()}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[500px] flex-col mt-[112px]">
          <div>
            <Image
              src="/images/cartImage.png"
              alt="cartImage"
              height={200}
              width={200}
            />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            Your cart is empty 🛒
          </p>
          <p className="text-gray-500 text-base mt-1">
            {" "}
            Looks like you haven’t added anything yet.
          </p>
          <button
            onClick={() => router.push("/user/shopping")}
            className="px-5 py-2 text-base bg-gray-900 text-white rounded-lg mt-3 cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </>
  );
};

export default CartPage;
