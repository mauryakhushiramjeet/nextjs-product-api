"use client";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ProductViewType } from "@/types";
import React, { useEffect, useState } from "react";
import HeadingComponent from "./HeadingComponent";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkelton";

const BestProductes = () => {
  const [allproductes, setAllProductes] = useState<ProductViewType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const bestSeller = true;
  const productes = useAppSelector((store) => store.products);
  const saleForAll = productes?.data?.forAll || false;
  useEffect(() => {
    setLoading(true);
    dispatch(getAllProduct({ bestSeller }));
  }, [dispatch]);
  useEffect(() => {
    if (productes && !productes.isError && !productes.loading) {
      setAllProductes(productes.data?.product || []);
    }
    setLoading(false);
  }, [productes]);
  console.log(productes);
  console.log(loading);
  return (
    <div className="mt-10">
      <HeadingComponent heading="Bestseller productes" />
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {loading
          ? Array(4)
              .fill(null)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          : (allproductes || []).map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                saleForAll={saleForAll}
              />
            ))}
      </div>
    </div>
  );
};

export default BestProductes;
