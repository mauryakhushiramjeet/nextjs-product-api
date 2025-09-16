"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getProductById } from "@/store/getProductByIdSlice";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

// import "./styles.css";
const ProductPage = () => {
  const [productDetailes, setProductDetailes] = useState<ProductType | null>(
    null
  );
  const [productRelated, setProductRelated] = useState<ProductType[] | null>(
    null
  );
  const getAllProductData = useAppSelector((store) => store.products);

  const productData = useAppSelector((store) => store.Product);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getProductById(id));
      dispatch(getAllProduct());
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (productData) {
      if (!productData.isError && !productData.loading) {
        setProductDetailes(productData.data);
      }
    }
  }, [productData]);
  useEffect(() => {
    if (
      getAllProductData &&
      !getAllProductData.isError &&
      !getAllProductData.loading &&
      getAllProductData?.data?.product
    ) {
      const categoryRelatedProduct = getAllProductData.data.product.filter(
        (product) =>
          product.category == productDetailes?.category &&
          product._id != productDetailes._id
      );
      setProductRelated(categoryRelatedProduct);
    }
  }, [getAllProductData, productDetailes]);
  if (productRelated) {
    console.log("Product related data is here", productRelated);
  }
  if (productData.loading) return <div>Loading...</div>;
  if (productData.isError) return <div>Something went wrong</div>;
  if (!productData.data) return <div>No product found</div>;
  return (
    <div>
      <div className="grid grid-cols-2 gap-20">
        <div className="">
          <Image
            src="/images/bgimage.jpg"
            alt="product-image"
            height={700}
            width={700}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#1D2939] text-4xl  font-extrabold">
            {productDetailes?.name}
          </p>
          <p className="text-green-500 font-semibold text-2xl">
            {productDetailes?.price} <span>Rs</span>
          </p>
          <p className="text-gray-500 text-xl mt-2 font-roboto">
            {productDetailes?.description}
          </p>
          <p
            className={`text-lg ${
              productDetailes?.available ? "text-green-600" : "text-red-600"
            } text-sm font-medium`}
          >
            {productDetailes?.available ? "Available in stock" : "Out of Stock"}
          </p>
        </div>
      </div>
      <div className="my-6">
        <div className="font-semibold text-3xl flex gap-1 items-center">
          {" "}
          <p className="w-16 h-1 rounded-full bg-black"></p>
          <p className="">Recommende productes</p>
        </div>
        <div className="">
          <Swiper slidesPerView={3} spaceBetween={10}>
            {(productRelated || []).map((relatedProduct) => (
              <SwiperSlide key={relatedProduct._id}>
                <div
                  className="flex cursor-pointer rounded-xl p-3 flex-col gap-1 bg-gray-200"
                  onClick={() =>
                    router.push(`/user/product/${relatedProduct._id}`)
                  }
                >
                  <Image
                    src="/images/bg2.jpg"
                    alt="related product"
                    height={300}
                    width={500}
                    className="rounded-xl"
                  />
                  <p className="text-gray-800 text-sm font-medium">
                    {relatedProduct.name}
                  </p>
                  <div className="flex w-full justify-between">
                    <p className="text-gray-800 text-sm font-medium">
                      {relatedProduct.price}{" "}
                      <span className="font-medium">Rs.</span>
                    </p>
                    <p
                      className={`${
                        relatedProduct.available
                          ? "text-green-600"
                          : "text-red-600"
                      } text-sm font-medium`}
                    >
                      {relatedProduct.available ? "Available" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
