"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductViewType } from "@/types";

const ShoppingPage = () => {
  const [allproductes, setAllProductes] = useState<ProductViewType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterProducts, setFilterProducts] = useState<
    ProductViewType[] | null
  >(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productes = useAppSelector((store) => store.products);
  const totalPages: number = productes.data?.totalpages || 1;
  const saleForAll: boolean = productes.data?.forAll || false;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  useEffect(() => {
    setLoading(true);
    dispatch(getAllProduct({ page: currentPage }));
  }, [dispatch, currentPage]);
  useEffect(() => {
    if (productes && !productes.isError && !productes.loading) {
      setAllProductes(productes?.data?.product || []);
      setCurrentPage(productes.data?.page || 1);
    }
    setLoading(false);
  }, [productes]);
  console.log(allproductes);

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
      const filteredPrice = [...allproductes];
      if (option == "Low to High") {
        filteredPrice.sort((a, b) => Number(a.price) - Number(b.price));
      } else {
        filteredPrice.sort((a, b) => Number(b.price) - Number(a.price));
      }
      setFilterProducts(filteredPrice);
    } else if (category == "Category") {
      console.log(category);
      const filterCloth = allproductes.filter(
        (productes) =>
          productes.categoryId?.categoryName === option.toLowerCase()
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
  console.log(saleForAll ? "Sale for all productes" : "sale for indivisualr");
  return (
    <div className="w-full relative p-5">
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
                      onChange={() => {
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
        <div className="fixed bottom-[15px] left-0  ">
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

      {loading ? (
        <div className="w-full flex items-center justify-center h-[400px] ">
          <div className="border-[6px] border-dotted border-t-transparent animate-spin rounded-full h-10 w-10  border-blue-600/80"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filterProducts && filterProducts.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg font-medium">
                No products found for this filter.
              </p>
            </div>
          ) : (
            (filterProducts || allproductes).map((product, index) => (
              <div
                key={index}
                onClick={() => router.push(`/user/product/${product._id}`)}
                className="bg-[#F5F6EF] shadow rounded-xl p-3 flex flex-col gap-2 cursor-pointer"
              >
                {typeof product.image === "string" && (
                  <Image
                    src={product.image}
                    height={200}
                    width={200}
                    className="rounded-xl h-[300px] w-[400px] object-cover"
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
                      <p className="text-gray-500 line-through">
                        {product.price}
                      </p>
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
            ))
          )}
        </div>
      )}
      <div className="flex items-center justify-center space-x-2 mt-4 sticky bottom-[11px]  backdrop-blur-md py-2 left-[25%] w-[50%] bg-[#84927a]/30 rounded-3xl">
        {/* Prev Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border bg-gray-200 ${
            currentPage === 1
              ? "cursor-default"
              : "cursor-pointer hover:bg-blue-500 hover:text-white"
          }`}
        >
          Prev
        </button>
        {pages.map((page) => (
          <button
            onClick={() => setCurrentPage(page)}
            key={page}
            className={`px-3 py-1 rounded-md border cursor-pointer  ${
              page === currentPage
                ? "bg-black/90 text-white"
                : "bg-white text-black"
            }  `}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border bg-gray-200  ${
            currentPage === totalPages
              ? "cursor-default"
              : "cursor-pointer hover:bg-blue-500 hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShoppingPage;
