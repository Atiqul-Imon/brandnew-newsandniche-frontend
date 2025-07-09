// Internal link tracking utility for SEO analytics

export const trackInternalLink = (fromPage, toPage, linkType = 'contextual') => {
  try {
    // Track internal link clicks for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'internal_link_click', {
        event_category: 'Internal Linking',
        event_label: `${fromPage} -> ${toPage}`,
        link_type: linkType,
        from_page: fromPage,
        to_page: toPage,
        custom_parameter: {
          link_type: linkType,
          from_page: fromPage,
          to_page: toPage
        }
      });
    }

    // Also track with custom analytics if available
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'internal_link_click',
        link_type: linkType,
        from_page: fromPage,
        to_page: toPage,
        timestamp: new Date().toISOString()
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Internal Link Click: ${fromPage} -> ${toPage} (${linkType})`);
    }
  } catch (error) {
    console.error('Error tracking internal link:', error);
  }
};

export const trackRelatedPostsClick = (currentPost, clickedPost, position) => {
  trackInternalLink(
    `blog/${currentPost.slug}`,
    `blog/${clickedPost.slug}`,
    `related_posts_${position}`
  );
};

export const trackCategoryCrossLink = (fromCategory, toCategory) => {
  trackInternalLink(
    `category/${fromCategory}`,
    `category/${toCategory}`,
    'category_cross_link'
  );
};

export const trackPopularPostsClick = (currentPage, clickedPost, position) => {
  trackInternalLink(
    currentPage,
    `blog/${clickedPost.slug}`,
    `popular_posts_${position}`
  );
};

export const trackContextualLink = (currentPost, clickedPost, keyword) => {
  trackInternalLink(
    `blog/${currentPost.slug}`,
    `blog/${clickedPost.slug}`,
    `contextual_${keyword}`
  );
}; 