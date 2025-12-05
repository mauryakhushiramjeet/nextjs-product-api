"use client";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { RxCross2 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductViewType } from "@/types";
import ProductCard from "@/componentes/ProductCard";
import ProductCardSkeleton from "@/componentes/ProductCardSkelton";

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
      <div className={`${loading ? "hidden" : "block"}`}>
        {" "}
        {isSidebarOpen ? (
          <div
            className={`sm:bottom-0 transition-all shadow-2xl duration-500 translate-x-5 ease-in-out left-[-30px] flex flex-col gap-3 lg:gap-[20px]  fixed w-full max-w-[200px] py-[5px] lg:py-6 rounded-tr-lg rounded-br-lg px-[30px] bg-[#FBFFFF]`}
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
                <p className="font-semibold text-base lg:text-lg">{btn.category}</p>
                <div className="flex flex-col gap-1 lg:gap-2  w-full mt-1 lg:mt-3">
                  {btn.options.map((option) => (
                    <div
                      key={option}
                      className="flex justify-between items-center"
                    >
                      <p className="text-sm">{option}</p>
                      <input
                        type="checkbox"
                        checked={
                          filterText === option &&
                          filterCategory === btn.category
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
          </div>
        ) : (
          <div className="fixed bottom-20 sm:bottom-[58px] md:bottom-[50px] left-0  ">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-gray-900 rounded-br-xl text-sm flex gap-1 items-center rounded-tr-xl cursor-pointer text-white px-4 py-2"
            >
              <p> Filter</p> <FaFilter />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 items-center justify-between  mb-5 ">
        <p className="text-center font-semibold text-2xl lg:text-4xl italic text-[#84927a]">
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
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filterProducts && filterProducts.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg font-medium">
                No products found for this filter.
              </p>
            </div>
          ) : (
            (filterProducts || allproductes).map((product, index) => (
              <ProductCard
                product={product}
                key={index}
                saleForAll={saleForAll}
              />
            ))
          )}
        </div>
      )}
      <div className="flex items-center justify-center text-sm xl:text-base 2xl:text-xl">
        <div className="flex items-center justify-center  space-x-2 mt-8 md:mt-4 bottom-[11px]  backdrop-blur-md py-2 left-[25%] w-full sm:w-[50%] bg-[#84927a]/30 rounded-3xl">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[10px] 2xl:px-3 py-1 rounded-md border bg-gray-200 ${
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
              className={`px-[10px] 2xl:px-3 py-1 rounded-md border cursor-pointer  ${
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
            className={`px-[10px] 2xl:px-3 py-1 rounded-md border bg-gray-200  ${
              currentPage === totalPages
                ? "cursor-default"
                : "cursor-pointer hover:bg-blue-500 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
