"use client";
import { addressType } from "@/lib/models/AddressModel";
import { OrderItem, OrderType } from "@/lib/models/OrderModel";
import { orderProdductByAddress } from "@/store/addressSlice";
import { getAddressById } from "@/store/getaddressSlice";
import { PostOrderDetailes } from "@/store/OrderDetailesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import shippingValidationSchema from "@/utils/schema/shippingSchema";
import { useFormik } from "formik";
import React, {useEffect, useState } from "react";
import { LuPackageCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import mongoose from "mongoose";
import { deleteCartByUserId } from "@/store/deleteCartByUserIdSlice";
import { getCartByUserId } from "@/store/getCartSlice";
const ShippingPage = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isaddressSelectedId, setIsAddressSelectedId] = useState<string | null>(
    null
  );
  const [orderData, setOrderData] = useState<OrderType | null>(null);

  const [userAddressDetailes, setUserAddressDetailes] = useState<
    addressType[] | null
  >(null);
  const addressDetails = useAppSelector((store) => store.getAddressById);
  const dispatch = useAppDispatch();
  const initialValues: addressType = {
    fullname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    addressType: "home",
    paymentMethod: "",
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }
    setUserId(userId as string);
    const orderData = localStorage.getItem("orderDetails");
    const data = orderData ? JSON.parse(orderData) : null;
    console.log(data);
    data.items.forEach((item: OrderItem) => {
      item.product.productId = new mongoose.Types.ObjectId(
        item.product.productId
      );
    });
    if (data) setOrderData(data);
  }, []);
  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema: shippingValidationSchema,
      onSubmit: (value, action) => {
        // console.log(value);
        dispatch(orderProdductByAddress(value))
          .then((res) => {
            if (res.payload.success) {
              if (orderData) {
                orderData.addressId = res.payload.data._id;
                orderData.paymentMethod = value.paymentMethod;
                dispatch(PostOrderDetailes(orderData))
                  .then((res) => {
                    // console.log(res.payload);
                    if (res.payload.success) {
                      toast.success(res.payload.message);

                      console.log("user id is here", userId);
                      if (userId)
                        dispatch(deleteCartByUserId(userId)).then((res) => {
                          console.log(res);
                          if (res.payload.success) {
                            dispatch(getCartByUserId())
                              .then((res) => {
                                console.log(res);
                                if (res.payload.success) {
                                  action.resetForm();
                                } else {
                                  toast.success(res.payload.message);
                                }
                              })
                              .catch((error) => {
                                toast.error(error.message);
                              });
                            // toast.success(res.payload.message);
                          } else {
                            toast.error(res.payload.message);
                          }
                        });
                    } else {
                      toast.error(res.payload.message);
                    }
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  });
              }
            } else {
              toast.error(res.payload.message);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  useEffect(() => {
    dispatch(getAddressById());
  }, []);
  useEffect(() => {
    if (!addressDetails.isError && !addressDetails.isLoading) {
      setUserAddressDetailes(addressDetails.addressDetails);
    }
  }, [addressDetails]);
  // console.log(orderData);
  return (
    <div className="px-20">
      <div className="font-semibold text-3xl flex gap-1 items-center ">
        {" "}
        <p className="w-16 h-1 bg-[#282C35] rounded-full "></p>
        <div className="text-3xl font-extrabold font-Inter text-[#282C35] flex items-center gap-1">
          <p>Shipping Detailes</p>{" "}
          <p>
            <LuPackageCheck />
          </p>
        </div>{" "}
      </div>
      {showForm ? (
        <form
          className="bg-gray-100  rounded-lg shadow p-10 mt-5"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-3 gap-y-3 gap-x-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Full Name*</label>
              <input
                type="text"
                name="fullname"
                value={values.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300  px-4 outline-none py-2 text-sm rounded-lg text-gray-700"
                placeholder="Enter your full name"
              />
              {touched.fullname && errors.fullname && (
                <p className="text-red-800 text-sm">{errors.fullname}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">State*</label>
              <input
                type="text"
                name="state"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300  px-4 outline-none py-2 text-sm rounded-lg text-gray-700"
                placeholder="Enter  your full name"
              />
              {touched.state && errors.state && (
                <p className="text-red-800 text-sm">{errors.state}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Address*</label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300  px-4 outline-none py-2 text-sm rounded-lg text-gray-700"
                placeholder="Enter  your full name"
              />
              {touched.address && errors.address && (
                <p className="text-red-800 text-sm">{errors.address}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">City*</label>
              <input
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300  px-4 outline-none py-2 text-sm rounded-lg text-gray-700"
                placeholder="Enter  your full name"
              />
              {touched.city && errors.city && (
                <p className="text-red-800 text-sm">{errors.city}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Phone*</label>
              <input
                type="text"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300  px-4 outline-none py-2 text-sm rounded-lg text-gray-700"
                placeholder="Enter  your full name"
              />
              {touched.phone && errors.phone && (
                <p className="text-red-800 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Address Type*</label>
              <select
                name="addressType"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.addressType}
                className="border border-gray-300 px-4 py-2 outline-none rounded-lg"
              >
                <option value="">Choose address type</option>

                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
              {touched.addressType && errors.addressType && (
                <p className="text-red-800 text-sm">{errors.addressType}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Payment Method*</label>
              <select
                name="paymentMethod"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.addressType}
                className="border border-gray-300 px-4 py-2 outline-none rounded-lg"
              >
                <option value="">Choose paymen method</option>

                <option value="COD">COD</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
              {touched.paymentMethod && errors.paymentMethod && (
                <p className="text-red-800 text-sm">{errors.paymentMethod}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Country*</label>
              <select
                name="country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 px-4 py-2 outline-none rounded-lg"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                <option value="Brazil">Brazil</option>
                <option value="South Africa">South Africa</option>
              </select>
              {touched.country && errors.country && (
                <p className="text-red-800 text-sm">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="px-10 py-2 cursor-pointer bg-gray-950 text-white rounded-lg"
            >
              Order Placed
            </button>
            <p
              className="text-sm cursor-pointer underline pt-2 text-black font-Inter font-semibold"
              onClick={() => setShowForm(false)}
            >
              Choose previous address
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-1 text-sm text-gray-700 flex flex-col gap-2 bg-gray-100 w-full  rounded-lg shadow p-8 mt-5">
          <div className="flex justify-between items-center w-full">
            <p className="text-xl font-bold">Choose Address</p>
            <button
              className="text-white px-5 py-2 rounded-lg bg-gray-950 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              Add Address
            </button>
          </div>
          {(userAddressDetailes || []).map((adderess) => (
            <div
              onClick={() => {
                if (adderess._id != null) {
                  setIsAddressSelectedId(adderess._id);
                }
              }}
              key={adderess._id}
              className={`grid ${
                isaddressSelectedId === adderess._id ? "bg-white" : ""
              } grid-cols-3 gap-3 border-b border-b-gray-400 rounded-lg p-3 cursor-pointer hover:bg-white`}
            >
              <p>
                <span className="font-medium">Full Name:</span>{" "}
                {adderess.fullname}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {adderess.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {adderess.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {adderess.city}
              </p>
              <p>
                <span className="font-medium">State:</span> {adderess.state}
              </p>
              <p>
                <span className="font-medium">Country:</span> {adderess.country}
              </p>
              <p>
                <span className="font-medium">Address Type:</span>{" "}
                {adderess.addressType}
              </p>
            </div>
          ))}
          <button
            className={`px-5 py-2 rounded-lg text-white ${
              isaddressSelectedId
                ? "bg-gray-950 cursor-pointer"
                : "bg-gray-950/70 cursor-no-drop"
            }`}
          >
            Order placeholder
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingPage;
