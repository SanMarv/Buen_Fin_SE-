import { LocationEntry } from "../schemas";
import { ProductPageItem } from "./products";

export type CompanyPageItem = {
  name: string;
  profile_picture: string;
  description: string;
  jobs: {
    id: string;
    name: string;
    description: string;
    location: LocationEntry;
  }[];
  products: Omit<ProductPageItem, "company">[];
};
