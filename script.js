/**
 * ABHIJITH MR PORTFOLIO - Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     0. DARK / LIGHT THEME TOGGLE
     ========================================================= */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('portfolio-theme', targetTheme);
    });
  }

  /* =========================================================
     1. 3D SKILLS CAROUSEL & INTERACTIVE COUNTER
     ========================================================= */
  const skillsStage = document.getElementById('skillsStage');
  const skillsProgress = document.getElementById('skillsProgress');
  const skillsProgressTrack = document.getElementById('skillsProgressTrack');
  const skillsCounterCurrent = document.getElementById('skillsCounterCurrent');
  const skillsCounterTotal = document.getElementById('skillsCounterTotal');
  const skillsActiveName = document.getElementById('skillsActiveName');
  const skillsActiveBadge = document.getElementById('skillsActiveBadge');
  const skillsPercentVal = document.getElementById('skillsPercentVal');
  const skillsPrevBtn = document.getElementById('skillsPrevBtn');
  const skillsNextBtn = document.getElementById('skillsNextBtn');
  const skillsCounterDots = document.getElementById('skillsCounterDots');
  const skillsCounterPanel = document.getElementById('skillsCounterPanel');
  const skillsScrollHint = document.getElementById('skillsScrollHint');
  const skillsAutoStatus = document.getElementById('skillsAutoStatus');
  const techTags = Array.from(document.querySelectorAll('.tech-tag'));

  if (skillsStage) {
    const cards = Array.from(skillsStage.querySelectorAll('.skill-card'));
    const totalCards = cards.length;
    let activeIndex = 0; // Starts at Web Developer
    let currentPercent = 95;
    let percentAnimFrame = null;

    // Set total display
    if (skillsCounterTotal) {
      skillsCounterTotal.textContent = String(totalCards).padStart(2, '0');
    }

    // Build interactive dots
    if (skillsCounterDots) {
      skillsCounterDots.innerHTML = '';
      cards.forEach((card, idx) => {
        const dot = document.createElement('button');
        dot.className = `counter-dot ${idx === activeIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Jump to skill ${idx + 1}: ${card.dataset.title || ''}`);
        dot.addEventListener('click', () => updateCardPositions(idx));
        skillsCounterDots.appendChild(dot);
      });
    }

    // Smooth counter animation for percentage
    const animatePercentage = (targetVal) => {
      if (!skillsPercentVal) return;
      if (percentAnimFrame) cancelAnimationFrame(percentAnimFrame);
      const startVal = currentPercent;
      const startTime = performance.now();
      const duration = 400; // ms

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const val = Math.round(startVal + (targetVal - startVal) * easeProgress);
        skillsPercentVal.textContent = String(val);
        if (progress < 1) {
          percentAnimFrame = requestAnimationFrame(step);
        } else {
          currentPercent = targetVal;
        }
      };
      percentAnimFrame = requestAnimationFrame(step);
    };

    const updateCardPositions = (newIndex) => {
      activeIndex = (newIndex + totalCards) % totalCards;
      const activeCard = cards[activeIndex];

      // Update counter numbers with bump animation
      if (skillsCounterCurrent) {
        skillsCounterCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
        skillsCounterCurrent.classList.remove('bump');
        void skillsCounterCurrent.offsetWidth; // Trigger reflow
        skillsCounterCurrent.classList.add('bump');
      }

      // Update active skill name & focus badge
      if (activeCard) {
        if (skillsActiveName) {
          skillsActiveName.style.opacity = '0';
          skillsActiveName.style.transform = 'translateY(4px)';
          setTimeout(() => {
            skillsActiveName.textContent = activeCard.dataset.title || 'Web Developer';
            skillsActiveName.style.opacity = '1';
            skillsActiveName.style.transform = 'translateY(0)';
          }, 150);
        }

        if (skillsActiveBadge) {
          skillsActiveBadge.textContent = activeCard.dataset.focus || 'CORE DISCIPLINE';
        }

        const targetPercent = parseInt(activeCard.dataset.proficiency || '90', 10);
        animatePercentage(targetPercent);

        // Highlight matching tags in tag cloud
        const activeCategory = activeCard.dataset.category || '';
        techTags.forEach(tag => {
          if (activeCategory && tag.dataset.category === activeCategory) {
            tag.classList.add('highlighted');
          } else {
            tag.classList.remove('highlighted');
          }
        });
      }

      // Update progress bar
      if (skillsProgress) {
        const percentage = ((activeIndex + 1) / totalCards) * 100;
        skillsProgress.style.width = `${percentage}%`;
        if (skillsProgressTrack) {
          skillsProgressTrack.setAttribute('aria-valuenow', activeIndex + 1);
        }
      }

      // Update dots
      if (skillsCounterDots) {
        const dots = skillsCounterDots.querySelectorAll('.counter-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }

      // 3D positioning for N cards
      cards.forEach((card, idx) => {
        card.classList.remove(
          'card-left', 'card-center', 'card-right', 
          'card-hidden', 'card-hidden-left', 'card-hidden-right', 'active'
        );

        const diff = (idx - activeIndex + totalCards) % totalCards;

        if (diff === 0) {
          card.classList.add('card-center', 'active');
        } else if (diff === 1) {
          card.classList.add('card-right');
        } else if (diff === totalCards - 1) {
          card.classList.add('card-left');
        } else if (diff === 2) {
          card.classList.add('card-hidden-right');
        } else if (diff === totalCards - 2) {
          card.classList.add('card-hidden-left');
        } else {
          card.classList.add('card-hidden');
        }
      });
    };

    // Click on cards directly
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        updateCardPositions(idx);
      });
    });

    // Prev / Next button navigation
    if (skillsPrevBtn) {
      skillsPrevBtn.addEventListener('click', () => updateCardPositions(activeIndex - 1));
    }
    if (skillsNextBtn) {
      skillsNextBtn.addEventListener('click', () => updateCardPositions(activeIndex + 1));
    }

    // Up / Down arrow buttons
    const arrowUp = document.getElementById('carouselArrowUp') || document.querySelector('.carousel-arrow-up');
    const arrowDown = document.getElementById('carouselArrowDown') || document.querySelector('.carousel-arrow-down');
    if (arrowUp) arrowUp.addEventListener('click', () => updateCardPositions(activeIndex - 1));
    if (arrowDown) arrowDown.addEventListener('click', () => updateCardPositions(activeIndex + 1));

    // Click to seek on progress bar track
    if (skillsProgressTrack) {
      skillsProgressTrack.addEventListener('click', (e) => {
        const rect = skillsProgressTrack.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const targetIndex = Math.min(totalCards - 1, Math.floor(clickRatio * totalCards));
        updateCardPositions(targetIndex);
      });
    }

    // Keyboard navigation (Arrow keys)
    skillsStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        updateCardPositions(activeIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        updateCardPositions(activeIndex - 1);
      }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    skillsStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    skillsStage.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) updateCardPositions(activeIndex + 1);
          else updateCardPositions(activeIndex - 1);
        } else {
          if (diffY < 0) updateCardPositions(activeIndex + 1);
          else updateCardPositions(activeIndex - 1);
        }
      }
    }, { passive: true });

    // Auto rotate every 4s with status update
    let autoRotate = setInterval(() => {
      updateCardPositions(activeIndex + 1);
    }, 4000);

    const pauseAuto = () => {
      clearInterval(autoRotate);
      if (skillsScrollHint) skillsScrollHint.textContent = 'AUTOPLAY PAUSED';
      if (skillsAutoStatus) {
        const pulse = skillsAutoStatus.querySelector('.pulse-indicator');
        if (pulse) pulse.style.backgroundColor = '#f59e0b';
      }
    };

    const resumeAuto = () => {
      clearInterval(autoRotate);
      if (skillsScrollHint) skillsScrollHint.textContent = 'AUTOPLAY ACTIVE';
      if (skillsAutoStatus) {
        const pulse = skillsAutoStatus.querySelector('.pulse-indicator');
        if (pulse) pulse.style.backgroundColor = '#10b981';
      }
      autoRotate = setInterval(() => updateCardPositions(activeIndex + 1), 4000);
    };

    skillsStage.addEventListener('mouseenter', pauseAuto);
    skillsStage.addEventListener('mouseleave', resumeAuto);
    if (skillsCounterPanel) {
      skillsCounterPanel.addEventListener('mouseenter', pauseAuto);
      skillsCounterPanel.addEventListener('mouseleave', resumeAuto);
    }

    // Initial positioning setup
    updateCardPositions(0);
  }

  /* =========================================================
     2. FEATURED WORKS HORIZONTAL CAROUSEL
     ========================================================= */
  const projectsTrack = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projectPrevBtn');
  const nextBtn = document.getElementById('projectNextBtn');

  if (projectsTrack && prevBtn && nextBtn) {
    const scrollAmount = 370; // card width + gap

    prevBtn.addEventListener('click', () => {
      projectsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      projectsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Touch / Drag support
    let isDown = false;
    let startX, scrollLeft;

    projectsTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - projectsTrack.offsetLeft;
      scrollLeft = projectsTrack.scrollLeft;
    });

    projectsTrack.addEventListener('mouseleave', () => { isDown = false; });
    projectsTrack.addEventListener('mouseup', () => { isDown = false; });

    projectsTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectsTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      projectsTrack.scrollLeft = scrollLeft - walk;
    });
  }

  /* =========================================================
     3. NAVIGATION ACTIVE STATES & SECTION INDICATOR ON SCROLL
     ========================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIndicator = document.getElementById('sectionIndicator');

  const sectionNumbers = {
    'hero': '// 01',
    'skills': '// 02',
    'projects': '// 03',
    'about': '// 04',
    'contact': '// 05'
  };

  const onScroll = () => {
    const scrollY = window.pageYOffset;
    let currentId = 'hero';

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = sectionId;
      }
    });

    // If scrolled to bottom of page, highlight contact
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
      currentId = 'contact';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    if (sectionIndicator && sectionNumbers[currentId]) {
      const targetText = sectionNumbers[currentId];
      if (sectionIndicator.textContent !== targetText) {
        sectionIndicator.textContent = targetText;
        sectionIndicator.classList.add('indicator-bump');
        setTimeout(() => sectionIndicator.classList.remove('indicator-bump'), 220);
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =========================================================
     4. RESUME DOWNLOAD HANDLER
     ========================================================= */
  // Native download allowed via href="Ux_Resume_Abhijith.pdf" download="Abhijith_MR_Resume.pdf"

  /* =========================================================
     5. MOBILE MENU DRAWER TOGGLE
     ========================================================= */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        mobileDrawer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  /* =========================================================
     6. READING SCROLL PROGRESS & BACK TO TOP BUTTON
     ========================================================= */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Scroll progress percentage
    if (scrollProgressBar && scrollHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     7. TOAST NOTIFICATION SYSTEM
     ========================================================= */
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = message;

    toastNotification.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2600);
  };

  /* =========================================================
     8. PROJECT CATEGORY FILTERING
     ========================================================= */
  const projectFilters = document.getElementById('projectFilters');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));

  if (projectFilters && projectCards.length > 0) {
    const filterButtons = Array.from(projectFilters.querySelectorAll('.filter-btn'));

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.dataset.filter || 'all';

        projectCards.forEach(card => {
          const cardCategory = card.dataset.category || '';
          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.classList.remove('filtered-out');
          } else {
            card.classList.add('filtered-out');
          }
        });

        // If a horizontal track exists, reset scroll position smoothly
        if (projectsTrack) {
          projectsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        }
      });
    });
  }

  /* =========================================================
     9. 1-CLICK INTERACTIVE COPY-TO-CLIPBOARD
     ========================================================= */
  const copyCards = document.querySelectorAll('.interactive-copy-card');

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`);
    } catch (err) {
      showToast('Copy failed. Please copy manually.');
    }
    document.body.removeChild(textArea);
  };

  copyCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't intercept if user specifically clicked an inner <a> link
      if (e.target.closest('a')) return;

      const textToCopy = card.dataset.copy;
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  /* =========================================================
     10. QUICK INQUIRY COMPOSER FORM - DIRECT WHATSAPP & EMAIL DISPATCH
     ========================================================= */
  const quickContactForm = document.getElementById('quickContactForm');
  const serviceChips = document.querySelectorAll('.service-chip');
  const sendEmailBtn = document.getElementById('sendEmailBtn');

  // Interactive Service Selector Chips
  if (serviceChips.length > 0) {
    serviceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        serviceChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  const getSelectedService = () => {
    const activeChip = document.querySelector('.service-chip.active');
    return activeChip ? activeChip.dataset.service : 'Full Web App';
  };

  const getInquiryFormData = () => {
    const nameInput = document.getElementById('senderName');
    const contactInput = document.getElementById('senderContact');
    const messageInput = document.getElementById('senderMessage');

    const name = (nameInput?.value || '').trim();
    const contact = (contactInput?.value || '').trim();
    const message = (messageInput?.value || '').trim();
    const service = getSelectedService();

    return { nameInput, contactInput, messageInput, name, contact, message, service };
  };

  // Dispatch to WhatsApp
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, contact, message, service } = getInquiryFormData();

      if (!name || !contact || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      const waText = 
`👋 Hi ABHIJITH MR, I would like to discuss a project!
━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
📱 Contact: ${contact}
⚡ Service: ${service}
💬 Project Details:
${message}
━━━━━━━━━━━━━━━━━━
Sent from abhijithmr.online`;

      const waUrl = `https://wa.me/916235962254?text=${encodeURIComponent(waText)}`;
      showToast('Opening WhatsApp with your project inquiry...');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Fallback Dispatch to Email
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const { name, contact, message, service } = getInquiryFormData();

      if (!name || !contact || !message) {
        showToast('Please fill in Name, Contact & Message first.');
        return;
      }

      const emailSubject = encodeURIComponent(`[Project Inquiry] ${service} - ${name}`);
      const emailBody = encodeURIComponent(
`Hi ABHIJITH MR,

I would like to discuss a project with you:

Name: ${name}
Contact Info: ${contact}
Service: ${service}

Project Details & Timeline:
${message}

Sent from abhijithmr.online`
      );

      const mailtoUrl = `mailto:abhijithmr226@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      showToast('Opening your email client...');
      window.location.href = mailtoUrl;
    });
  }

  /* =========================================================
     11. ANIMATED STAT COUNTERS (ABOUT ME)
     ========================================================= */
  const statCounters = document.querySelectorAll('.stat-counter');

  if (statCounters.length > 0 && 'IntersectionObserver' in window) {
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          observer.disconnect();

          statCounters.forEach(counter => {
            const target = parseInt(counter.dataset.target || '0', 10);
            const isPercent = target === 100;
            const suffix = isPercent ? '%' : '+';
            const duration = 1200; // ms
            const startTime = performance.now();

            const updateCount = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.round(target * easeOut);

              counter.textContent = `${currentVal}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = `${target}${suffix}`;
              }
            };

            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.3 });

    statCounters.forEach(counter => counterObserver.observe(counter));
  }

  /* =========================================================
     12. LIVE KERALA / IST TIME BEACON
     ========================================================= */
  const liveTimeText = document.getElementById('liveTimeText');
  
  const updateKeralaTime = () => {
    if (!liveTimeText) return;
    try {
      const now = new Date();
      // Format to Indian Standard Time (Asia/Kolkata)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      liveTimeText.textContent = `${formatter.format(now)} IST`;
    } catch (e) {
      // Fallback
      const now = new Date();
      liveTimeText.textContent = now.toLocaleTimeString() + ' IST';
    }
  };

  updateKeralaTime();
  setInterval(updateKeralaTime, 1000);

  /* =========================================================
     13. AWWWARDS-GRADE MAGNETIC MORPHING CURSOR
     ========================================================= */
  const cursorDot = document.getElementById('customCursorDot');
  const cursorRing = document.getElementById('customCursorRing');
  const cursorLabel = document.getElementById('cursorLabel');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        isVisible = true;
      }

      // Fast direct positioning for central pinpoint dot
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isVisible = false;
    });

    // Smooth Lerp Physics Loop for trailing outer ring
    const renderCursor = () => {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Event delegation for contextual morphing states
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target) return;

      // Project card / thumb hover: VIEW label
      const projectCard = target.closest('.project-card');
      const copyCard = target.closest('.interactive-copy-card');
      const isClickable = target.closest('a, button, input, textarea, .filter-btn, .counter-dot');

      if (projectCard) {
        cursorRing.classList.add('has-label');
        cursorRing.classList.remove('active');
        if (cursorLabel) cursorLabel.textContent = 'VIEW ↗';
      } else if (copyCard) {
        cursorRing.classList.add('has-label');
        cursorRing.classList.remove('active');
        if (cursorLabel) cursorLabel.textContent = 'COPY';
      } else if (isClickable) {
        cursorRing.classList.add('active');
        cursorRing.classList.remove('has-label');
      } else {
        cursorRing.classList.remove('active', 'has-label');
      }
    });
  }

  /* =========================================================
     14. 3D PERSPECTIVE CARD TILT WITH SPECULAR GLARE
     ========================================================= */
  const tiltCards = document.querySelectorAll('.project-card');

  tiltCards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        // Specular glare coords
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);

        ticking = false;
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 400);
    });
  });

  /* =========================================================
     15. INTERACTIVE CYBER TERMINAL CONSOLE
     ========================================================= */
  const terminalModal = document.getElementById('terminalModal');
  const terminalToggleBtn = document.getElementById('terminalToggleBtn');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const termCloseDot = document.getElementById('termCloseDot');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');

  const commandHistory = [];
  let historyIndex = -1;

  const openTerminal = () => {
    if (!terminalModal) return;
    terminalModal.classList.add('active');
    terminalModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (terminalInput) terminalInput.focus();
    }, 150);
  };

  const closeTerminal = () => {
    if (!terminalModal) return;
    terminalModal.classList.remove('active');
    terminalModal.setAttribute('aria-hidden', 'true');
  };

  if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', openTerminal);
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminal);
  if (termCloseDot) termCloseDot.addEventListener('click', closeTerminal);

  if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
      if (e.target === terminalModal) closeTerminal();
    });
  }

  // Keyboard shortcut Ctrl + ` or Escape
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === '`') || e.key === 'F2') {
      e.preventDefault();
      if (terminalModal?.classList.contains('active')) closeTerminal();
      else openTerminal();
    } else if (e.key === 'Escape') {
      if (terminalModal && terminalModal.classList.contains('active')) closeTerminal();
      if (projectQuickModal && projectQuickModal.classList.contains('active')) closeProjectModal();
    }
  });

  // Terminal commands interpreter
  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    const lineEcho = document.createElement('div');
    lineEcho.className = 'term-line term-cmd-echo';
    lineEcho.textContent = `guest@abhijith:~$ ${rawCmd}`;
    terminalOutput.appendChild(lineEcho);

    if (!cmd) return;

    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    const response = document.createElement('div');
    response.className = 'term-line';

    switch (cmd) {
      case 'help':
        response.innerHTML = `
          <div class="term-highlight">// AVAILABLE COMMANDS:</div>
          <div>• <span class="font-cyan">whoami</span>    - Learn about ABHIJITH MR & credentials</div>
          <div>• <span class="font-cyan">skills</span>    - List core disciplines & proficiency</div>
          <div>• <span class="font-cyan">projects</span>  - Show highlighted production projects</div>
          <div>• <span class="font-cyan">contact</span>   - Get direct email, phone, and WhatsApp</div>
          <div>• <span class="font-cyan">time</span>      - Current Kerala (IST) & UTC clock</div>
          <div>• <span class="font-cyan">matrix</span>    - Run cyber digital rain sequence</div>
          <div>• <span class="font-cyan">theme</span>     - Toggle Dark / Light visual mode</div>
          <div>• <span class="font-cyan">clear</span>     - Clear terminal buffer</div>
          <div>• <span class="font-cyan">exit</span>      - Close this terminal window</div>
        `;
        break;

      case 'whoami':
        response.innerHTML = `
          <div class="term-highlight">ABHIJITH MR</div>
          <div>Front-End Architect &amp; Creative Web Developer</div>
          <div>Stack: Vue.js 3, Nuxt.js, Webflow, WebRTC, Vanilla JS/CSS, GSAP</div>
          <div>Education: B.Sc. Computer Science with Cyber Security (Rathinam College, 2023–2026)</div>
          <div>Focus: High-performance web apps, real-time communication systems, and Awwwards-grade UI/UX.</div>
          <div>Location: Kerala, India (Open to Remote Worldwide)</div>
        `;
        break;

      case 'skills':
        response.innerHTML = `
          <div class="term-highlight">// CORE DISCIPLINES &amp; CREATIVE STACK:</div>
          <div>• Creative Frameworks: <span class="term-success">94%</span> [Vue.js 3, Nuxt.js, Webflow CMS, GSAP]</div>
          <div>• Web Development: <span class="term-success">95%</span> [HTML5, CSS3, ES6+, Web APIs, Lenis]</div>
          <div>• UI/UX Systems: <span class="term-success">92%</span> [Figma, Responsive Design, Design Tokens]</div>
          <div>• Real-Time Systems: <span class="term-success">94%</span> [WebRTC, Socket.IO, P2P Mesh]</div>
          <div>• Cyber Security: <span class="term-success">88%</span> [OWASP, Code Auditing, Hardening]</div>
          <div>• Front-End Architecture: <span class="term-success">93%</span> [Performance, SEO, Mobile-First]</div>
        `;
        break;

      case 'projects':
        response.innerHTML = `
          <div class="term-highlight">// PRODUCTION BUILDS:</div>
          <div>1. <span class="font-cyan">Omeagle</span> - WebRTC Video & Chat (https://omeagle.online)</div>
          <div>2. <span class="font-cyan">Krynn Tools</span> - Developer Productivity Suite (https://krynntools.online)</div>
          <div>3. <span class="font-cyan">HotelsNearMe</span> - Booking Platform (https://hotelsnearmeinkerala.com)</div>
          <div>4. <span class="font-cyan">Hawksbill Security</span> - Security Audit Interface (https://hawksbillsecurity.in)</div>
          <div>5. <span class="font-cyan">The Qoder</span> - Dev Knowledge Hub</div>
        `;
        break;

      case 'contact':
        response.innerHTML = `
          <div class="term-highlight">// DIRECT CHANNELS:</div>
          <div>• Email: <a href="mailto:abhijithmr226@gmail.com" class="font-cyan">abhijithmr226@gmail.com</a></div>
          <div>• Phone / WA: <a href="https://wa.me/916235962254" target="_blank" class="font-cyan">+91 6235962254</a></div>
          <div>• GitHub: <a href="https://github.com/abhijithmr226" target="_blank" class="font-cyan">github.com/abhijithmr226</a></div>
          <div>• LinkedIn: <a href="https://linkedin.com/in/abhijithmr226" target="_blank" class="font-cyan">linkedin.com/in/abhijithmr226</a></div>
        `;
        break;

      case 'time':
        const d = new Date();
        response.innerHTML = `
          <div>Local (IST): <span class="term-success">${d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })} (UTC+5:30)</span></div>
          <div>UTC: ${d.toUTCString()}</div>
        `;
        break;

      case 'theme':
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
        response.innerHTML = `<span class="term-success">Theme changed to ${nextTheme.toUpperCase()} mode.</span>`;
        break;

      case 'matrix':
        response.innerHTML = `<div class="term-success" id="matrixLine">Waking up the digital construct...</div>`;
        let matrixSteps = 0;
        const matrixInterval = setInterval(() => {
          const matrixChars = '01#@$%&*<>~/\\|{}[]';
          let str = '';
          for (let i = 0; i < 38; i++) {
            str += matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
          const ml = document.getElementById('matrixLine');
          if (ml) ml.textContent = str;
          matrixSteps++;
          if (matrixSteps > 15) {
            clearInterval(matrixInterval);
            if (ml) ml.textContent = 'SYSTEM ACCESS GRANTED. Welcome, architect.';
          }
        }, 80);
        break;

      case 'sudo':
        response.innerHTML = `<span class="term-warn">guest is not in the sudoers file. Nice try! You already have full portfolio access.</span>`;
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        return;

      case 'exit':
        closeTerminal();
        return;

      default:
        response.innerHTML = `<span class="term-error">command not found: ${cmd}</span>. Type <span class="term-highlight">'help'</span> for available commands.`;
        break;
    }

    terminalOutput.appendChild(response);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    });

    // History navigation with Arrow keys
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  /* =========================================================
     16. PROJECT QUICK-VIEW LIGHTBOX MODAL
     ========================================================= */
  const projectQuickModal = document.getElementById('projectQuickModal');
  const projectModalClose = document.getElementById('projectModalClose');
  const modalProjectImg = document.getElementById('modalProjectImg');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectCat = document.getElementById('modalProjectCat');
  const modalProjectDesc = document.getElementById('modalProjectDesc');
  const modalProjectStack = document.getElementById('modalProjectStack');
  const modalLiveBtn = document.getElementById('modalLiveBtn');
  const modalGitBtn = document.getElementById('modalGitBtn');

  const openProjectModal = (card) => {
    if (!projectQuickModal || !card) return;

    const title = card.dataset.title || 'Featured Project';
    const cat = card.dataset.cat || 'WEB APPLICATION';
    const desc = card.dataset.desc || '';
    const img = card.dataset.img || '';
    const live = card.dataset.live || '#';
    const github = card.dataset.github || '#';
    const tags = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);

    if (modalProjectTitle) modalProjectTitle.textContent = title;
    if (modalProjectCat) modalProjectCat.textContent = cat;
    if (modalProjectDesc) modalProjectDesc.textContent = desc;

    if (modalProjectImg) {
      modalProjectImg.src = img;
      modalProjectImg.alt = `${title} preview by ABHIJITH MR`;
    }

    if (modalLiveBtn) {
      modalLiveBtn.href = live;
      modalLiveBtn.style.display = live && live !== '#' ? 'inline-flex' : 'none';
    }

    if (modalGitBtn) {
      modalGitBtn.href = github;
      modalGitBtn.style.display = github && github !== '#' ? 'inline-flex' : 'none';
    }

    if (modalProjectStack) {
      modalProjectStack.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        modalProjectStack.appendChild(span);
      });
    }

    projectQuickModal.classList.add('active');
    projectQuickModal.setAttribute('aria-hidden', 'false');
  };

  const closeProjectModal = () => {
    if (!projectQuickModal) return;
    projectQuickModal.classList.remove('active');
    projectQuickModal.setAttribute('aria-hidden', 'true');
  };

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectQuickModal) {
    projectQuickModal.addEventListener('click', (e) => {
      if (e.target === projectQuickModal) closeProjectModal();
    });
  }

  // Bind quickview clicks
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action="quickview"]');
    if (trigger) {
      const card = trigger.closest('.project-card');
      if (card) {
        e.preventDefault();
        openProjectModal(card);
      }
    }
  });

  /* =========================================================
     17. LENIS INERTIA SMOOTH SCROLLING ENGINE
     ========================================================= */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    const lenisRaf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    };
    requestAnimationFrame(lenisRaf);

    // Sync internal navigation anchors to glide smoothly with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -20, duration: 1.2 });
        }
      });
    });
  }

  /* =========================================================
     18. GSAP MAGNETIC BUTTONS ATTRACTION ENGINE
     ========================================================= */
  if (typeof gsap !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    const magneticElements = document.querySelectorAll(
      '.btn-primary, .btn-outline, .btn-terminal, .theme-toggle-btn, .btn-hire'
    );

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        gsap.to(el, {
          x: deltaX * 0.32,
          y: deltaY * 0.32,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1.15, 0.45)',
          overwrite: 'auto'
        });
      });
    });
  }

  /* =========================================================
     19. INTERACTIVE CYBER CANVAS PARTICLE MESH
     ========================================================= */
  const bgCanvas = document.getElementById('bgParticleCanvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mousePos = { x: -9999, y: -9999 };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      bgCanvas.width = width;
      bgCanvas.height = height;
      initParticles();
    };

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 28 : 65;
    const connectDistance = isMobile ? 85 : 120;
    const mouseRadius = 140;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Repel from mouse pointer
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
          this.radius = this.baseRadius * 1.8;
        } else {
          this.radius = this.baseRadius;
        }
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.75)' : 'rgba(0, 71, 255, 0.65)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      mousePos.x = -9999;
      mousePos.y = -9999;
    });

    resizeCanvas();

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * (isDark ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${alpha})`
              : `rgba(0, 71, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      particles.forEach(p => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(animateParticles);
    };

    requestAnimationFrame(animateParticles);
  }

  /* =========================================================
     20. PWA SERVICE WORKER REGISTRATION
     ========================================================= */
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

});

