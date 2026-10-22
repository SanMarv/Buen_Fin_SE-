import type { LocationEntry } from "../schemas/index.js";
import type { ProductPageItem } from "./products.js";

export type Job = {
  id: string;
  name: string;
  description: string;
  link: string;
  location: LocationEntry;
};

export type CompanyPageItem = {
  name: string;
  profile_picture: string;
  description: string;
  jobs: Job[];
  products: Omit<ProductPageItem, "company">[];
  isValidated: boolean;
};
