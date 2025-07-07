export default {
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'bn',
          title: 'Bangla Title',
          type: 'string'
        }
      ]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Slug',
          type: 'slug',
          options: {
            source: 'title.en',
            maxLength: 96,
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'bn',
          title: 'Bangla Slug',
          type: 'slug',
          options: {
            source: 'title.bn',
            maxLength: 96,
          }
        }
      ]
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Excerpt',
          type: 'text',
          rows: 3
        },
        {
          name: 'bn',
          title: 'Bangla Excerpt',
          type: 'text',
          rows: 3
        }
      ]
    },
    {
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'H4', value: 'h4'},
                {title: 'Quote', value: 'blockquote'},
              ],
              lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                  {title: 'Code', value: 'code'},
                ],
                annotations: [
                  {
                    title: 'URL',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for SEO and accessibility.',
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
            {
              type: 'code',
              options: {
                withFilename: true,
              },
            },
          ]
        },
        {
          name: 'bn',
          title: 'Bangla Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'H4', value: 'h4'},
                {title: 'Quote', value: 'blockquote'},
              ],
              lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                  {title: 'Code', value: 'code'},
                ],
                annotations: [
                  {
                    title: 'URL',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for SEO and accessibility.',
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
            {
              type: 'code',
              options: {
                withFilename: true,
              },
            },
          ]
        }
      ]
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Category',
          type: 'string',
          options: {
            list: [
              {title: 'Technology', value: 'technology'},
              {title: 'Politics', value: 'politics'},
              {title: 'Sports', value: 'sports'},
              {title: 'Entertainment', value: 'entertainment'},
              {title: 'Reviews', value: 'reviews'},
              {title: 'Best', value: 'best'},
              {title: 'Deals', value: 'deals'},
              {title: 'How-to', value: 'how-to'},
            ],
          },
        },
        {
          name: 'bn',
          title: 'Bangla Category',
          type: 'string',
          options: {
            list: [
              {title: 'প্রযুক্তি', value: 'technology'},
              {title: 'রাজনীতি', value: 'politics'},
              {title: 'খেলাধুলা', value: 'sports'},
              {title: 'বিনোদন', value: 'entertainment'},
              {title: 'পর্যালোচনা', value: 'reviews'},
              {title: 'সেরা', value: 'best'},
              {title: 'অফার', value: 'deals'},
              {title: 'কিভাবে', value: 'how-to'},
            ],
          },
        }
      ]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Tags',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        },
        {
          name: 'bn',
          title: 'Bangla Tags',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        }
      ]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    },
    {
      name: 'readTime',
      title: 'Read Time',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Read Time',
          type: 'string',
          description: 'e.g., "5 min read"'
        },
        {
          name: 'bn',
          title: 'Bangla Read Time',
          type: 'string',
          description: 'e.g., "৫ মিনিট পড়া"'
        }
      ]
    },
    {
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'draft',
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English SEO Title',
          type: 'string',
        },
        {
          name: 'bn',
          title: 'Bangla SEO Title',
          type: 'string',
        }
      ]
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English SEO Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'bn',
          title: 'Bangla SEO Description',
          type: 'text',
          rows: 3,
        }
      ]
    },
    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English SEO Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        },
        {
          name: 'bn',
          title: 'Bangla SEO Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        }
      ]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'featuredImage',
      status: 'status'
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
} 