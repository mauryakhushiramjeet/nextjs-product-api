"use client";
import { getOrder } from "@/store/getOrderSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { OrderItem, OrderType } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";

const Orderpage = () => {
  const [order, setOrder] = useState<OrderType[] | null>(null);
  const orderDetails = useAppSelector((store) => store.getOrderDetails);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getOrder());
  }, []);
  useEffect(() => {
    if (!orderDetails.isError && !orderDetails.isLoading) {
      setOrder(orderDetails.orderData);
    }
  }, [orderDetails]);
  console.log(orderDetails.orderData);

  //   if (orderDetails.isLoading)
  //     return (
  //       <div className="flex items-center min-h-screen justify-center">
  //         <p className="animate-spin text-blue-500">
  //           <LuLoaderCircle size={50} />
  //         </p>
  //       </div>
  //     );
  console.log(order);
  return (
    <div className="w-full font-Inter">
      {order && order?.length > 0 ? (
        <div className="px-10">
          <div className="font-semibold text-3xl flex gap-1 items-center ">
            <p className="w-16 h-1 bg-[#282C35] rounded-full "></p>
            <div className="text-3xl font-extrabold font-Inter text-[#282C35] flex items-center gap-1">
              <p>My Orders</p>
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
                      Sr No
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Product Name
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Payment Method
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Status
                    </th>
                    <th className="px-2 py-2 border-b border-gray-400">
                      Order Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((item, index) => (
                    <tr key={item._id} className="border-b border-b-gray-400">
                      <td>{index + 1}</td>
                      <td className="py-3 px-2 border-l border-l-gray-400 text-left">
                        {item.items.map((product: OrderItem, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/user/product/${product.product.productId}`
                              )
                            }
                          >
                            <div className="flex gap-2 line-clamp-1">
                              <p>{product.product.productName}</p>
                              <p>X{product.quantity}</p>
                              <p>{product.price}</p>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-2 border-l border-l-gray-400">
                        {item.paymentMethod}
                      </td>
                      <td className="py-3 px-2 text-green-600 font-medium border-l border-l-gray-400">
                        {item.status}
                      </td>
                      {item.createdAt != null && (
                        <td className="py-3 px-2 border-l border-l-gray-400">
                          {new Date(item?.createdAt).toLocaleDateString()}
                        </td>
                      )}
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
            Looks like you haven’t placed any orders yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orderpage;
