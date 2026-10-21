import { LocationEntry } from "../schemas";
import { ProductPageItem } from "./products";

export type Job = {
  id: string;
  name: string;
  description: string;
  location: LocationEntry;
};

export type CompanyPageItem = {
  name: string;
  profile_picture: string;
  description: string;
  jobs: Job[];
  products: Omit<ProductPageItem, "company">[];
};
