/* ============================================================
   Aarohi Women's Health & Maternity Clinic – script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     NAVBAR: Sticky scroll behaviour
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    // Back to top
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     HAMBURGER MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileServiceToggle = document.getElementById('mobile-services-toggle');
  const mobileServices = document.getElementById('mobile-services');

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.querySelectorAll('.hamburger-line').forEach((line, i) => {
      if (isOpen) {
        if (i === 0) line.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) line.style.opacity = '0';
        if (i === 2) line.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        line.style.transform = '';
        line.style.opacity = '';
      }
    });
  });

  mobileServiceToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    mobileServices?.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('[data-mobile-link]').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.querySelectorAll('.hamburger-line').forEach(line => {
        line.style.transform = '';
        line.style.opacity = '';
      });
    });
  });

  /* ============================================================
     ACTIVE NAV LINK (scroll spy)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  const counters = document.querySelectorAll('.counter-number[data-target]');

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = String(target).includes('.');

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = eased * target;
      el.textContent = isDecimal ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(1) + suffix : target + suffix;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ============================================================
     REVIEWS SLIDER
     ============================================================ */
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsContainer = document.getElementById('reviewsDots');

  if (track) {
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    const totalSlides = Math.ceil(cards.length / visibleCount);

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateSlider() {
      visibleCount = getVisibleCount();
      const cardWidth = track.parentElement.offsetWidth;
      const slideWidth = (cardWidth + 28) * visibleCount;
      track.style.transform = `translateX(-${currentIndex * (cardWidth / visibleCount + 28) * visibleCount}px)`;

      // Update dots
      const totalDots = Math.ceil(cards.length / visibleCount);
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
          const dot = document.createElement('div');
          dot.className = 'reviews-dot' + (i === currentIndex ? ' active' : '');
          dot.addEventListener('click', () => { currentIndex = i; updateSlider(); });
          dotsContainer.appendChild(dot);
        }
      }
    }

    prevBtn?.addEventListener('click', () => {
      const totalDots = Math.ceil(cards.length / visibleCount);
      currentIndex = (currentIndex - 1 + totalDots) % totalDots;
      updateSlider();
    });

    nextBtn?.addEventListener('click', () => {
      const totalDots = Math.ceil(cards.length / visibleCount);
      currentIndex = (currentIndex + 1) % totalDots;
      updateSlider();
    });

    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateSlider();
    });

    // Auto-advance
    let autoSlide = setInterval(() => {
      const totalDots = Math.ceil(cards.length / visibleCount);
      currentIndex = (currentIndex + 1) % totalDots;
      updateSlider();
    }, 5000);

    track.closest('.reviews-slider-wrapper')?.addEventListener('mouseenter', () => {
      clearInterval(autoSlide);
    });
    track.closest('.reviews-slider-wrapper')?.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        const totalDots = Math.ceil(cards.length / visibleCount);
        currentIndex = (currentIndex + 1) % totalDots;
        updateSlider();
      }, 5000);
    });

    updateSlider();
  }

  /* ============================================================
     GALLERY FILTER + LIGHTBOX
     ============================================================ */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.dataset.full || item.querySelector('img')?.src;
      const alt = item.querySelector('img')?.alt || '';
      if (lightbox && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxImg) { setTimeout(() => { lightboxImg.src = ''; }, 300); }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ============================================================
     APPOINTMENT FORM → WhatsApp
     ============================================================ */
  const apptForm = document.getElementById('appointmentForm');

  apptForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('appt-name')?.value.trim();
    const phone = document.getElementById('appt-phone')?.value.trim();
    const email = document.getElementById('appt-email')?.value.trim();
    const service = document.getElementById('appt-service')?.value;
    const doctor = document.getElementById('appt-doctor')?.value;
    const date = document.getElementById('appt-date')?.value;
    const message = document.getElementById('appt-message')?.value.trim();

    // Validation
    const errors = [];
    if (!name) errors.push('Please enter your name.');
    if (!phone || !/^\+?[\d\s\-]{8,15}$/.test(phone)) errors.push('Please enter a valid phone number.');
    if (!service) errors.push('Please select a service.');
    if (!date) errors.push('Please choose a preferred date.');

    if (errors.length) {
      alert('⚠️ ' + errors.join('\n'));
      return;
    }

    // Format date nicely
    const dateFormatted = date
      ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'Not specified';

    const msg = `Hello, I would like to book an appointment at *Aarohi Women's Health & Maternity Clinic*.

📋 *Appointment Details:*
👤 *Name:* ${name}
📞 *Phone:* ${phone}
📧 *Email:* ${email || 'Not provided'}
🏥 *Service Required:* ${service}
👩‍⚕️ *Preferred Doctor:* ${doctor}
📅 *Preferred Date:* ${dateFormatted}
💬 *Message:* ${message || 'No additional message'}

Please confirm my appointment. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  });

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 52 + 72 + 16; // topbar + navbar + buffer
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     FAQ ACCORDION (used on service pages)
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Open clicked (if it wasn't open)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ============================================================
     LAZY IMAGE LOADING (native + IntersectionObserver fallback)
     ============================================================ */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported — already using loading="lazy" in HTML
  } else {
    // Fallback
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    imgs.forEach(img => imgObserver.observe(img));
  }

  /* ============================================================
     MICRO-INTERACTIONS: Service card button hover
     ============================================================ */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = '';
    });
  });

});
