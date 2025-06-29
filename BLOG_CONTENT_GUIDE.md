# Blog Content Guide

This guide explains how to create rich, engaging blog content using the enhanced editor features.

## Table of Contents
1. [Text Formatting](#text-formatting)
2. [Code Blocks](#code-blocks)
3. [Images and Galleries](#images-and-galleries)
4. [Callout Boxes](#callout-boxes)
5. [Lists and Structure](#lists-and-structure)
6. [Tables](#tables)
7. [Links and References](#links-and-references)
8. [Best Practices](#best-practices)

## Text Formatting

### Bold Text
```
**This text will be bold**
```

### Italic Text
```
*This text will be italic*
```

### Links
```
[Link Text](https://example.com)
```

### Headings
```
# Heading 1
## Heading 2
### Heading 3
```

## Code Blocks

### Basic Code Block
```
```javascript
function helloWorld() {
    console.log('Hello, World!');
}
```
```

### Code Block with Title
```
```javascript My Awesome Function
function calculateSum(a, b) {
    return a + b;
}
```
```

### Supported Languages
- `javascript` - JavaScript
- `python` - Python
- `java` - Java
- `cpp` - C++
- `csharp` - C#
- `php` - PHP
- `ruby` - Ruby
- `go` - Go
- `rust` - Rust
- `sql` - SQL
- `html` - HTML
- `css` - CSS
- `bash` - Bash/Shell
- `json` - JSON
- `xml` - XML
- `yaml` - YAML
- `markdown` - Markdown

## Images and Galleries

### Single Image
```
!IMAGE: Alt text describing the image [https://example.com/image.jpg]
```

### Image Gallery
```
!GALLERY: Gallery Title [https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg]
```

### Best Practices for Images
- Use descriptive alt text for accessibility
- Optimize images for web (compress, use appropriate formats)
- Use high-quality images that are relevant to your content
- Consider image dimensions and aspect ratios

## Callout Boxes

### Info Callout
```
!CALLOUT: info [This is an informational message that provides helpful context to the reader.]
```

### Warning Callout
```
!CALLOUT: warning [This is a warning message that alerts readers to potential issues or important considerations.]
```

### Error Callout
```
!CALLOUT: error [This is an error message that highlights critical problems or mistakes to avoid.]
```

### Success Callout
```
!CALLOUT: success [This is a success message that confirms something worked correctly or provides positive feedback.]
```

## Lists and Structure

### Unordered List
```
- First item
- Second item
- Third item
  - Nested item
  - Another nested item
- Fourth item
```

### Ordered List
```
1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B
4. Fourth step
```

### Blockquotes
```
> This is a blockquote that can be used to highlight important quotes, 
> definitions, or key points from your content.
```

## Tables

### Basic Table
```
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Example: Programming Language Comparison
```
| Language | Type | Use Case |
|----------|------|----------|
| JavaScript | Dynamic | Web Development |
| Python | Dynamic | Data Science |
| Java | Static | Enterprise Apps |
| Rust | Static | Systems Programming |
```

## Links and References

### External Links
```
[Visit our documentation](https://docs.example.com)
[GitHub Repository](https://github.com/username/project)
```

### Internal References
```
[Previous blog post about React](/blogs/react-basics)
[Related category: Programming](/blogs?category=programming)
```

## Best Practices

### 1. Content Structure
- Use clear headings to organize your content
- Break up long paragraphs with lists and callouts
- Include relevant images to illustrate concepts
- Use code blocks for technical examples

### 2. Programming Content
- Always specify the programming language in code blocks
- Use descriptive titles for code blocks
- Include comments in code examples
- Provide context before and after code blocks

### 3. Accessibility
- Write descriptive alt text for all images
- Use semantic structure with proper headings
- Ensure sufficient color contrast
- Provide text alternatives for complex content

### 4. SEO Optimization
- Use descriptive headings that include keywords
- Write compelling excerpts
- Include relevant tags
- Optimize images with descriptive filenames

### 5. User Experience
- Keep paragraphs short and readable
- Use callouts to highlight important information
- Include examples and practical applications
- End with actionable takeaways

## Example: Complete Blog Post Structure

```
# Getting Started with React Hooks

This guide will walk you through the basics of React Hooks and how to use them effectively.

!CALLOUT: info [React Hooks were introduced in React 16.8 and allow you to use state and other React features without writing a class.]

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Basic useState Hook

The `useState` hook is the most commonly used hook for managing state in functional components.

```javascript useState Example
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
```

!CALLOUT: warning [Remember to always call hooks at the top level of your component, never inside loops, conditions, or nested functions.]

## Common Use Cases

- **Form handling** - Manage form state
- **API calls** - Store and update data from APIs
- **UI state** - Control component visibility and behavior
- **Calculations** - Store computed values

## Best Practices

1. Use descriptive variable names
2. Initialize state with appropriate default values
3. Use functional updates when new state depends on old state
4. Avoid storing derived state

!CALLOUT: success [You're now ready to start using React Hooks in your projects!]

## Next Steps

- [Advanced Hooks Guide](/blogs/react-hooks-advanced)
- [Custom Hooks Tutorial](/blogs/custom-hooks)
- [React Documentation](https://reactjs.org/docs/hooks-intro.html)
```

## Editor Tips

1. **Use the toolbar buttons** for quick insertion of common elements
2. **Preview your content** before publishing
3. **Test your code examples** to ensure they work correctly
4. **Use consistent formatting** throughout your post
5. **Include relevant tags** to help readers find your content

## Troubleshooting

### Code blocks not rendering properly?
- Ensure you have the correct language specified
- Check that the closing ``` is on its own line
- Verify there are no extra spaces before the opening ```

### Images not displaying?
- Check that the URL is accessible
- Ensure the image format is supported (JPG, PNG, WebP)
- Verify the URL is properly formatted

### Callouts not working?
- Make sure the syntax is exactly: `!CALLOUT: type [content]`
- Check that the type is one of: info, warning, error, success
- Ensure the content is properly enclosed in square brackets

For additional help, refer to the editor's built-in syntax guide or contact the development team. 