import type { Category } from "./categories.js";

export type ProductImage = {
  alt: string;
  url: string;
};
export type ProductPageItem = {
  id: string;
  name: string;
  description: string;
  newPrice: number;
  price: number;
  link: string;
  company: {
    id: string;
    name: string;
    profile_picture: string;
    isVerified: boolean;
  };
  images: ProductImage[];
  categories: Category[];
};
