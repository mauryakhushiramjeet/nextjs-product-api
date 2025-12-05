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
import ProductCard from "@/componentes/ProductCard";

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
    <div className="p-5">
      <div className="grid grid-cols-2 gap-5 md:gap-20">
        <div className="">
          {typeof productDetailes?.image == "string" && (
            <Image
              src={productDetailes.image}
              alt="product-image"
              height={700}
              width={700}
              className=" h-[300px] w-full max-w-[750px] object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[700px]">
          <p className="text-[#1D2939] text-3xl 2xl:text-5xl font-bold">
            {productDetailes?.name}
          </p>
          {productDetailes?.discount ? (
            <div className="flex gap-3 items-center text-base md:text-lg xl:text-xl 2xl:text-2xl">
              <p className="text-gray-400  font-semibold relative">
                {productDetailes?.price} Rs.00
                <div className="w-full h-[1px] bg-gray-600 absolute rotate-[9deg] top-[15px]"></div>
              </p>
              <p className="text-green-500 font-semibold">
                {productDetailes?.discountedPrice} Rs.00
              </p>
              <p className="hidden md:block text-red-600 font-semibold">
                Discount {productDetailes?.discount} %
              </p>
              <p className="block md:hidden text-red-600 font-semibold">
                 {productDetailes?.discount}% Off
              </p>
            </div>
          ) : (
            <p className="text-green-500 font-semibold text-2xl">
              {productDetailes?.price} <span>Rs</span>
            </p>
          )}

          <p className="text-gray-500 text-lg 2xl:text-2xl md:mt-2 font-roboto line-clamp-3">
            {productDetailes?.description}
          </p>
          <p
            className={`text-xl ${
              productDetailes?.available ? "text-green-600" : "text-red-600"
            } text-sm font-medium`}
          >
            {productDetailes?.available ? "Available in stock" : "Out of Stock"}
          </p>
          <div className="flex gap-5 items-center font-semibold text-sm md:text-base 2xl:text-xl">
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
              } px-[10px] md:px-5 py-2 bg-[#E2DFD2]  text-black rounded-lg`}
            >
              ADD TO CART
            </button>
            <button
              className="px-[10px] md:px-5 py-2 bg-[#D0F0C0] text-gray-900 rounded-lg cursor-pointer"
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
        <HeadingComponent heading="Recommende productes" />
        <div className="mt-5">
          <Swiper
            breakpoints={{
              1280: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 3,
              },
               425: {  
                slidesPerView: 2,
              },
            }}
            spaceBetween={10}
          >
            {(productRelated || []).map((relatedProduct, index) => (
              <SwiperSlide key={relatedProduct._id}>
                <ProductCard product={relatedProduct} key={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
