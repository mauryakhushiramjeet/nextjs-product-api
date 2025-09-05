"use client";
import { BestproductType, ProductContextType } from "@/types";
import { createContext, useState } from "react";

export const ProductContext = createContext<ProductContextType | null>(null);
export const ProductContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [product, setProducts] = useState<BestproductType[]>([]);
  return (
    <ProductContext.Provider value={{ product, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
