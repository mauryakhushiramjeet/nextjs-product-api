"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ShoppingPage = () => {
  const [allproductes, setAllProductes] = useState<ProductType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [filterProducts, setFilterProducts] = useState<ProductType[] | null>(
    null
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const productes = useAppSelector((store) => store.products);

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);
  useEffect(() => {
    if (productes && !productes.isError && !productes.loading) {
      setAllProductes(productes?.data?.product || []);
    }
  }, [productes]);

  console.log(productes);
  const handleSearch = (text: string) => {
    if (text.trim() == "") {
      setFilterProducts(null);
      console.log(text);
      return;
    }
    if (allproductes) {
      const filterProduct = allproductes.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilterProducts(filterProduct);
      // setSearchText("");
      console.log("all  product is", allproductes);
    }
  };
  useEffect(() => {
      handleSearch(searchText);
  }, [searchText]);
  interface filterButtons {
    category: string;
    options: string[];
  }
  const filterButtons: filterButtons[] = [
    {
      category: "Availability",
      options: ["Available", "Out of Stock"],
    },
    {
      category: "Price",
      options: ["Low to High", "High to Low"],
    },
    {
      category: "Category",
      options: ["Cloth", "Food", "jewellery", "Makeup"],
    },
  ];
  const handleFilterProducts = (option: string, category: string) => {
    if (category == "Price") {
      let filteredPrice = [...allproductes];
      if (option == "Low to High") {
        filteredPrice.sort((a, b) => Number(a.price) - Number(b.price));
      } else {
        filteredPrice.sort((a, b) => Number(b.price) - Number(a.price));
      }
      setFilterProducts(filteredPrice);
    } else if (category == "Category") {
      console.log(category);
      // if (option == "Cloth") {
      const filterCloth = allproductes.filter(
        (productes) => productes.category == option.toLowerCase()
      );
      setFilterProducts(filterCloth);
      // }
    } else if (category == "Availability") {
      if (option == "Available") {
        const filterAvailabiltyProsuct = allproductes.filter(
          (productes) => productes.available == true
        );
        setFilterProducts(filterAvailabiltyProsuct);
      } else {
        const filterAvailabiltyProsuct = allproductes.filter(
          (productes) => productes.available == false
        );
        setFilterProducts(filterAvailabiltyProsuct);
      }
    }
  };
  return (
    <div className="mt-6 w-full relative">
      {isSidebarOpen ? (
        <div
          className={`bottom-0 transition-all shadow-2xl duration-500 translate-x-5 ease-in-out left-[-30px] flex flex-col gap-[20px]  fixed w-full max-w-[200px] py-6 rounded-tr-lg rounded-br-lg px-[30px] bg-[#FBFFFF]`}
        >
          <div
            className="absolute top-1 right-1 w-fit  p-1 cursor-pointer text-white font-bold bg-black/50 rounded-full"
            onClick={() => setIsSidebarOpen(false)}
          >
            <p>
              <RxCross2 size={10} />
            </p>
          </div>
          {filterButtons.map((btn, index) => (
            <div key={index} className="w-full">
              <p className="font-semibold text-lg">{btn.category}</p>
              <div className="flex flex-col gap-2  w-full mt-3">
                {btn.options.map((option) => (
                  <div
                    key={option}
                    className="flex justify-between items-center"
                  >
                    <p className="text-sm">{option}</p>
                    <input
                      type="checkbox"
                      checked={
                        filterText === option && filterCategory === btn.category
                      }
                      onClick={() => {
                        setFilterText(option);
                        setFilterCategory(btn.category);
                        handleFilterProducts(option, btn.category);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* <div className="mt-2 w-full"> */}
          <button
            onClick={() => {
              setFilterCategory("");
              setFilterProducts(null);
              setFilterText("");
            }}
            className="px-3 bg-gray-900 text-sm cursor-pointer text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Clear filter
          </button>
          {/* </div> */}
        </div>
      ) : (
        <div className="fixed bottom-10 left-0  ">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-gray-900 rounded-br-xl text-sm flex gap-1 items-center rounded-tr-xl cursor-pointer text-white px-4 py-2"
          >
            <p> Filter</p> <FaFilter />
          </button>
        </div>
      )}
      <div className="flex items-center justify-end gap-40 mb-5 ">
        <p className="text-center  font-semibold text-4xl italic text-[#84927a]">
          Bestseller productes
        </p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search here"
          className="py-1 px-5 rounded-lg text-gray-500 bg-white outline-none ring-[3px] ring-[#84927a]/50 "
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {(filterProducts || allproductes).map((product, index) => (
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
                className="rounded-xl h-[150px] sm:h-[200px] w-full object-cover"
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
