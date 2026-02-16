/**
 * Mobile menu functionality for hamburger menu
 */

// Wait for header to be loaded
window.addEventListener("headerLoaded", initMobileMenu);

/**
 * Initializes the mobile menu functionality
 */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

  if (!hamburger || !mobileMenu) return;

  // Create overlay
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  /**
   * Toggles the mobile menu open/closed
   */
  function toggleMenu() {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = hamburger.classList.contains("active")
      ? "hidden"
      : "";
  }

  /**
   * Closes the mobile menu
   */
  function closeMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", toggleMenu);

  // Close menu on overlay click
  overlay.addEventListener("click", closeMenu);

  // Close menu when clicking navigation links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Sync language toggle in mobile menu with header
  const mobileLangToggle = document.querySelectorAll(
    ".mobile-lang-toggle span:not(.separator)",
  );
  mobileLangToggle.forEach((span) => {
    span.addEventListener("click", () => {
      const lang = span.textContent.trim().toLowerCase();
      // Trigger language change (handled by translations.js)
      if (window.setLanguage) {
        window.setLanguage(lang);
      }
      // Update active state in mobile menu
      mobileLangToggle.forEach((s) => s.classList.remove("active"));
      span.classList.add("active");
    });
  });

  // Close menu on window resize if open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && hamburger.classList.contains("active")) {
      closeMenu();
    }
  });
}
