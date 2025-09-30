"use client";
import { getOrder } from "@/store/getOrderSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { OrderItem, OrderType } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";
import { LuLoaderCircle } from "react-icons/lu";
import { UpdateStatusById } from "@/store/updateStatusSlice";
import { toast } from "react-toastify";

export type OrderStatusType = {
  id: string;
  status: string;
};
const AdminOrderpage = () => {
  const [status, setStatus] = useState<OrderStatusType[]>([]);

  const [order, setOrder] = useState<OrderType[] | null>(null);
  const orderDetails = useAppSelector((store) => store.getOrderDetails);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getOrder());
  }, []);
  useEffect(() => {
    if (
      !orderDetails.isError &&
      !orderDetails.isLoading &&
      orderDetails.orderData
    ) {
      setOrder(orderDetails.orderData);
      const orderStatus =
        orderDetails?.orderData?.map((order) => ({
          id: order._id ?? "",
          status: order.status ?? "pending",
        })) || [];
      if (orderStatus != undefined) {
        setStatus(orderStatus);
      }
    }
  }, [orderDetails]);
  console.log(order);

  const handleOrderStatus = (id: string, status: string) => {
    console.log(id, status);
    dispatch(UpdateStatusById({ id, status }))
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
    setStatus((prev) =>
      prev.map((s) => (s.id == id ? { ...s, status: status } : s))
    );
  };
  console.log(status);

  if (orderDetails.isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-spin text-blue-500">
          <LuLoaderCircle size={60} />
        </p>
      </div>
    );
  return (
    <div className="w-full font-Inter mt-[112px]">
      {order && order.length > 0 ? (
        <div className="px-10">
          <div className="font-semibold text-3xl flex gap-1 items-center ">
            <p className="w-16 h-1 bg-[#282C35] rounded-full "></p>
            <div className="text-3xl font-extrabold font-Inter text-[#282C35] flex items-center gap-1">
              <p>Orders</p>
            </div>
          </div>

          <div className="bg-gray-100 p-5 w-full mt-6 shadow">
            <p className="text-lg text-gray-700">
              You have {order.length} order(s)
            </p>

            <div className="overflow-y-auto max-h-[500px] mt-[10px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Sr.No
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Product Name
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Payment Method
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Total Amout
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Status
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Order Date
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`${
                        index % 2 == 0 ? "bg-gray-200" : "bg-gray-50"
                      } relative  border-b border-b-gray-300`}
                    >
                      <td className="px-2   cursor-pointer ">{index + 1}</td>

                      <td className="py-3 px-2 text-left">
                        {item.items.map((product: OrderItem, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 cursor-pointer "
                          >
                            <div className="flex gap-2 line-clamp-1">
                              <p>{product.product.productName}</p>
                              <p>X{product.quantity}</p>
                              <p>{product.price}.00 Rs</p>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-2 ">{item.paymentMethod}</td>
                      <td className="py-3 px-2 ">{item.totalAmount}.00 Rs</td>
                      <td className={` py-3 px-[2px] font-medium max-w-[80px]`}>
                        <select
                          disabled={item.status == "cancelled"}
                          onChange={(e) => {
                            handleOrderStatus(
                              item._id as string,
                              e.target.value
                            );
                          }}
                          className={`${
                            item.status === "cancelled"
                              ? " bg-gray-800"
                              : "cursor-pointer"
                          } font-medium bg-transparent border border-gray-400 rounded  py-1`}
                          value={
                            status.find((s) => s.id == item._id)?.status ||
                            "pending"
                          }
                        >
                          <option value="pending" className="px-5">
                            Pending
                          </option>
                          <option value="cancelled">Cancelled</option>
                          <option value="delivered">delivered</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                        </select>
                      </td>
                      {item.createdAt != null && (
                        <td className="py-3 px-2 ">
                          {new Date(item?.createdAt).toLocaleDateString()}
                        </td>
                      )}
                      <td className="py-1 px-2  ">
                        <button
                          onClick={() =>
                            router.push(`/admin/orderDetailes/${item._id}`)
                          }
                          className=" cursor-pointer text-black px-4 py-1 bg-gray-300 rounded-lg text-sm font-bold"
                        >
                          Detailes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[500px] flex-col">
          <div>
            <Image
              src="/images/order.webp"
              alt="empty orders"
              height={200}
              width={200}
            />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            No orders found 📦
          </p>
          <p className="text-gray-500 text-base mt-1">
            Looks like user haven’t placed any orders yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrderpage;
