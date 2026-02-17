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
  const logoImg = document.querySelector(".logo img");

  function setLogoBlue() {
    if (logoImg) logoImg.src = "assets/img/logo_blue.svg";
  }

  function restoreLogo() {
    if (!logoImg) return;
    const header = document.getElementById("header");
    if (header && header.classList.contains("scrolled")) {
      logoImg.src = "assets/img/logo_blue.svg";
    } else {
      logoImg.src = "assets/img/logo.svg";
    }
  }

  function toggleMenu() {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    const isOpen = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      setLogoBlue();
      trapFocus(mobileMenu);
    } else {
      restoreLogo();
      releaseFocusTrap();
    }
  }

  /**
   * Closes the mobile menu
   */
  function closeMenu() {
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    restoreLogo();
    releaseFocusTrap();
  }

  // Focus trap for mobile menu
  let focusTrapHandler = null;

  function trapFocus(container) {
    const focusableEls = container.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    firstEl.focus();

    focusTrapHandler = function (e) {
      if (e.key === "Escape") {
        closeMenu();
        hamburger.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", focusTrapHandler);
  }

  function releaseFocusTrap() {
    if (focusTrapHandler) {
      document.removeEventListener("keydown", focusTrapHandler);
      focusTrapHandler = null;
    }
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
    ".mobile-lang-toggle button",
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
