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

export const relations = defineRelations(
  {categories, products, category_product, companies, premises, jobs,
    images, imageProducts, locations, users, wishlists, wishlistProducts, validation_table,}, 

  (r) => ({
    products: {
      company: r.one.companies({from: r.products.company_id, to: r.companies.id}), 
      categories: r.many.categories({
        from: r.products.id.through(r.category_product.product_id), 
        to: r.categories.id.through(r.category_product.category_id)
      }),
      images: r.many.images({
        from: r.products.id.through(r.imageProducts.product_id), 
        to: r.images.id.through(r.imageProducts.image_id)
      }), 
      wishlists: r.many.wishlists({
        from: r.products.id.through(r.wishlistProducts.product_id), 
        to: r.wishlists.id.through(r.wishlistProducts.wishlist_id)
      })
    },
    
    companies: {
      user: r.one.users({from: r.companies.user_id, to: r.users.id}),
      validation: r.one.validation_table({from: r.companies.validation_id, to: r.validation_table.id}), 
      products: r.many.products(),
      premises: r.many.premises(), 
      jobs: r.many.jobs()
    },

    premises: {
      company: r.one.companies({from: r.premises.company_id, to: r.companies.id}), 
      location: r.one.locations({from: r.premises.location_id, to: r.locations.id})
    },
    
    jobs: {
      company: r.one.companies({from: r.jobs.company_id, to: r.companies.id}), 
      location: r.one.locations({from: r.jobs.location_id, to: r.locations.id})
    },

    images: {
      user: r.one.users({from: r.images.user_id, to: r.users.id}), 
      products: r.many.products({
        from: r.images.id.through(r.imageProducts.image_id), 
        to: r.products.id.through(r.imageProducts.product_id)
      })
    }, 

    wishlists: {
      user: r.one.users({from: r.wishlists.userId, to: r.users.id}), 
      products: r.many.products({
        from: r.wishlists.id.through(r.wishlistProducts.wishlist_id), 
        to: r.products.id.through(r.wishlistProducts.product_id)
      })
    },

    users: {
      validation: r.one.validation_table({from: r.users.validation_id, to: r.validation_table.id}), 
      companies: r.many.companies(), 
      wishlists: r.many.wishlists(), 
      images: r.many.images()
    }, 

    categories: {
      products: r.many.products({
        from: r.categories.id.through(r.category_product.category_id), 
        to: r.products.id.through(r.category_product.product_id)
      })
    }, 

    locations: {
      premises: r.many.premises(), 
      jobs: r.many.jobs()
    },

    validation_table: {
      companies: r.many.companies(), 
      users: r.many.users()
    }

  })
)
