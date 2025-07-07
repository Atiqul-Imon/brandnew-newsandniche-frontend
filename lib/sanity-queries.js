import { sanityClient } from './sanity'

// Query to get all blog posts
export const getAllBlogsQuery = `
  *[_type == "blog" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get blog posts by locale
export const getBlogsByLocaleQuery = (locale = 'en') => `
  *[_type == "blog" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get blog posts by category
export const getBlogsByCategoryQuery = (category, locale = 'en') => `
  *[_type == "blog" && status == "published" && category.${locale} == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get a single blog post by slug
export const getBlogBySlugQuery = (slug, locale = 'en') => `
  *[_type == "blog" && slug.${locale}.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar,
      bio,
      social
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get featured blog posts
export const getFeaturedBlogsQuery = `
  *[_type == "blog" && status == "published" && isFeatured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get related blog posts
export const getRelatedBlogsQuery = (category, excludeId, locale = 'en') => `
  *[_type == "blog" && status == "published" && category.${locale} == $category && _id != $excludeId] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get blog posts with pagination
export const getBlogsWithPaginationQuery = (limit = 10, offset = 0) => `
  *[_type == "blog" && status == "published"] | order(publishedAt desc)[$offset...$offset + $limit] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Query to get total count of blog posts
export const getBlogsCountQuery = `
  count(*[_type == "blog" && status == "published"])
`

// Query to get blog posts by search term
export const getBlogsBySearchQuery = (searchTerm, locale = 'en') => `
  *[_type == "blog" && status == "published" && (
    title.${locale} match $searchTerm + "*" ||
    excerpt.${locale} match $searchTerm + "*" ||
    content.${locale}[0].children[0].text match $searchTerm + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    tags,
    author->{
      _id,
      name,
      avatar
    },
    readTime,
    isFeatured,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords
  }
`

// Helper functions to execute queries
export async function getAllBlogs() {
  return await sanityClient.fetch(getAllBlogsQuery)
}

export async function getBlogsByLocale(locale = 'en') {
  return await sanityClient.fetch(getBlogsByLocaleQuery(locale))
}

export async function getBlogsByCategory(category, locale = 'en') {
  return await sanityClient.fetch(getBlogsByCategoryQuery(category, locale), { category })
}

export async function getBlogBySlug(slug, locale = 'en') {
  return await sanityClient.fetch(getBlogBySlugQuery(slug, locale), { slug })
}

export async function getFeaturedBlogs() {
  return await sanityClient.fetch(getFeaturedBlogsQuery)
}

export async function getRelatedBlogs(category, excludeId, locale = 'en') {
  return await sanityClient.fetch(getRelatedBlogsQuery(category, excludeId, locale), { 
    category, 
    excludeId 
  })
}

export async function getBlogsWithPagination(limit = 10, offset = 0) {
  return await sanityClient.fetch(getBlogsWithPaginationQuery(limit, offset), { limit, offset })
}

export async function getBlogsCount() {
  return await sanityClient.fetch(getBlogsCountQuery)
}

export async function getBlogsBySearch(searchTerm, locale = 'en') {
  return await sanityClient.fetch(getBlogsBySearchQuery(searchTerm, locale), { searchTerm })
} 