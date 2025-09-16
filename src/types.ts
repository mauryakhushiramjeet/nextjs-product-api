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
