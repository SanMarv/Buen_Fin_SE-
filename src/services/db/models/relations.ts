import { categories } from "./categories.model.ts";
import { products } from "./products.model.ts";
import { category_product } from "./category_product.model.ts";
import { companies } from "./companies.model.ts";
import { premises } from "./premises.model.ts";
import { jobs } from "./jobs.model.ts";
import { images } from "./image.model.ts";
import { imageProducts } from "./image_product.model.ts";
import { locations } from "./locations.model.ts";
import { users } from "./users.model.ts";
import { wishlists } from "./wishlist.model.ts";
import { wishlistProducts } from "./wishlist_product.model.ts";
import { validation_table } from "./validation.model.ts";
import { defineRelations } from "drizzle-orm";

//Many to many relationship between categories and products
export const categoryProductRelations = defineRelations(
  { categories, products, category_product },
  (r) => ({
    categories: {
      products: r.many.products({
        from: r.categories.id.through(r.category_product.category_id),
        to: r.products.id.through(r.category_product.product_id),
      }),
    },

    products: {
      categories: r.many.categories(),
    },
  }),
);

//Companies to other tables relationships
export const companiesToProductsRelation = defineRelations(
  { companies, products },
  (r) => ({
    products: {
      author: r.one.companies({
        from: r.products.company_id,
        to: r.companies.id,
      }),
    },

    companies: {
      products: r.many.products(),
    },
  }),
);

export const companiesToPremisesRelation = defineRelations(
  { companies, premises },
  (r) => ({
    premises: {
      author: r.one.companies({
        from: r.premises.company_id,
        to: r.companies.id,
      }),
    },

    companies: {
      premises: r.many.premises(),
    },
  }),
);

export const companiesToJobsRelation = defineRelations(
  { companies, jobs },
  (r) => ({
    jobs: {
      author: r.one.companies({
        from: r.jobs.company_id,
        to: r.companies.id,
      }),
    },

    companies: {
      jobs: r.many.jobs(),
    },
  }),
);

//Many to many relationship between image and products
export const imageProductsRelations = defineRelations(
  { images, products, imageProducts },
  (r) => ({
    images: {
      products: r.many.products({
        from: r.images.id.through(r.imageProducts.image_id),
        to: r.products.id.through(r.imageProducts.product_id),
      }),
    },

    products: {
      images: r.many.images(),
    },
  }),
);

//Locations to others relations
export const locationsToPremises = defineRelations(
  { locations, premises },
  (r) => ({
    premises: {
      author: r.one.locations({
        from: r.premises.location_id,
        to: r.locations.id,
      }),
    },

    locations: {
      premises: r.many.premises(),
    },
  }),
);

export const locationsToJobs = defineRelations({ locations, jobs }, (r) => ({
  jobs: {
    author: r.one.locations({
      from: r.jobs.location_id,
      to: r.locations.id,
    }),
  },

  locations: {
    premises: r.many.jobs(),
  },
}));

//Users to other tables relationships
export const usersToCompaniesRelation = defineRelations(
  { users, companies },
  (r) => ({
    companies: {
      author: r.one.users({
        from: r.companies.user_id,
        to: r.users.id,
      }),
    },

    users: {
      companies: r.many.companies(),
    },
  }),
);

export const usersToWishlistsRelation = defineRelations(
  { users, wishlists },
  (r) => ({
    wishlists: {
      author: r.one.users({
        from: r.wishlists.userId,
        to: r.users.id,
      }),
    },

    users: {
      wishlists: r.many.wishlists(),
    },
  }),
);

export const usersToImagesRelation = defineRelations(
  { users, images },
  (r) => ({
    images: {
      author: r.one.users({
        from: r.images.user_id,
        to: r.users.id,
      }),
    },

    users: {
      images: r.many.images(),
    },
  }),
);

//Validation to companies relationship
export const validationToCompanies = defineRelations(
  { validation_table, companies },
  (r) => ({
    companies: {
      author: r.one.validation_table({
        from: r.companies.validation_id,
        to: r.validation_table.id,
      }),
    },

    validation_table: {
      companies: r.many.companies(),
    },
  }),
);

//Many to many relationship between wishlist and products
export const wishlistProductsRelations = defineRelations(
  { wishlists, products, wishlistProducts },
  (r) => ({
    wishlists: {
      products: r.many.products({
        from: r.wishlists.id.through(r.wishlistProducts.wishlist_id),
        to: r.products.id.through(r.wishlistProducts.product_id),
      }),
    },

    products: {
      wishlists: r.many.wishlists(),
    },
  }),
);
