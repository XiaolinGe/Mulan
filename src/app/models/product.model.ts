import {Category} from "./category.model";

export class Product {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  price: number;
  specialPrice: number;
  description: string;
  color: string;
  author: string;
  imgUrls:string;
  categories: Category[];
}
