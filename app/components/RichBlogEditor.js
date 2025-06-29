"use client";
import { useState, useRef } from 'react';

const RichBlogEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your blog content here...",
  language = 'en',
  disabled = false 
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef(null);

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    onChange(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertCodeBlock = () => {
    const codeBlock = `\`\`\`javascript
// Your code here
console.log('Hello World!');
\`\`\`

`;
    insertAtCursor(codeBlock);
  };

  const insertImage = () => {
    const alt = prompt('Enter image alt text:');
    const src = prompt('Enter image URL:');
    if (alt && src) {
      const imageBlock = `!IMAGE: ${alt} [${src}]

`;
      insertAtCursor(imageBlock);
    }
  };

  const insertGallery = () => {
    const title = prompt('Enter gallery title (optional):');
    const images = prompt('Enter image URLs separated by commas:');
    if (images) {
      const galleryBlock = `!GALLERY: ${title || 'Image Gallery'} [${images}]

`;
      insertAtCursor(galleryBlock);
    }
  };

  const insertCallout = () => {
    const type = prompt('Enter callout type (info/warning/error/success):', 'info');
    const content = prompt('Enter callout content:');
    if (type && content) {
      const calloutBlock = `!CALLOUT: ${type} [${content}]

`;
      insertAtCursor(calloutBlock);
    }
  };

  const insertHeading = (level) => {
    const text = prompt(`Enter heading ${level} text:`);
    if (text) {
      const heading = '#'.repeat(level) + ' ' + text + '\n\n';
      insertAtCursor(heading);
    }
  };

  const insertList = (ordered = false) => {
    const items = prompt('Enter list items separated by commas:');
    if (items) {
      const listItems = items.split(',').map((item, index) => {
        const prefix = ordered ? `${index + 1}. ` : '- ';
        return prefix + item.trim();
      }).join('\n');
      const listBlock = listItems + '\n\n';
      insertAtCursor(listBlock);
    }
  };

  const insertQuote = () => {
    const quote = prompt('Enter quote text:');
    if (quote) {
      const quoteBlock = `> ${quote}\n\n`;
      insertAtCursor(quoteBlock);
    }
  };

  const insertTable = () => {
    const tableBlock = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

`;
    insertAtCursor(tableBlock);
  };

  const insertLink = () => {
    const text = prompt('Enter link text:');
    const url = prompt('Enter URL:');
    if (text && url) {
      const linkBlock = `[${text}](${url})`;
      insertAtCursor(linkBlock);
    }
  };

  const insertBold = () => {
    const text = prompt('Enter text to make bold:');
    if (text) {
      const boldBlock = `**${text}**`;
      insertAtCursor(boldBlock);
    }
  };

  const insertItalic = () => {
    const text = prompt('Enter text to make italic:');
    if (text) {
      const italicBlock = `*${text}*`;
      insertAtCursor(italicBlock);
    }
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Insert:</span>
          
          {/* Text Formatting */}
          <button
            onClick={() => insertBold()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertItalic()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertLink()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Link"
          >
            🔗
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          
          {/* Headings */}
          <button
            onClick={() => insertHeading(1)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => insertHeading(2)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => insertHeading(3)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Heading 3"
          >
            H3
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          
          {/* Lists */}
          <button
            onClick={() => insertList(false)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Unordered List"
          >
            • List
          </button>
          <button
            onClick={() => insertList(true)}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Ordered List"
          >
            1. List
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          
          {/* Code */}
          <button
            onClick={() => insertCodeBlock()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Code Block"
          >
            &lt;/&gt;
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          
          {/* Media */}
          <button
            onClick={() => insertImage()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Insert Image"
          >
            🖼️
          </button>
          <button
            onClick={() => insertGallery()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Insert Image Gallery"
          >
            🖼️🖼️
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          
          {/* Special Blocks */}
          <button
            onClick={() => insertCallout()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Insert Callout"
          >
            💡
          </button>
          <button
            onClick={() => insertQuote()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Insert Quote"
          >
            &quot;
          </button>
          <button
            onClick={() => insertTable()}
            className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Insert Table"
          >
            ⊞
          </button>
        </div>
        
        {/* Help Text */}
        <div className="mt-3 text-xs text-gray-600">
          <p><strong>Syntax Guide:</strong></p>
          <p>• Code: <code>```language [title]</code> ... <code>```</code></p>
          <p>• Image: <code>!IMAGE: alt text [url]</code></p>
          <p>• Gallery: <code>!GALLERY: title [url1, url2, url3]</code></p>
          <p>• Callout: <code>!CALLOUT: type [content]</code></p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
        rows={15}
        style={{ 
          fontFamily: language === 'bn' ? 'Tiro Bangla, serif' : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          lineHeight: '1.6'
        }}
      />
      
      {/* Character Count */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        {value?.length || 0} characters
      </div>
    </div>
  );
};

export default RichBlogEditor; 