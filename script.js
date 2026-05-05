/**
 * script.js - Urban Shade Initiative
 * Interactive JavaScript for enhanced user experience
 * Handles navigation, smooth scrolling, form validation, and accessibility
 */

const CONTACT_EMAIL_PARTS = ["dXJiYW5zaGFkZTM3", "QGdtYWlsLmNvbQ=="];

// Utility: Decode obfuscated email
function decodeEmail(encodedEmail) {
  return atob(encodedEmail);
}

// Initialize all functions
function initializeApp() {
  try {
    initNavigation();
    initSmoothScrolling();
    initFormValidation();
    initScrollEffects();
    initAccessibility();
    initResourceSearch();
    initAnimatedCounters();
    initBackToTop();
    initActiveNavigation();
  } catch (e) {
    console.error("Error initializing app:", e);
  }
}

// DOM Content Loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  // DOM is already loaded (can happen with modules)
  initializeApp();
}

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (!navToggle || !siteNav) return;

  // Toggle menu on button click
  navToggle.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent event bubbling
    const isOpen = siteNav.classList.contains("is-open");

    // Toggle menu visibility
    siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");

    // Update aria-expanded
    navToggle.setAttribute("aria-expanded", !isOpen);

    // Update button aria-label
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu",
    );

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden";

    // Close menu when clicking outside
    if (!isOpen) {
      document.addEventListener("click", closeMenuOnOutsideClick);
    } else {
      document.removeEventListener("click", closeMenuOnOutsideClick);
    }
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.style.overflow = "auto";
    document.removeEventListener("click", closeMenuOnOutsideClick);
  }

  function closeMenuOnOutsideClick(e) {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        const siteHeader = document.querySelector(".site-header");
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without triggering scroll
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Initialize contact form validation
 */
function initFormValidation() {
  const contactForm = document.querySelector(".contact-form");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');

    const formData = new FormData(this);
    const errors = validateForm(formData);

    // Clear previous errors
    clearFormErrors();

    if (errors.length === 0) {
      setSubmitState(submitButton, true);
      sendContactEmail(formData);
      showFormSuccess();
      this.reset();
      setTimeout(() => {
        setSubmitState(submitButton, false);
      }, 2000);
    } else {
      // Show errors
      showFormErrors(errors);
    }
  });

  // Real-time validation
  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });
}

function validateForm(formData) {
  const errors = [];

  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const interest = formData.get("interest")?.trim();
  const message = formData.get("message")?.trim();

  if (!name || name.length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long.",
    });
  }

  if (!email || !isValidEmail(email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address.",
    });
  }

  if (!interest) {
    errors.push({
      field: "interest",
      message: "Please select an area of interest.",
    });
  }

  if (!message || message.length < 10) {
    errors.push({
      field: "message",
      message: "Message must be at least 10 characters long.",
    });
  }

  return errors;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = "";

  switch (field.name) {
    case "name":
      if (!value || value.length < 2) {
        isValid = false;
        message = "Name must be at least 2 characters long.";
      }
      break;
    case "email":
      if (!value || !isValidEmail(value)) {
        isValid = false;
        message = "Please enter a valid email address.";
      }
      break;
    case "interest":
      if (!value) {
        isValid = false;
        message = "Please select an area of interest.";
      }
      break;
    case "message":
      if (!value || value.length < 10) {
        isValid = false;
        message = "Message must be at least 10 characters long.";
      }
      break;
  }

  const errorElement = field.parentNode.querySelector(".field-error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = isValid ? "none" : "block";
  }

  field.classList.toggle("error", !isValid);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function clearFormErrors() {
  const errorElements = document.querySelectorAll(".field-error");
  errorElements.forEach((el) => (el.style.display = "none"));

  const inputs = document.querySelectorAll(
    ".contact-form input, .contact-form select, .contact-form textarea",
  );
  inputs.forEach((input) => input.classList.remove("error"));
}

