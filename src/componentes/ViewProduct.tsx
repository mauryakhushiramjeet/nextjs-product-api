"use client";
import { ProductType } from "@/lib/models/ProductModel";
import { getAllProduct } from "@/store/getProductSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import ConfirmPop from "./ConfirmPop";
import { productDeleteById } from "@/store/deleteProductByIdSlice";
import { toast } from "react-toastify";
import { ProductViewType } from "@/types";

interface OnEditType {
  onEdite: (id: string) => void;
}
const ViewProduct: React.FC<OnEditType> = ({ onEdite }) => {
  const [allproductes, setAllProductes] = useState<ProductViewType[] | null>(
    null
  );
  const [showModel, setShowModel] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rededAllProduct = useAppSelector((store) => store.products);
  const totalPages = rededAllProduct?.data?.totalpages || 1;

  const [deltedProductId, setDeletedProductId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  //   console.log("this all products", rededAllProduct);
  useEffect(() => {
    dispatch(getAllProduct({ page: currentPage }));
  }, [currentPage]);
  useEffect(() => {
    if (
      rededAllProduct &&
      !rededAllProduct.isError &&
      !rededAllProduct.loading
    ) {
      setAllProductes(rededAllProduct?.data?.product ?? null);
    }
  }, [rededAllProduct]);
  // console.log(rededAllProduct, "jhjkhkjh");
  const handleModel = (id: string) => {
    if (id != null) {
      setShowModel(true);
      setDeletedProductId(id);
    }
  };
  const handleProductDelet = () => {
    if (deltedProductId != null) {
      dispatch(productDeleteById(deltedProductId))
        .then((res) => {
          console.log(res);
          if (res.payload.success) {
            toast.success(res.payload.message);
            // dispatch(getAllProduct());
          } else {
            toast.success(res.payload.message);
          }
          setShowModel(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleCloseModel = () => {
    setShowModel(false);
  };
  const handleUpdateProduct = (id: string) => {
    onEdite(id);
  };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-5">Product List</h1>

<div className="rounded-lg shadow-md h-full overflow-y-auto bg-gray-100 w-full">
        <table className="w-full ">
          <thead className="text-left  w-full">
            <tr className="bg-green-600 text-white rounded-4xl w-full ">
              <th className="px-6 py-4">Sr no.</th>
              <th className="px-6 py-4">Image</th>

              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">price</th>
              <th className="px-6 py-4">Available</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="px-6 ">
            {(allproductes || []).map((product, index) => (
              <tr
                key={product?._id}
                className={`border-b border-gray-100 mt-5 transition-colors duration-200  px-3 ${
                  index % 2 === 0 ? "bg-[#B7E655]/5" : "bg-[#849F1A]/10"
                }`}
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  {typeof product.image === "string" && (
                    <Image
                      src={product?.image}
                      height={150}
                      width={150}
                      className="h-[100px] w-[100px] object-cover rounded-lg"
                      alt="product image"
                    />
                  )}
                </td>

                <td className="px-6 py-4 capitalize">{product?.name}</td>
                <td className="px-6 py-4 capitalize">
                  {product?.categoryId.categoryName}
                </td>
                <td className="px-6 py-4 capitalize">{product?.price} Rs</td>
                <td
                  className={`className="px-6 py-4" ${
                    product?.available ? "text-green-600" : "text-red-700"
                  }`}
                >
                  {product?.available ? "Yes" : "No"}
                </td>
                <td>
                  <div className="flex px-5 py-2 gap-5">
                    <span
                      onClick={() => {
                        if (product?._id) {
                          handleUpdateProduct(product?._id);
                        }
                      }}
                      className="cursor-pointer text-gray-950 hover:bg-gray-300 p-2 rounded-full"
                    >
                      <TbEdit />
                    </span>
                    <span
                      className="cursor-pointer text-red-500 hover:bg-red-300 p-2 rounded-full"
                      onClick={() => {
                        if (product?._id) {
                          handleModel(product?._id);
                        }
                      }}
                    >
                      <AiOutlineDelete />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center space-x-2 mt-4 sticky bottom-[40px]  backdrop-blur-md py-2  bg-[#84927a]/30 rounded-3xl">
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
      {showModel && (
        <ConfirmPop
          message="Are you sure, aere you want to delet this product "
          onConfirm={() => handleProductDelet()}
          onCancel={handleCloseModel}
        />
      )}
    </div>
  );
};

export default ViewProduct;
