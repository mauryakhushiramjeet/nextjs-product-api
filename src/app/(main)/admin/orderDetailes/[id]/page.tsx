"use client";
import {
  getOrderDetailes,
  GetOrderDetailsTypes,
} from "@/store/getOrderDetailsByOrderIdSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";

const OrderDetailesapge = () => {
  const [orderDetails, setOrderDetails] = useState<GetOrderDetailsTypes | null>(
    null
  );
  const details = useAppSelector((store) => store.getOrderbyOrderId);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id != null) dispatch(getOrderDetailes(id as string));
  }, [id]);
  useEffect(() => {
    if (!details.isError || !details.isLoading || details.getOrderDetails) {
      setOrderDetails(details?.getOrderDetails);
      details.getOrderDetails?.items.map((product) =>
        console.log(typeof product.product.productId?.image)
      );
    }
  }, [details]);
  if (details?.isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-spin text-blue-500">
          <LuLoaderCircle size={60} />
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">#{orderDetails?._id}</h1>
            <p className="mt-1">
              Status :{"   "}
              <span
                className={`${
                  orderDetails?.status == "cancelled"
                    ? "bg-red-600"
                    : "bg-green-600"
                } px-2 py-1 rounded-full capitalize text-sm font-semibold`}
              >
                {orderDetails?.status}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Payment Method</p>
            <p className="font-semibold text-lg">
              {orderDetails?.paymentMethod}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2 mb-2">Customer</h2>
          <p className="text-gray-800 font-medium">
            {orderDetails?.userId?.name}
          </p>
          <p className="text-gray-500">{orderDetails?.userId?.email}</p>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2 mb-2">
            Shipping Address
          </h2>
          <p className="text-gray-700">
            Address: {orderDetails?.addressDetails?.address}
          </p>
          <p className="text-gray-700">
            City/State: {orderDetails?.addressId?.city} ,{" "}
            {orderDetails?.addressId?.state}
          </p>
          <p className="text-gray-700">
            Country: {orderDetails?.addressId?.country}
          </p>
          <p className="text-gray-500">
            Phone: {orderDetails?.addressId?.phone}
          </p>
          <p className="text-gray-500">
            Type: {orderDetails?.addressId?.addressType}
          </p>
        </div>

        {/* Items Card */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Items</h2>
          <div className="divide-y divide-gray-200">
            <div className=" flex flex-col gap-1">
              {orderDetails?.items.map((product, index) => (
                <div
                  className="flex flex-col md:flex-row md:items-center md:justify-between py-2"
                  key={index}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={product.product.productId?.image}
                      alt="Gold necklace"
                      width={200}
                      height={100}
                      className="rounded-xl object-cover h-[100px] w-[200px]"
                    />
                    {/* <p>{product?.product.image}</p> */}
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.product.productName}
                      </p>
                      <p className="text-gray-500">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 md:mt-0 font-semibold text-gray-900">
                    Price : ₹{product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg">
          <h2 className="text-xl font-bold">Total</h2>
          <p className="text-xl font-semibold">
            ₹{orderDetails?.totalAmount}.00{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailesapge;
