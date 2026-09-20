/* =========================================================
   MastiOfficial — Site Configuration & Core Scripts
   Pure vanilla JavaScript. No dependencies.
   ========================================================= */

/* =====================
   Central Site Configuration
   Edit the values below to update the whole website.
   ===================== */
const SITE_CONFIG = {
  // WhatsApp number in international format WITHOUT +, spaces or dashes.
  // Example: "919876543210" for an Indian number +91 98765 43210
  whatsappNumber: "918787614703",

  // External / internal registration links.
  hostRegistrationUrl: "#",
  agencyRegistrationUrl: "https://masti.chat/web/#/recruit/sub_agency_reg/5922/MR",
  appUrl: "#",

  // Pre-filled WhatsApp message templates.
  messages: {
    host: "Hello, I want help joining as a Masti Host. My Masti ID is:",
    agency: "Hello, I want help with my Masti Agency. My Agency ID is:",
    general: "Hello, I need help with Masti."
  }
};

/* =====================
   WhatsApp helpers
   ===================== */
function buildWhatsAppLink(messageKey) {
  const message = SITE_CONFIG.messages[messageKey] || SITE_CONFIG.messages.general;
  const encoded = encodeURIComponent(message);
  const number = SITE_CONFIG.whatsappNumber ? SITE_CONFIG.whatsappNumber.replace(/[^\d]/g, "") : "";
  return "https://wa.me/" + number + "?text=" + encoded;
}

function applyDataActions() {
  const nodes = document.querySelectorAll("[data-action]");
  nodes.forEach(function (node) {
    const action = node.getAttribute("data-action");

    if (action === "whatsapp" || action === "whatsapp-host" || action === "whatsapp-agency") {
      const key = action === "whatsapp-host" ? "host" : action === "whatsapp-agency" ? "agency" : "general";
      node.setAttribute("href", buildWhatsAppLink(key));
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }

    if (action === "host-registration") {
      node.setAttribute("href", SITE_CONFIG.hostRegistrationUrl);
    }

    if (action === "agency-registration") {
      node.setAttribute("href", SITE_CONFIG.agencyRegistrationUrl);
    }

    if (action === "app-url") {
      node.setAttribute("href", SITE_CONFIG.appUrl);
    }
  });
}

/* =====================
   Mobile Menu
   ===================== */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* =====================
   FAQ Accordion
   ===================== */
function initFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  questions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answer = document.getElementById(btn.getAttribute("aria-controls"));

      btn.setAttribute("aria-expanded", String(!expanded));

      if (!expanded) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
}

/* =====================
   Scroll fade-in
   ===================== */
function initFadeInOnScroll() {
  const items = document.querySelectorAll(".fade-in-up");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
}

/* =====================
   Active nav link
   ===================== */
function markActiveNav() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".main-nav a, .mobile-menu a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    if (href === path || (href !== "/" && path.indexOf(href) === 0)) {
      link.classList.add("active");
    }
  });
}

/* =====================
   Init
   ===================== */
document.addEventListener("DOMContentLoaded", function () {
  applyDataActions();
  initMobileMenu();
  initFaqAccordion();
  initFadeInOnScroll();
  markActiveNav();
});
