/**
 * script.js - Urban Shade Initiative
 * Interactive JavaScript for enhanced user experience
 * Handles navigation, smooth scrolling, form validation, and accessibility
 */

import { injectSpeedInsights } from "@vercel/speed-insights";

// Inject Speed Insights
injectSpeedInsights();

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initSmoothScrolling();
  initFormValidation();
  initScrollEffects();
  initAccessibility();
  initResourceSearch();
  initAnimatedCounters();
  initBackToTop();
});

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (!navToggle || !siteNav) return;

  // Toggle menu on button click
  navToggle.addEventListener("click", function () {
    const isOpen = siteNav.classList.contains("is-open");

    // Toggle menu visibility
    siteNav.classList.toggle("is-open");

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
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        const headerHeight =
          document.querySelector(".site-header").offsetHeight;
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

    const formData = new FormData(this);
    const errors = validateForm(formData);

    // Clear previous errors
    clearFormErrors();

    if (errors.length === 0) {
      // Form is valid - in a real app, you'd submit to a server
      showFormSuccess();
      this.reset();
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

function showFormSuccess() {
  const form = document.querySelector(".contact-form");
  const successMessage = document.createElement("div");
  successMessage.className = "form-success";
  successMessage.textContent =
    "Thank you for your message! We'll get back to you soon.";
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

  if (!searchInput || !resourceCards.length) return;

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();

    resourceCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const isVisible = query === "" || text.includes(query);
      card.style.display = isVisible ? "block" : "none";
    });
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
  const target = parseFloat(element.textContent.replace(/[^\d.]/g, ""));
  const suffix = element.textContent.replace(/[\d.]/g, "");
  const duration = 2000; // 2 seconds
  const start = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = startValue + (target - startValue) * easeOutQuart;

    element.textContent = Math.floor(currentValue) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
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

/**
 * Utility functions
 */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
