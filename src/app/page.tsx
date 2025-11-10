"use client";
import BestProductes from "@/componentes/BestProductes";
import { SaleInterface } from "@/lib/models/SaleModel";
import { getSalesDetailes } from "@/store/salesSlice";
import { deteleSale } from "@/store/salesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Salesforce from "next-auth/providers/salesforce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuPartyPopper } from "react-icons/lu";

const HomePage = () => {
  const [saleData, setSaleData] = useState<SaleInterface[] | null>([]);
  const dispatch = useAppDispatch();
  const TodayDate = new Date();
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
  const today = new Date();

  useEffect(() => {
    if (saleData && saleData.length > 0) {
      const saleEndDate = new Date(saleData[0]?.end);
      console.log(saleEndDate.toDateString(), ",", today.toDateString());
      if (today == saleEndDate) {
        dispatch(deteleSale())
          .unwrap()
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [saleData, today]);

  return (
    <div className="mt-[117px]">
      {saleData && saleData.length > 0 && (
        <div className="relative w-full h-[220px] mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg">
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 rounded-2xl shadow-md">
            <p className="text-yellow-200 text-2xl font-bold animate-bounce">
              🎉 {saleData[0]?.disccountPercentage}% OFF
            </p>
          </div>

          <div className="flex justify-center items-center h-full px-10 ml-[89px]">
            <div className="flex flex-col gap-y-2">
              <p className="text-4xl font-bold text-white drop-shadow-lg tracking-wide capitalize">
                {saleData[0]?.name}
              </p>
              <p className="text-gray-300 text-lg">
                Grab your favorite items before the offer ends!
              </p>
              <button
                onClick={() => router.push("/user/shopping")}
                className="mt-2 w-fit px-6 py-2 bg-amber-500 cursor-pointer hover:bg-amber-400 text-black font-semibold rounded-lg shadow-md transition-transform hover:scale-105"
              >
                Shop Now
              </button>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-5xl animate-pulse">
                {/* <LuPartyPopper size={40} color="yellow" /> */}
                🎉
              </p>
              <p className="rotate-[276deg] text-5xl animate-pulse">
                {/* <LuPartyPopper size={40} color="yellow" /> */}
                🎉
              </p>
            </div>

            {/* Right Image Section */}
            {saleData[0]?.image && (
              <div className="relative">
                <Image
                  src={saleData[0]?.image as string}
                  alt="sale-image"
                  height={180}
                  width={180}
                  className="rounded-xl border border-gray-600 hover:scale-105 transition-transform duration-300 w-[200px] shadow-2xl"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent blur-md"></div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="bg-hero2 bg-cover bg-center h-[400px] rounded-lg relative flex justify-center items-center">
        <div className="absolute inset-0 bg-white/30 z-10"></div>
        <div className="relative z-20  p-5 flex flex-col items-center">
          <p className="font-bold text-gray-800 text-4xl relative z-50">
            Welcome to our , self care
          </p>
          <button
            onClick={() => router.push("/user/shopping")}
            className="px-6 py-2 mt-5 bg-gray-900 cursor-pointer  text-amber-100 text-base rounded-lg"
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
