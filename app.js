/**
 * Dr. Saurabh Chipde - Premium Personal Brand Website
 * Client Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initBookingModal();
  initFaqAccordion();
  initSmoothScroll();
});

/* ---------------- 1. Sticky Header ---------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ---------------- 2. Mobile Navigation Drawer ---------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  const links = drawer.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ---------------- 3. Interactive Booking Wizard & Modal ---------------- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('.js-book-btn');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = modal.querySelector('#appointmentForm');
  const alertSuccess = modal.querySelector('#bookingSuccessAlert');
  const reasonSelect = modal.querySelector('#bookingReason');

  const openModal = (reason) => {
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reason = btn.getAttribute('data-reason') || '';
      openModal(reason);
      if (window.chipdeTrack) {
        window.chipdeTrack('book_consultation_click', { source: btn.getAttribute('data-source') || 'button' });
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#patientName')?.value.trim();
      const phone = form.querySelector('#patientPhone')?.value.trim();
      const email = form.querySelector('#patientEmail')?.value.trim();
      const reason = form.querySelector('#bookingReason')?.value;
      const date = form.querySelector('#bookingDate')?.value;
      const time = form.querySelector('#bookingTime')?.value;
      const message = form.querySelector('#patientMessage')?.value.trim();
      const consent = form.querySelector('#bookingConsent')?.checked;

      if (!name || !phone) {
        alert('Please enter your full name and contact mobile number.');
        return;
      }

      if (!consent) {
        alert('Please acknowledge consent to proceed with consultation scheduling.');
        return;
      }

      // Track conversion
      if (window.chipdeTrack) {
        window.chipdeTrack('appointment_form_submission', { reason, date });
      }

      // Generate pre-filled WhatsApp message
      const waText = encodeURIComponent(
        `Hello Dr. Chipde's clinic team,\nI would like to request an appointment.\n\nName: ${name}\nPhone: ${phone}\nSpecialty / Concern: ${reason}\nPreferred Date: ${date || 'Earliest available'}\nPreferred Time: ${time || 'Morning OPD'}` +
        (message ? `\nNotes: ${message}` : '')
      );

      const waUrl = `https://wa.me/917869392498?text=${waText}`;

      // Show confirmed success view
      if (alertSuccess) {
        alertSuccess.innerHTML = `
          <strong><i class="fa fa-check-circle"></i> Request Received!</strong><br>
          Thank you. Your consultation request has been received. The clinic team will contact you shortly.<br><br>
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="width:100%; justify-content:center;">
            <i class="fa fa-whatsapp"></i> Also Send Details on WhatsApp for Instant Confirmation
          </a>
        `;
        alertSuccess.classList.add('visible');
        form.reset();
      }
    });
  }
}

/* ---------------- 4. FAQ Accordion ---------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---------------- 5. Smooth Scroll Helper ---------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
