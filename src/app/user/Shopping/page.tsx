"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const ShoppingPage = () => {
  const [allproductes, setAllProductes] = useState<ProductType[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
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
    <div className="mt-10 w-full">
      <p className="text-center font-semibold text-4xl my-3 italic text-[#84927a]">
        Bestseller productes
      </p>
      <div className="grid grid-cols-4 gap-5">
        {(allproductes || []).map((product, index) => (
          <div
            key={index}
            onClick={() => router.push(`/user/product/${product._id}`)}
            className={` bg-white rounded-xl p-3 flex flex-col shadow  gap-2 cursor-pointer`}
          >
            {typeof product.image == "string" && (
              <Image
                src={product.image}
                height={200}
                width={200}
                className="rounded-xl h-[200px] w-full object-cover"
                alt={product.name || "product image"}
              />
            )}
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

export default ShoppingPage;
