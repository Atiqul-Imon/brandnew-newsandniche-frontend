export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    },
    {
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url',
        },
      ],
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'Editor', value: 'editor'},
          {title: 'Author', value: 'author'},
          {title: 'Contributor', value: 'contributor'},
        ],
      },
      initialValue: 'author',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
      role: 'role'
    },
    prepare(selection) {
      const {role} = selection
      return Object.assign({}, selection, {
        subtitle: role && `Role: ${role}`,
      })
    },
  },
} 