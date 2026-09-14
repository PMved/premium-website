/**
 * Dr. Saurabh Chipde - Analytics & Conversion Tracking Module
 */

window.chipdeTrack = function(eventName, params = {}) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    console.log('[Analytics Event]:', eventName, params);
  } catch (err) {
    console.error('Tracking error:', err);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // WhatsApp links tracking
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('whatsapp_click', { url: link.href });
    });
  });

  // Telephone call tracking
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('call_click', { phone: link.href });
    });
  });

  // Instagram links tracking
  document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('instagram_click', { url: link.href });
    });
  });

  // Google reviews link tracking
  document.querySelectorAll('.js-review-link').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('google_reviews_click');
    });
  });
});
