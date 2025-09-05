"use client";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BestproductType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BestProductes = () => {
  const [allproductes, setAllProductes] = useState<BestproductType[]>([]);
  const dispatch = useAppDispatch();
  const router=useRouter()
  const productes = useAppSelector((store) => store.products);

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);
  useEffect(() => {
    if (productes && !productes.isError && !productes.loading) {
      setAllProductes(productes.data?.product || []);
    }
  }, [productes]);

  console.log(productes);

  return (
    <div className="mt-10">
      <div className="font-semibold text-3xl flex gap-1 items-center">
        {" "}
        <p className="w-16 h-1 rounded-full bg-black"></p>
        <p className="">Bestseller productes</p>
      </div>
      <div className="grid grid-cols-5 gap-5">
        {(allproductes || []).map((product, index) => (
          <div
            key={index} onClick={() => router.push(`/user/product/${product._id}`)}
            className={`${
              product.bestSeller ? "block" : "hidden"
            } bg-white rounded-xl p-3 flex flex-col gap-2 cursor-pointer`}
          >
            <Image
              src="/images/hero.jpg"
              height={200}
              width={200}
              className="w-full rounded-xl"
              alt={product.name || "product image"}
            />
            <p className="text-gray-800 text-sm font-medium">{product.name}</p>
            <div className="flex w-full justify-between">
              <p className="text-gray-800 text-sm font-medium">
                {product.price} <span className="font-medium">Rs.</span>
              </p>
              <p
                className={`${
                  product.available ? "text-green-600" : "text-red-600"
                } text-sm font-medium`}
              >
                {product.available ? "Available" : "Out of Stock"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestProductes;
