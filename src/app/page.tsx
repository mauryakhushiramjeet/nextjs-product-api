"use client";
import BestProductes from "@/componentes/BestProductes";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="bg-hero2 bg-cover bg-center h-[400px] mt-[117px] rounded-lg relative flex justify-center items-center">
        <div className="absolute inset-0 bg-white/30 z-10"></div>
        <div className="relative z-20  p-5 flex flex-col items-center">
          <p className="font-bold text-gray-800 text-4xl">
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
