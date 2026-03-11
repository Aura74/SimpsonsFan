/* ============================================
   THE SIMPSONS FANZONEN - JAVASCRIPT
   GSAP Animations & Interactivity
   ============================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // ============================================
  // LOADER
  // ============================================
  window.addEventListener('load', () => {
    gsap.to('#loader', {
      opacity: 0,
      duration: 0.6,
      delay: 1.2,
      onComplete: () => {
        document.getElementById('loader').classList.add('hidden');
        startHeroAnimations();
      }
    });
  });

  // Fallback: hide loader after 4 seconds max
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      startHeroAnimations();
    }
  }, 4000);

  // ============================================
  // NAVIGATION
  // ============================================
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============================================
  // HERO ANIMATIONS
  // ============================================
  function startHeroAnimations() {
    const heroTl = gsap.timeline();

    // Clouds float in
    heroTl.to('.cloud-1', { left: '10%', duration: 2, ease: 'power2.out' }, 0)
      .to('.cloud-2', { left: '60%', duration: 2.5, ease: 'power2.out' }, 0.2)
      .to('.cloud-3', { right: '5%', duration: 2, ease: 'power2.out' }, 0.3)
      .to('.cloud-4', { right: '30%', duration: 2.2, ease: 'power2.out' }, 0.4)
      .to('.cloud-5', { opacity: 0.9, duration: 1.5, ease: 'power2.out' }, 0.6);

    // Title animation
    heroTl.to('.title-the', {
      opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)'
    }, 0.8)
    .to('.title-simpsons', {
      opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)'
    }, 1)
    .to('.title-fan', {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
    }, 1.3)
    .to('.hero-subtitle', {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
    }, 1.5)
    .to('.hero-btn', {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
    }, 1.7);

    // Set initial states
    gsap.set('.title-the', { y: -30 });
    gsap.set('.title-simpsons', { scale: 0.5 });
    gsap.set('.title-fan', { y: 30 });
    gsap.set('.hero-subtitle', { y: 20 });
    gsap.set('.hero-btn', { y: 20 });

    // Buildings rise up
    gsap.from('.building', {
      height: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.5,
      onStart: () => {
        document.querySelectorAll('.building').forEach(b => b.style.opacity = '1');
      }
    });

    gsap.to('.cooling-tower', {
      opacity: 1,
      duration: 1,
      delay: 1.5,
      ease: 'power2.out'
    });

    // Continuous cloud drift
    gsap.to('.cloud-1', { x: 30, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-2', { x: -25, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-3', { x: 20, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-4', { x: -30, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.cloud-5', { x: 15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Hero parallax on scroll
    gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: -100,
      opacity: 0
    });

    gsap.to('.springfield-skyline', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 50
    });
  }

  // ============================================
  // CHARACTER CAROUSEL
  // ============================================
  const track = document.querySelector('.character-track');
  const cards = document.querySelectorAll('.character-card');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentSlide = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  }

  function getTotalSlides() {
    return Math.max(1, cards.length - cardsPerView + 1);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    const total = getTotalSlides();
    currentSlide = Math.max(0, Math.min(index, total - 1));
    const cardWidth = cards[0].offsetWidth + 30; // width + gap
    gsap.to(track, {
      x: -currentSlide * cardWidth,
      duration: 0.5,
      ease: 'power2.out'
    });
    updateDots();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  createDots();

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    createDots();
    goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
  });

  // Scroll triggered entrance for characters section
  gsap.fromTo('.character-card',
    { y: 60, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '#characters',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }
  );

  // Touch/swipe support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  // ============================================
  // LOCATIONS - SCROLL ANIMATIONS
  // ============================================
  gsap.fromTo('.location-card',
    { y: 80, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '#world',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    }
  );

  // Hover tilt effect on location cards
  document.querySelectorAll('.location-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // ============================================
  // EPISODES TIMELINE - SCROLL ANIMATIONS
  // ============================================
  document.querySelectorAll('.episode-item').forEach((item, i) => {
    const direction = item.classList.contains('left') ? -80 : 80;

    gsap.fromTo(item,
      { x: direction, opacity: 0 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: i * 0.1
      }
    );
  });

  // Animate timeline line
  gsap.from('.timeline-line', {
    scrollTrigger: {
      trigger: '.episodes-timeline',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true
    },
    scaleY: 0,
    transformOrigin: 'top center'
  });

  // ============================================
  // GAMES - ANIMATIONS
  // ============================================
  gsap.fromTo('.game-card.featured',
    { y: 60, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '#games',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }
  );

  gsap.fromTo('.game-card.mini',
    { y: 50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.games-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }
  );

  // Animate rating bar
  gsap.from('.rating-fill', {
    scrollTrigger: {
      trigger: '.game-rating-bar',
      start: 'top 90%'
    },
    width: 0,
    duration: 1.5,
    ease: 'power2.out'
  });

  // ============================================
  // QUOTES CAROUSEL
  // ============================================
  const quoteCards = document.querySelectorAll('.quote-card');
  let currentQuote = 0;
  let quoteInterval;

  function showQuote(index) {
    quoteCards.forEach(card => card.classList.remove('active'));
    currentQuote = ((index % quoteCards.length) + quoteCards.length) % quoteCards.length;
    quoteCards[currentQuote].classList.add('active');
  }

  function startQuoteAutoplay() {
    quoteInterval = setInterval(() => showQuote(currentQuote + 1), 5000);
  }

  function resetQuoteAutoplay() {
    clearInterval(quoteInterval);
    startQuoteAutoplay();
  }

  document.getElementById('next-quote').addEventListener('click', () => {
    showQuote(currentQuote + 1);
    resetQuoteAutoplay();
  });

  document.getElementById('prev-quote').addEventListener('click', () => {
    showQuote(currentQuote - 1);
    resetQuoteAutoplay();
  });

  startQuoteAutoplay();

  // ============================================
  // TRIVIA - SCROLL ANIMATIONS
  // ============================================
  gsap.fromTo('.trivia-card',
    { y: 60, opacity: 0, rotation: 5 },
    {
      scrollTrigger: {
        trigger: '#trivia',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 0,
      opacity: 1,
      rotation: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    }
  );

  // Counter animation for trivia numbers
  document.querySelectorAll('.trivia-number').forEach(num => {
    const target = parseInt(num.textContent);
    gsap.from(num, {
      scrollTrigger: {
        trigger: num,
        start: 'top 90%'
      },
      textContent: 0,
      duration: 1.5,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        num.textContent = String(Math.round(this.targets()[0]._gsap.textContent || 0)).padStart(2, '0');
      }
    });
  });

  // ============================================
  // COUCH GAG ANIMATION
  // ============================================
  const couchBtn = document.getElementById('couch-btn');
  let couchPlaying = false;

  couchBtn.addEventListener('click', () => {
    if (couchPlaying) return;
    couchPlaying = true;
    couchBtn.style.display = 'none';

    const runners = document.querySelectorAll('.runner');
    const couchCenter = document.querySelector('.the-couch').offsetLeft;
    const sceneWidth = document.querySelector('.couch-scene').offsetWidth;

    const tl = gsap.timeline({
      onComplete: () => {
        couchPlaying = false;
        // Reset after a pause
        gsap.delayedCall(2, () => {
          gsap.to(runners, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              runners.forEach(r => {
                gsap.set(r, { left: -80, opacity: 0, y: 0, scale: 1 });
              });
              couchBtn.style.display = 'block';
            }
          });
        });
      }
    });

    // Each family member runs in from the left to the couch
    const couchX = sceneWidth / 2;
    const offsets = [-50, -25, 0, 25, 45];

    runners.forEach((runner, i) => {
      tl.to(runner, {
        opacity: 1,
        left: couchX + offsets[i] - 80,
        duration: 0.6,
        ease: 'power2.out'
      }, i * 0.15);
    });

    // Bounce when they sit down
    tl.to(runners, {
      y: -20,
      duration: 0.2,
      ease: 'power2.out'
    }, '+=0.1')
    .to(runners, {
      y: 0,
      duration: 0.3,
      ease: 'bounce.out'
    });

    // Couch squash
    tl.to('.the-couch', {
      scaleY: 0.9,
      scaleX: 1.05,
      duration: 0.15,
      ease: 'power2.in'
    }, '-=0.5')
    .to('.the-couch', {
      scaleY: 1,
      scaleX: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)'
    });

    // Random couch gag effect
    const gags = ['spin', 'shrink', 'fly', 'bounce'];
    const randomGag = gags[Math.floor(Math.random() * gags.length)];

    switch (randomGag) {
      case 'spin':
        tl.to(runners, {
          rotation: 360,
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.05
        }, '+=0.5');
        break;
      case 'shrink':
        tl.to(runners, {
          scale: 0.3,
          duration: 0.5,
          ease: 'power2.in',
          stagger: 0.05
        }, '+=0.5')
        .to(runners, {
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
          stagger: 0.05
        });
        break;
      case 'fly':
        tl.to(runners, {
          y: -100,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08
        }, '+=0.5')
        .to(runners, {
          y: 0,
          duration: 0.6,
          ease: 'bounce.out',
          stagger: 0.08
        });
        break;
      case 'bounce':
        runners.forEach((runner, i) => {
          tl.to(runner, {
            y: -60 - (i * 15),
            duration: 0.3,
            ease: 'power2.out'
          }, '+=0.1')
          .to(runner, {
            y: 0,
            duration: 0.4,
            ease: 'bounce.out'
          });
        });
        break;
    }
  });

  // ============================================
  // SECTION HEADERS - SCROLL ANIMATIONS
  // ============================================
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.fromTo(header.querySelector('.section-title'),
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }
    );

    gsap.fromTo(header.querySelector('.section-subtitle'),
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      }
    );
  });

  // ============================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // EASTER EGG - KONAMI CODE
  // ============================================
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        activateEasterEgg();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    // D'oh! rain
    for (let i = 0; i < 30; i++) {
      const doh = document.createElement('div');
      doh.textContent = "D'oh!";
      doh.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * 100}vw;
        font-family: 'Bangers', cursive;
        font-size: ${1 + Math.random() * 2}rem;
        color: ${['#FED41D', '#F39C12', '#E74C3C', '#2980B9', '#FF69B4'][Math.floor(Math.random() * 5)]};
        z-index: 99999;
        pointer-events: none;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
      `;
      document.body.appendChild(doh);

      gsap.to(doh, {
        y: window.innerHeight + 100,
        rotation: Math.random() * 720 - 360,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
        ease: 'power1.in',
        onComplete: () => doh.remove()
      });
    }
  }

  // ============================================
  // CURSOR TRAIL (Desktop only)
  // ============================================
  if (window.innerWidth > 768) {
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrailTime < 80) return;
      lastTrailTime = now;

      const trail = document.createElement('div');
      trail.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--simpsons-yellow);
        pointer-events: none;
        z-index: 99998;
        opacity: 0.7;
      `;
      document.body.appendChild(trail);

      gsap.to(trail, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => trail.remove()
      });
    });
  }

});
