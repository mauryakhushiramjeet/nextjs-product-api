import { useParams } from "next/navigation";
import React from "react";

const OrderDetailesapge = () => {
  const { orderId } = useParams();
  console.log(orderId);
  return <div>OrderDetailes</div>;
};

export default OrderDetailesapge;
