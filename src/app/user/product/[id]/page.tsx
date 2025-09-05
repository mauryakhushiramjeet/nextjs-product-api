"use client";
import { getProductById } from "@/store/getProductByIdSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BestproductType } from "@/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const [productDetailes, setProducts] = useState<BestproductType | null>(null);
  const productData = useAppSelector((store) => store.Product);
  console.log(productData);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);
  return <div>page</div>;
};

export default ProductPage;
