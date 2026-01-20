import { defineQuery } from 'next-sanity'

// Queries defined
export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "mainCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image,
    "subcategories": *[_type == "subCategory" && parent._ref == ^._id] {
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      "products": *[_type == "product" && references(^._id)] {
        _id,
        name,
        "slug": slug.current,
        image
      }
    }
  }
`)

// Product Queries
export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] {
    _id,
    name,
    "slug": slug.current,
    tag,
    description,
    "category": mainCategory->{
      name,
      "slug": slug.current
    },
    image,
    features,
    specifications,
    applications
  }
`)

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    tag,
    description,
    "category": mainCategory->{
      name,
      "slug": slug.current
    },
    image,
    features,
    specifications,
    applications
  }
`)



export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_id == "homePage"][0].featuredItems[]->{
    _id,
    _type,
    name,
    "slug": slug.current,
    tag,
    "description": coalesce(description, "Premium safety solution."),
    image,
    "features": features[]{ "v": coalesce(title, @) }.v,
    specifications,
    "category": mainCategory->{
       name,
       "slug": slug.current
    },
    // For Variants
    "parent": parent->{
        "slug": slug.current
    }
  }
`)

export const SHOWCASED_CATEGORIES_QUERY = defineQuery(`
  *[_type == "mainCategory"] | order(order asc) {
    _id,
    _type,
    name,
    "slug": slug.current,
    "description": coalesce(description, "Explore our complete range of " + name + " solutions."),
    image
  }
`)



export const MAIN_CATEGORIES_NAV_QUERY = defineQuery(`
  *[_type == "mainCategory" && showOnNav == true] | order(order asc) {
    _id,
    name,
    "slug": slug.current
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0] {
    leaders[]->{
      name,
      role,
      "image": image, 
      bio,
      qualification,
      experience,
      expertise,
      linkedin
    }
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0] {
    heroHeading,
    heroSubheading,
    heroAnimatedWords,
    showcaseTitle,
    showcaseDescription
  }
`)
