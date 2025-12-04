"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ProductViewType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeadingComponent from "./HeadingComponent";

const BestProductes = () => {
  const [allproductes, setAllProductes] = useState<ProductViewType[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const bestSeller = true;
  const productes = useAppSelector((store) => store.products);
  const saleForAll = productes?.data?.forAll || false;
  useEffect(() => {
    dispatch(getAllProduct({ bestSeller }));
  }, [dispatch]);
  useEffect(() => {
    if (productes && !productes.isError && !productes.loading) {
      setAllProductes(productes.data?.product || []);
    }
  }, [productes]);
  console.log(productes);
  return (
    <div className="mt-10">
      <HeadingComponent heading="Bestseller productes"/>
      <div className="grid grid-cols-4 gap-5 mt-5">
        {(allproductes || []).map((product, index) => (
          <div
            key={index}
            onClick={() => router.push(`/user/product/${product._id}`)}
            className={`${
              product.bestSeller ? "block" : "hidden"
            } bg-[#F5F6EF] shadow rounded-xl p-3 flex flex-col gap-2 cursor-pointer`}
          >
            {typeof product.image === "string" && (
              <Image
                src={product.image}
                height={200}
                width={200}
                className=" rounded-xl h-[300px] w-[400px] object-cover"
                alt={product.name || "product image"}
              />
            )}
            <div className="flex w-full justify-between">
              <p className="text-gray-800 text-sm font-medium">
                {product.name}
              </p>
              {product.discount && !saleForAll && (
                <p className="text-red-600 font-medium text-lg">
                  Discount {product.discount} %
                </p>
              )}
            </div>
            <div className="flex w-full justify-between">
              {product.discount ? (
                <div className="flex gap-2">
                  <p className="text-gray-500 line-through">{product.price}</p>
                  <p className="text-gray-900 font-medium">
                    {product.discountedPrice}Rs.00
                  </p>
                </div>
              ) : (
                <p className="text-gray-800 text-sm font-medium">
                  {product.price} <span className="font-medium">Rs.</span>
                </p>
              )}

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
