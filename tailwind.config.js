/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bangla: ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-ui': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-heading': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-bold': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-nav': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-blog': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'bangla-blog-heading': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
        'noto-bangla': ['Noto Sans Bengali', 'Hind Siliguri', 'Tiro Bangla', 'SolaimanLipi', 'SiyamRupali', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Tablet-specific breakpoints
        'tablet': '768px',
        'tablet-lg': '1024px',
        'tablet-xl': '1280px',
        // 8-inch tablet specific (768px - 1024px)
        'tablet-8': '768px',
        'tablet-8-lg': '1024px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/1': '2 / 1',
      },
      fontSize: {
        'bangla-xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'bangla-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'bangla-base': ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'bangla-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.02em' }],
        'bangla-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.02em' }],
        'bangla-2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'bangla-3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        'bangla-4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'bangla-5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.01em' }],
        'bangla-6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.01em' }],
      },
      lineHeight: {
        'bangla-tight': '1.3',
        'bangla-snug': '1.4',
        'bangla-normal': '1.7',
        'bangla-relaxed': '1.8',
        'bangla-loose': '1.9',
      },
      letterSpacing: {
        'bangla-tight': '0.01em',
        'bangla-normal': '0.02em',
        'bangla-wide': '0.03em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}; 