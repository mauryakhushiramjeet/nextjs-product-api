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
  contextProduct: BestproductType[];
  setContextProduct: ()=>void

}
export interface PopulatedCategory {
  _id: string;
  categoryName: string;
}

export interface ProductViewType {
  _id: string;
  image: string;
  name: string;
  price: number;
  categoryId: PopulatedCategory;  
  description: string;
  available?: boolean;
  bestSeller: boolean;
  originalPrice?: number | null;
  discount?: number | null;
  discountedPrice?: number | null;
}
export interface SaleViewInterface {
  _id?: string;
  name: string;
  disccountPercentage: number;
  image: string | File;
  categoryId: PopulatedCategory[];
  start: Date;
  end: Date;
}
