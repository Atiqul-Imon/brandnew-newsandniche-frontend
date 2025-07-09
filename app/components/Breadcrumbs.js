import Link from 'next/link';

export default function Breadcrumbs({ items, locale }) {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? "text-gray-900 font-medium" : ""}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 