function showFormErrors(errors) {
  errors.forEach((error) => {
    const field = document.querySelector(`[name="${error.field}"]`);
    if (field) {
      let errorElement = field.parentNode.querySelector(".field-error");
      if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "field-error";
        errorElement.style.color = "var(--color-secondary-dark)";
        errorElement.style.fontSize = "0.875rem";
        errorElement.style.marginTop = "0.25rem";
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = error.message;
      errorElement.style.display = "block";
      field.classList.add("error");
    }
  });
}

function setSubmitState(button, isSubmitting) {
  if (!button) return;

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.disabled = isSubmitting;
  button.textContent = isSubmitting
    ? "Opening Email..."
    : button.dataset.originalText;
}

function getContactEmail() {
  return decodeEmail(CONTACT_EMAIL_PARTS.join(""));
}

function sendContactEmail(formData) {
  const recipient = getContactEmail();
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const interest = formData.get("interest")?.trim();
  const message = formData.get("message")?.trim();
  const subject = `Urban Shade Initiative inquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Area of Interest: ${interest}`,
    "",
    "Message:",
    message,
  ].join("\n");

  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function showFormSuccess() {
  const form = document.querySelector(".contact-form");
  const successMessage = document.createElement("div");
  successMessage.className = "form-success";
  successMessage.textContent =
    "Your email app should open with the message ready to send.";
  successMessage.style.cssText = `
    background: var(--color-primary-soft);
    color: var(--color-primary-dark);
    padding: 1rem;
    border-radius: var(--radius-md);
    margin-top: 1rem;
    border: 1px solid var(--color-primary);
  `;

  form.appendChild(successMessage);

  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Observe cards for animation
  const cards = document.querySelectorAll(
    ".feature-card, .impact-card, .resource-card, .action-card, .biblical-card",
  );
  cards.forEach((card) => {
    observer.observe(card);
  });
}

/**
 * Initialize accessibility enhancements
 */
function initAccessibility() {
  // Add focus trap for mobile menu
  const siteNav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (siteNav && navToggle) {
    const focusableElements = siteNav.querySelectorAll("a, button");

    siteNav.addEventListener("keydown", function (e) {
      if (!siteNav.classList.contains("is-open")) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // Skip link functionality
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.focus();
      }
    });
  }
}

/**
 * Initialize resource search functionality
 */
function initResourceSearch() {
  const searchInput = document.querySelector("#resource-search");
  const resourceCards = document.querySelectorAll(".resource-card");
  const emptyState = document.querySelector(".resource-empty-state");

  if (!searchInput || !resourceCards.length) return;

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    let visibleCount = 0;

    resourceCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const isVisible = query === "" || text.includes(query);
      card.style.display = isVisible ? "block" : "none";
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  });
}

/**
 * Initialize animated counters for impact stats
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll(".impact-number");

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const originalText = element.textContent.trim();
  if (/\d\s*[–-]\s*\d/.test(originalText)) return;

  const numberMatch = originalText.match(/\d+(?:\.\d+)?/);
  if (!numberMatch) return;

  const target = parseFloat(numberMatch[0]);
  const prefix = originalText.slice(0, numberMatch.index);
  const suffix = originalText.slice(numberMatch.index + numberMatch[0].length);
  const duration = 2000; // 2 seconds
  const start = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = startValue + (target - startValue) * easeOutQuart;

    element.textContent = prefix + Math.floor(currentValue) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = originalText;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Initialize back-to-top button functionality
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    backToTopBtn.style.opacity = scrollTop > 300 ? "1" : "0";
    backToTopBtn.style.pointerEvents = scrollTop > 300 ? "auto" : "none";
  });

  // Smooth scroll to top
  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav-list > li > a[href^="#"]');
  const sectionLinks = Array.from(navLinks)
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((item) => item.section);

  if (!sectionLinks.length) return;

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${sectionId}`,
      );
    });
  };

  const updateActiveLink = () => {
    const siteHeader = document.querySelector(".site-header");
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const scrollPosition = window.scrollY + headerHeight + 80;
    let activeSectionId = sectionLinks[0].section.id;

    sectionLinks.forEach(({ section }) => {
      if (section.offsetTop <= scrollPosition) {
        activeSectionId = section.id;
      }
    });

    setActiveLink(activeSectionId);
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
}
