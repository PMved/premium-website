/**
 * Dr. Saurabh Chipde - Analytics & Conversion Tracking Module
 * Privacy-Hardened: Zero PHI/PII Parameter Leakage (DPDP Act 2023 Compliant)
 */

window.chipdeTrack = function(eventName, params = {}) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  } catch (err) {
    // Non-blocking fail-safe
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // WhatsApp links tracking - STRIP query parameters to strictly prevent leaking PHI/PII (name, phone, medical concern)
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('whatsapp_click', {
        destination: 'clinic_whatsapp',
        page: window.location.pathname
      });
    });
  });

  // Telephone call tracking - Generic destination identifier, no personal data
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('call_click', {
        destination: 'clinic_opd_desk',
        page: window.location.pathname
      });
    });
  });

  // Social media interaction tracking
  document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('social_click', { platform: 'instagram' });
    });
  });

  // Google reviews link tracking
  document.querySelectorAll('.js-review-link').forEach(link => {
    link.addEventListener('click', () => {
      window.chipdeTrack('google_reviews_click');
    });
  });
});
