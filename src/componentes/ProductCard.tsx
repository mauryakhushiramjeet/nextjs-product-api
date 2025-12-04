import { ProductViewType } from "@/types";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// export interface Category {
//   _id: string;
//   categoryName: string;
// }

// export interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   discountedPrice?: number;
//   discount?: number;
//   image: string | string[];
//   available: boolean;
//   bestSeller?: boolean;
//   categoryId?: Category;
// }

export interface ProductCardProps {
  product: ProductViewType;
  saleForAll?: boolean;
  key: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  saleForAll,
  key,
}) => {
  const router = useRouter();
  console.log(product);
  return (
    <div
      key={key}
      onClick={() => router.push(`/user/product/${product._id}`)}
      className={`bg-[#F5F6EF] shadow rounded-xl p-3 xs:p-[10px] sm:p-3 flex flex-col gap-2 cursor-pointer`}
    >
      {typeof product.image === "string" && (
        <Image
          src={product.image}
          height={200}
          width={200}
          className=" rounded-xl h-[200px] lg:h-[300px] w-full object-cover"
          alt={product.name || "product image"}
        />
      )}
      <div className="flex w-full justify-between">
        <p className="text-gray-800 text-base xs:text-sm sm:text-lg xl:text-xl 2xl:text-2xl ">
          {product.name}
        </p>
        {product.discount && !saleForAll && (
          <p className="text-red-600 font-medium text-base xs:text-sm sm:text-base xl:text-lg 2xl:text-xl">
            Discount {product.discount} %
          </p>
        )}
      </div>
      <div className="flex w-full justify-between">
        {product.discount ? (
          <div className="flex gap-2  text-base xs:text-sm sm:lg:text-lg 2xl:text-xl">
            <p className="text-gray-500 line-through">{product.price}</p>
            <p className="text-gray-900 font-medium">
              {product.discountedPrice}Rs.00
            </p>
          </div>
        ) : (
          <p className="text-gray-800 text-base xs:text-sm sm:text-base lg:text-lg 2xl:text-xl font-medium">
            {product.price} <span className="font-medium">Rs.</span>
          </p>
        )}

        <p
          className={`${
            product.available ? "text-green-600" : "text-red-600"
          } text-base xs:text-sm sm:text-base lg:text-lg xl:text-xl font-medium`}
        >
          {product.available ? "Available" : "Out of Stock"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
