/**
 * Dr. Saurabh Chipde - Premium Personal Brand Website
 * Client Interactive & Accessibility Engine
 * WCAG AA Compliant • Zero Heavy Dependencies
 */

/**
 * HTML entity escaping utility to prevent DOM-based XSS attacks
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.__chipdeAppInitialized) return;
  window.__chipdeAppInitialized = true;

  initStickyHeader();
  initDropdownMenus();
  initMobileNav();
  initBookingModal();
  initStandaloneBookingForm();
  initFaqAccordion();
  initSmoothScroll();
});

/* ---------------- 1. Sticky Header ---------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}


/* ---------------- 2. Desktop Dropdown Menus (Accessibility & Hover Delay) ---------------- */
function initDropdownMenus() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  if (!dropdownItems.length) return;

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('a.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    let closeTimeout = null;

    if (!trigger || !dropdown) return;

    const openDropdown = () => {
      clearTimeout(closeTimeout);
      dropdownItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active-dropdown');
          const otherTrigger = other.querySelector('a.nav-link');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('active-dropdown');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
      closeTimeout = setTimeout(() => {
        item.classList.remove('active-dropdown');
        trigger.setAttribute('aria-expanded', 'false');
      }, 150);
    };

    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', closeDropdown);

    // Keyboard support: Enter / Space toggle, Escape closes
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        const isOpen = item.classList.contains('active-dropdown');
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
          const firstLink = dropdown.querySelector('a');
          if (firstLink) setTimeout(() => firstLink.focus(), 50);
        }
      } else if (e.key === 'Escape') {
        item.classList.remove('active-dropdown');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('active-dropdown');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Global click outside to close desktop dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(item => {
        item.classList.remove('active-dropdown');
        const trigger = item.querySelector('a.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ---------------- 3. Mobile Navigation Drawer & Touch Accordions ---------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Accordion Expand/Collapse inside Mobile Drawer (CR Section 8 & 13)
  const accordionBtns = drawer.querySelectorAll('.mobile-accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = btn.nextElementSibling;
      const isOpen = btn.classList.contains('active');

      // Close other accordions for clean single-view accordion
      accordionBtns.forEach(other => {
        if (other !== btn) {
          other.classList.remove('active');
          other.setAttribute('aria-expanded', 'false');
          if (other.nextElementSibling) {
            other.nextElementSibling.classList.remove('open');
          }
        }
      });

      if (isOpen) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.classList.remove('open');
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (panel) panel.classList.add('open');
      }
    });
  });

  // Close drawer on navigating to a page via a link
  const links = drawer.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ---------------- 3. Accessible Booking Modal & Focus Trap ---------------- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('.js-book-btn');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = modal.querySelector('#appointmentForm');
  const alertSuccess = modal.querySelector('#bookingSuccessAlert');
  const reasonSelect = modal.querySelector('#bookingReason') || modal.querySelector('#reason');

  let lastActiveElement = null;

  const openModal = (reason) => {
    lastActiveElement = document.activeElement;
    if (reason && reasonSelect) {
      for (let i = 0; i < reasonSelect.options.length; i++) {
        if (reasonSelect.options[i].value.toLowerCase().includes(reason.toLowerCase()) || 
            reasonSelect.options[i].text.toLowerCase().includes(reason.toLowerCase())) {
          reasonSelect.selectedIndex = i;
          break;
        }
      }
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first interactive input
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reason = btn.getAttribute('data-reason') || '';
      openModal(reason);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Focus Trap inside modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.querySelector('#bookName') || form.querySelector('#patientName'))?.value.trim();
      const phone = (form.querySelector('#bookPhone') || form.querySelector('#patientPhone'))?.value.trim();
      const reason = (form.querySelector('#bookingReason') || form.querySelector('#reason'))?.value || 'General Urology';
      const date = (form.querySelector('#bookDate') || form.querySelector('#bookingDate'))?.value;
      const message = (form.querySelector('#bookMessage') || form.querySelector('#patientMessage'))?.value.trim();
      const consent = (form.querySelector('#bookConsent') || form.querySelector('#bookingConsent'))?.checked;

      if (!name || !phone) {
        alert('Please provide your full name and 10-digit mobile number.');
        return;
      }

      if (phone.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      if (!consent) {
        alert('Please consent to contact from our clinic desk.');
        return;
      }

      // Generate pre-filled WhatsApp link (Preferred Time removed)
      const waText = encodeURIComponent(
        `Hello Dr. Chipde's clinic team,\nI have submitted an appointment request.\n\nName: ${name}\nPhone: +91 ${phone}\nConcern: ${reason}\nPreferred Date: ${date || 'Earliest available'}` +
        (message ? `\nNote: ${message}` : '')
      );
      const waUrl = `https://wa.me/917869392498?text=${waText}`;

      // Open WhatsApp to route request directly to clinic desk
      window.open(waUrl, '_blank');

      // Show transparent submission guidance
      if (alertSuccess) {
        const safeName = escapeHtml(name);
        const safePhone = escapeHtml(phone);
        alertSuccess.className = 'modal-success-card';
        alertSuccess.innerHTML = `
          <div class="success-icon-badge"><i class="fa fa-whatsapp"></i></div>
          <div class="success-content">
            <strong style="display:block; font-size:1.05rem; margin-bottom:4px; color:#166534;"><i class="fa fa-check-circle"></i> Opening WhatsApp to Complete Booking...</strong>
            <p style="margin:0 0 10px; font-size:0.9rem; color:#14532D; line-height:1.5;">Thank you, ${safeName}. Your appointment request is prepared for Dr. Chipde's clinical coordination desk at Apollo Rajshree Hospital.</p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display:inline-flex; align-items:center; gap:6px; padding:9px 16px; font-size:0.875rem;">
              <i class="fa fa-whatsapp"></i> Click Here if WhatsApp Did Not Open Automatically
            </a>
          </div>
        `;
        alertSuccess.style.display = 'flex';
        form.reset();
      }
    });
  }
}

