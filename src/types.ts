import { SetStateAction } from "react";

export interface BestproductType {
  available: boolean;
  bestSeller: boolean;
  category: string;
  description: string;
  name: string;
  image: string;
  price: number;
  _id: string;
}
export interface ProductContextType {
  product: BestproductType[]
  setProducts: React.Dispatch<React.SetStateAction<BestproductType[]>>;
}
