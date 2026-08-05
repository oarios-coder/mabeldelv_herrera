document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     NAVBAR SCROLL STYLE
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.padding = '0';
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly trigger before scrolling in completely
  });

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });

  /* ==========================================================================
     TAB SYSTEM (SOBRE MABEL)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Add active class to clicked button and target pane
      button.classList.add('active');
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     TESTIMONIALS SLIDER
     ========================================================================== */
  const slider = document.getElementById('testimonials-slider');
  if (slider) {
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial-card');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const dotsContainer = slider.querySelector('.slider-dots');
    
    let currentIndex = 0;
    const slideCount = slides.length;

    // Create dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.dot');

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + slideCount) % slideCount;
      updateSlider();
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Optional: Auto slide every 8 seconds
    let autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), 8000);

    const resetInterval = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), 8000);
    };

    prevBtn.addEventListener('click', resetInterval);
    nextBtn.addEventListener('click', resetInterval);
    dots.forEach(dot => dot.addEventListener('click', resetInterval));
  }

  /* ==========================================================================
     LIGHTBOX GALLERY
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  if (lightboxModal && lightboxImg && lightboxCaption) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');

        lightboxImg.src = src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Disable page scroll
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore page scroll
      setTimeout(() => {
        lightboxImg.src = ''; // Clear source after transition
      }, 400);
    };

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('[required]');

    // Validate a single input field
    const validateField = (input) => {
      const errorMsg = document.getElementById(`error-${input.id}`);
      let isValid = true;

      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value.trim());
      } else {
        isValid = input.value.trim() !== '';
      }

      if (isValid) {
        input.classList.remove('invalid');
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        input.classList.add('invalid');
        if (errorMsg) errorMsg.style.display = 'block';
      }

      return isValid;
    };

    // Validation events
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    // Form submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      inputs.forEach(input => {
        const isValid = validateField(input);
        if (!isValid) isFormValid = false;
      });

      if (!isFormValid) {
        formStatus.textContent = 'Por favor, completa los campos requeridos correctamente.';
        formStatus.className = 'form-status error';
        return;
      }

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      formStatus.style.display = 'none';

      // Send form data via AJAX to FormSubmit
      const formData = new FormData(contactForm);
      
      fetch('https://formsubmit.co/ajax/contacto@mabeldelvherrera.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar consulta';
        
        if (data.success === 'true' || data.success === true) {
          formStatus.textContent = '¡Gracias por tu mensaje! Tu consulta ha sido enviada con éxito.';
          formStatus.className = 'form-status success';
          contactForm.reset(); // Clear inputs
        } else {
          formStatus.textContent = 'Hubo un inconveniente al enviar. Por favor, intenta de nuevo o comunícate vía WhatsApp.';
          formStatus.className = 'form-status error';
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar consulta';
        formStatus.textContent = 'Ocurrió un error de conexión. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
        formStatus.className = 'form-status error';
      });
    });
  }

  /* ==========================================================================
     PARALLAX EFFECT FOR HERO
     ========================================================================== */
  const hero = document.getElementById('inicio');
  const orbs = document.querySelectorAll('.glow-orb');
  const shape = document.querySelector('.organic-shape');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Parallax on decorative elements
    if (scrollPos < 1000) {
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.15;
        orb.style.transform = `translateY(${scrollPos * speed}px)`;
      });
      if (shape) {
        shape.style.transform = `translateY(${scrollPos * 0.1}px) rotate(${scrollPos * 0.05}deg)`;
      }
    }
  });
});