/* ---------------- 4. Standalone Booking Form (book-consultation.html) ---------------- */
function initStandaloneBookingForm() {
  const form = document.getElementById('standaloneAppointmentForm');
  const alertSuccess = document.getElementById('pageBookingSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#pageBookName')?.value.trim();
    const phone = form.querySelector('#pageBookPhone')?.value.trim();
    const reason = form.querySelector('#pageBookingReason')?.value || 'General Consultation';
    const date = form.querySelector('#pageBookDate')?.value;
    const message = form.querySelector('#pageBookMessage')?.value.trim();
    const consent = form.querySelector('#pageBookConsent')?.checked;

    if (!name || !phone) {
      alert('Please provide your full name and 10-digit mobile number.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!consent) {
      alert('Please check the consent box to proceed.');
      return;
    }

    const waText = encodeURIComponent(
      `Hello Dr. Chipde's clinic,\nI have submitted an appointment request online.\n\nName: ${name}\nMobile: +91 ${phone}\nConcern: ${reason}\nDate: ${date || 'Earliest Available'}` +
      (message ? `\nNote: ${message}` : '')
    );
    const waUrl = `https://wa.me/917869392498?text=${waText}`;

    // Open WhatsApp directly
    window.open(waUrl, '_blank');

    if (alertSuccess) {
      const safeName = escapeHtml(name);
      const safePhone = escapeHtml(phone);
      alertSuccess.className = 'modal-success-card';
      alertSuccess.innerHTML = `
        <div class="success-icon-badge"><i class="fa fa-whatsapp"></i></div>
        <div class="success-content">
          <strong style="display:block; font-size:1.05rem; margin-bottom:4px; color:#166534;"><i class="fa fa-check-circle"></i> Opening WhatsApp to Complete Booking...</strong>
          <p style="margin:0 0 10px; font-size:0.9rem; color:#14532D; line-height:1.5;">Thank you, ${safeName}. Your appointment request is prepared for Dr. Chipde's clinical coordination desk at Apollo Rajshree Hospital.</p>
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display:inline-flex; align-items:center; gap:6px; padding:9px 16px; font-size:0.875rem;">
            <i class="fa fa-whatsapp"></i> Click Here if WhatsApp Did Not Open Automatically
          </a>
        </div>
      `;
      alertSuccess.style.display = 'flex';
      form.reset();
      alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ---------------- 5. Accessible FAQ Accordion ---------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    // Set accessibility IDs
    const qId = `faq-q-${index}`;
    const aId = `faq-a-${index}`;

    questionBtn.setAttribute('id', qId);
    questionBtn.setAttribute('aria-controls', aId);
    questionBtn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('id', aId);
    answer.setAttribute('aria-labelledby', qId);
    answer.setAttribute('role', 'region');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other accordions in the group
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------------- 6. Smooth Scroll ---------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
