# Sanity CMS Setup Guide

## Phase 1: Initial Setup (Complete ✅)

The following components have been created:

### ✅ Sanity Configuration
- `lib/sanity.js` - Sanity client configuration
- `lib/sanity-queries.js` - GROQ queries for fetching blog data
- `sanity.config.js` - Sanity Studio configuration
- `sanity/schemas/` - Content schemas (blog, author)

### ✅ Parallel Blog Pages
- `app/[locale]/blogs-sanity/page.js` - Blog listing page using Sanity
- `app/[locale]/blogs-sanity/[slug]/page.js` - Blog detail page using Sanity

### ✅ Dependencies Installed
- `@sanity/client` - Sanity client
- `@sanity/image-url` - Image URL builder
- `next-sanity` - Next.js integration
- `@portabletext/react` - Rich text rendering

## Phase 2: Sanity Project Setup (Required)

### Step 1: Create Sanity Project
1. Go to [sanity.io](https://sanity.io) and create an account
2. Create a new project
3. Note down your Project ID

### Step 2: Configure Environment Variables
Add to your `.env.local` file:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 3: Initialize Sanity Studio (Optional)
If you want to run Sanity Studio locally:
```bash
npx sanity@latest init --template clean --create-project "News&Niche CMS" --dataset production
```

### Step 4: Deploy Sanity Studio
Deploy your Sanity Studio to manage content:
```bash
npx sanity@latest deploy
```

## Phase 3: Testing

### Current Status
- ✅ All code is ready
- ✅ Parallel pages created at `/blogs-sanity`
- ✅ Navigation link added for testing
- ⏳ Waiting for Sanity project setup

### Test URLs
- English: `/en/blogs-sanity`
- Bangla: `/bn/blogs-sanity`
- Individual posts: `/en/blogs-sanity/[slug]`

### Expected Behavior
- Pages will show "No blog posts found" until content is added to Sanity
- No errors should occur (graceful fallback)
- All existing functionality remains unchanged

## Phase 4: Content Migration (When Ready)

### Add Sample Content
1. Go to your Sanity Studio
2. Create an Author first
3. Create Blog Posts with:
   - English and Bangla titles
   - English and Bangla content
   - Featured images
   - Categories and tags

### Test Content
- Verify posts appear on `/blogs-sanity`
- Test individual post pages
- Check SEO metadata
- Verify multilingual support

## Phase 5: Migration Decision

### If Sanity Works Well:
1. Replace existing blog pages with Sanity versions
2. Remove old blog dashboard
3. Update navigation links
4. Clean up unused code

### If Issues Arise:
1. Keep existing system
2. Remove Sanity integration
3. No disruption to current functionality

## Current Files Structure

```
frontend/
├── lib/
│   ├── sanity.js              ✅ Sanity client
│   └── sanity-queries.js      ✅ GROQ queries
├── sanity/
│   ├── schemas/
│   │   ├── blog.js            ✅ Blog schema
│   │   ├── author.js          ✅ Author schema
│   │   └── index.js           ✅ Schema index
│   └── sanity.config.js       ✅ Studio config
├── app/[locale]/
│   ├── blogs-sanity/          ✅ Parallel blog pages
│   │   ├── page.js
│   │   └── [slug]/page.js
│   └── blogs/                 ✅ Original blog pages (unchanged)
└── components/
    └── Navigation.js          ✅ Added test link
```

## Next Steps

1. **Set up Sanity project** (you need to do this)
2. **Add environment variables**
3. **Test the parallel pages**
4. **Add sample content**
5. **Evaluate performance and functionality**
6. **Decide on migration**

The implementation is **completely modular** - existing functionality is untouched! 