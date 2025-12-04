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
import { addProductInCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import mongoose from "mongoose";

import { getCartByUserId } from "@/store/getCartSlice";
import { ProductViewType } from "@/types";
import HeadingComponent from "@/componentes/HeadingComponent";

type OrderItemType = {
  product: {
    productId: string;
    productName: string;
  };
  quantity: number;
  price: number;
};

type OrderDataType = {
  totalAmount: number;
  items: OrderItemType[];
};
export interface cartDataType {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantityQuery?: boolean;
}
const ProductPage = () => {
  const [productDetailes, setProductDetailes] =
    useState<ProductViewType | null>(null);
  const [productRelated, setProductRelated] = useState<
    ProductViewType[] | null
  >(null);
  const getAllProductData = useAppSelector((store) => store.products);

  const productData = useAppSelector((store) => store.Product);
  const cartData = useAppSelector((store) => store.cartData);
  const finalPrice = (productDetailes?.discountedPrice ??
    productDetailes?.price) as number;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);
  console.log(productData);
  useEffect(() => {
    if (productData) {
      if (!productData.isError && !productData.loading) {
        setProductDetailes(productData.data);
      }
    }
  }, [productData]);
  useEffect(() => {
    dispatch(getAllProduct({ categoryId: productDetailes?.categoryId?._id }));
  }, [id, productDetailes, dispatch]);
  useEffect(() => {
    if (
      getAllProductData &&
      !getAllProductData.isError &&
      !getAllProductData.loading &&
      getAllProductData?.data?.product
    ) {
      setProductRelated(getAllProductData.data.product);
      console.log(getAllProductData.data.product);
    }
  }, [getAllProductData, productDetailes]);

  const handleAddToCart = (productId: mongoose.Types.ObjectId) => {
    console.log("btn clicked");
    const userId = localStorage.getItem("userId");
    if (!userId || !productId) {
      return;
    }

    const localUserId = new mongoose.Types.ObjectId(userId);
    console.log("user id is :", userId, "productId is :", productId);
    const data: cartDataType = {
      userId: localUserId,
      productId: productId,
    };
    dispatch(addProductInCart(data))
      .then((res) => {
        console.log(res, "res is ");
        if (res.payload.success) {
          toast.success(res.payload.message);
          dispatch(getCartByUserId());
          return;
        } else {
          toast.error(res.payload.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  const handleBayNow = (id: string, name: string, price: number) => {
    const data: OrderDataType = {
      totalAmount: price,
      items: [
        {
          product: { productId: id, productName: name },
          quantity: 1,
          price: price,
        },
      ],
    };
    localStorage.setItem("buyNowOrderData", JSON.stringify(data));
    router.push("/user/shippingDetailes");
  };
  console.log();
  if (cartData) {
    // console.log(cartData);
  }
  if (productData.loading) return <div>Loading...</div>;
  if (productData.isError) return <div>Something went wrong</div>;
  if (!productData.data) return <div>No product found</div>;
  return (
    <div className="mt-[112px]">
      <div className="grid grid-cols-2 gap-20">
        <div className="">
          {typeof productDetailes?.image == "string" && (
            <Image
              src={productDetailes.image}
              alt="product-image"
              height={700}
              width={700}
              className=" h-[300px] w-full max-w-[350px] object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#1D2939] text-4xl  font-extrabold">
            {productDetailes?.name}
          </p>
          {productDetailes?.discount ? (
            <div className="flex gap-3 items-center">
              <p className="text-gray-400  font-semibold text-xl relative">
                {productDetailes?.price} Rs.00
                <div className="w-full h-[1px] bg-gray-600 absolute rotate-[9deg] top-[15px]"></div>
              </p>
              <p className="text-green-500 font-semibold text-xl">
                {productDetailes?.discountedPrice} Rs.00
              </p>
              <p className="text-2xl text-red-600 font-semibold">
                Discount {productDetailes?.discount} %
              </p>
            </div>
          ) : (
            <p className="text-green-500 font-semibold text-2xl">
              {productDetailes?.price} <span>Rs</span>
            </p>
          )}

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
          <div className="flex gap-5 items-center font-semibold">
            <button
              onClick={() => {
                if (productDetailes?._id) {
                  handleAddToCart(
                    new mongoose.Types.ObjectId(productDetailes?._id)
                  );
                }
              }}
              disabled={productDetailes?.available == false}
              className={`${
                productDetailes?.available
                  ? "cursor-pointer"
                  : "cursor-no-drop opacity-75"
              } px-3 py-2 bg-[#E2DFD2]  text-black text-base  rounded-lg`}
            >
              ADD TO CART
            </button>
            <button
              className="px-3 py-2 bg-[#D0F0C0] text-gray-900 text-base rounded-lg cursor-pointer"
              onClick={() =>
                handleBayNow(
                  productDetailes?._id as string,
                  productDetailes?.name as string,
                  //   (productDetailes ? productDetailes.discountedPrice : productDetailes.price) as number
                  // )
                  finalPrice as number
                )
              }
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
      <div className="my-6">
        <HeadingComponent heading="Recommende productes"/>
        <div className="mt-5">
          <Swiper slidesPerView={4} spaceBetween={10}>
            {(productRelated || []).map((relatedProduct) => (
              <SwiperSlide key={relatedProduct._id}>
                <div
                  className="flex w-[300px] cursor-pointer rounded-xl p-3 flex-col gap-1 bg-white"
                  onClick={() =>
                    router.push(`/user/product/${relatedProduct._id}`)
                  }
                >
                  {typeof relatedProduct.image == "string" && (
                    <Image
                      src={relatedProduct.image}
                      alt="related product"
                      height={300}
                      width={500}
                      className="rounded-xl h-[300px] w-[300px] object-cover"
                    />
                  )}
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
