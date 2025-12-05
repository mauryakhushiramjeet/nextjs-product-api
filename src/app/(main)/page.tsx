"use client";
import BestProductes from "@/componentes/BestProductes";
import { SaleInterface } from "@/lib/models/SaleModel";
import { getSalesDetailes } from "@/store/salesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { SaleViewInterface } from "@/types";

const HomePage = () => {
  const [saleData, setSaleData] = useState<SaleViewInterface[] | null>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sale = useAppSelector((store) => store.sale);
  useEffect(() => {
    dispatch(getSalesDetailes());
  }, [dispatch]);
  useEffect(() => {
    if (sale && !sale.isError && !sale.isError) {
      setSaleData(sale?.data);
    }
  }, [sale]);
  // const today = new Date();

  // useEffect(() => {
  //   if (saleData && saleData.length > 0) {
  //     const saleEndDate = new Date(saleData[0]?.end);
  //     console.log(saleEndDate.toDateString(), ",", today.toDateString());
  //     if (today == saleEndDate) {
  //       dispatch(deteleSale())
  //         .unwrap()
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   }
  // }, [saleData, today]);
  console.log(sale);
  return (
    <div className="p-5">
      {saleData && saleData.length > 0 && (
        <Swiper modules={[Pagination]} spaceBetween={30}>
          {saleData.map((sale) => (
            <SwiperSlide key={sale._id}>
              <div className="relative w-full h-fit py-11 mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg">
                <div
                  className={` hidden sm:block absolute  top-4 right-4 bg-gradient-to-r from-red-600 to-orange-500 px-[10px] xl:px-6 py-3 rounded-2xl shadow-md`}
                >
                  <div className="flex flex-col items-center gap-1 md:gap-2 2xl:gap-3">
                    <p className="text-white text-base sm:text-xl xl:text-2xl 2xl:text-3xl">
                      {sale?.disccountPercentage}% OFF on{" "}
                    </p>
                    {sale?.categoryId.map((cat) => (
                      <p
                        key={cat?._id}
                        className="k text-yellow-200 text-sm sm:text-xl 2xl:text-2xl 2xl:font-bold animate-bounce"
                      >
                        {cat?.categoryName}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-start gap-10 items-center h-full px-4 xs:px-10 ">
                  <div className="flex items-start flex-col gap-y-2">
                    <p className="text-xl xs:text-2xl 2xl:text-6xl font-bold text-white drop-shadow-lg tracking-wide capitalize">
                      {sale?.name}
                    </p>
                    <div
                      className={`flex sm:hidden items-center gap-1 md:gap-2 2xl:gap-3`}
                    >
                      <p className="text-red-600 text-base sm:text-xl xl:text-2xl 2xl:text-3xl">
                        {sale?.disccountPercentage}% OFF on{" "}
                      </p>
                      {sale?.categoryId.map((cat) => (
                        <p
                          key={cat?._id}
                          className=" text-yellow-200 text-sm sm:text-xl 2xl:text-2xl 2xl:font-bold"
                        >
                          {cat?.categoryName}
                        </p>
                      ))}
                    </div>
                    <p className="text-gray-300 text-base md:text-xl 2xl:text-2xl">
                      Grab your favorite items before the offer ends!
                    </p>
                    <button
                      onClick={() => router.push("/user/shopping")}
                      className="mt-2 text-sm sm:text-lg md:text-xl 2xl:text-2xl w-fit px-4 sm:px-6 md:px-8 py-2 bg-amber-500 cursor-pointer hover:bg-amber-400 text-black font-semibold rounded-lg shadow-md transition-transform hover:scale-105"
                    >
                      Shop Now
                    </button>
                  </div>

                  {sale?.image && (
                    <div className="relative">
                      <Image
                        src={sale.image as string}
                        alt="sale-image"
                        height={180}
                        width={180}
                        className="rounded-xl hidden lg:block w-[250px] 2xl:w-[365px]  border border-gray-600 hover:scale-105 transition-transform duration-300 shadow-2xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="bg-hero2 bg-cover bg-center h-[400px] rounded-lg relative flex justify-center items-center">
        <div className="absolute inset-0 bg-white/30 z-10"></div>
        <div className="relative z-20  p-5 flex flex-col items-center">
          <p className="font-bold text-center text-gray-800 text-xl xs:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl relative z-50">
            Welcome to our , self care
          </p>
          <button
            onClick={() => router.push("/user/shopping")}
            className="px-6 lg:px-8 py-2 mt-5 bg-gray-900 cursor-pointer  text-amber-100 text-base xs:text-lg lg:text-[22px] 2xl:text-3xl rounded-lg"
          >
            Get started
          </button>
        </div>
      </div>
      <BestProductes />
    </div>
  );
};
export default HomePage;
