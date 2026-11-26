/**
 * Mobile menu (hamburger) with overlay, focus trap and language toggle.
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

let focusTrapHandler = null;


/**
 * Returns the overlay behind the menu and creates it on first use.
 * @returns {HTMLElement}
 */
function getMenuOverlay() {
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }
  return overlay;
}


/**
 * Checks whether the mobile menu is currently open.
 * @returns {boolean}
 */
function isMenuOpen() {
  return document.querySelector(".hamburger")?.classList.contains("active") || false;
}


/**
 * Opens or closes the menu and updates ARIA state and scroll lock.
 * @param {boolean} open
 */
function setMenuOpen(open) {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".mobile-menu");
  hamburger.classList.toggle("active", open);
  menu.classList.toggle("active", open);
  getMenuOverlay().classList.toggle("active", open);
  hamburger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) trapFocus(menu);
  else releaseFocusTrap();
}


/**
 * Closes the menu.
 */
function closeMenu() {
  setMenuOpen(false);
}


/**
 * Keeps the Tab focus inside the menu (wraps at both ends).
 * @param {KeyboardEvent} e
 * @param {HTMLElement} firstEl
 * @param {HTMLElement} lastEl
 */
function wrapTabFocus(e, firstEl, lastEl) {
  const atStart = e.shiftKey && document.activeElement === firstEl;
  const atEnd = !e.shiftKey && document.activeElement === lastEl;
  if (!atStart && !atEnd) return;
  e.preventDefault();
  (atStart ? lastEl : firstEl).focus();
}


/**
 * Handles Escape (close) and Tab (focus trap) inside the open menu.
 * @param {KeyboardEvent} e
 * @param {HTMLElement} firstEl
 * @param {HTMLElement} lastEl
 */
function handleMenuKeydown(e, firstEl, lastEl) {
  if (e.key === "Escape") {
    closeMenu();
    document.querySelector(".hamburger")?.focus();
  } else if (e.key === "Tab") {
    wrapTabFocus(e, firstEl, lastEl);
  }
}


/**
 * Moves the focus into the menu and traps it there.
 * @param {HTMLElement} container - the menu panel
 */
function trapFocus(container) {
  const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
  if (focusable.length === 0) return;
  const firstEl = focusable[0];
  const lastEl = focusable[focusable.length - 1];
  // Focus only after the panel became visible (visibility transition)
  requestAnimationFrame(() => setTimeout(() => firstEl.focus(), 60));
  focusTrapHandler = (e) => handleMenuKeydown(e, firstEl, lastEl);
  document.addEventListener("keydown", focusTrapHandler);
}


/**
 * Removes the focus trap again.
 */
function releaseFocusTrap() {
  if (!focusTrapHandler) return;
  document.removeEventListener("keydown", focusTrapHandler);
  focusTrapHandler = null;
}


/**
 * Lets the language buttons in the mobile menu switch the page language.
 */
function bindMobileLanguageToggle() {
  document.querySelectorAll(".mobile-lang-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.setLanguage) window.setLanguage(btn.textContent.trim().toLowerCase());
    });
  });
}


/**
 * Initializes the mobile menu once the header is loaded.
 */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  if (!hamburger || !document.querySelector(".mobile-menu")) return;
  hamburger.addEventListener("click", () => setMenuOpen(!isMenuOpen()));
  getMenuOverlay().addEventListener("click", closeMenu);
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  bindMobileLanguageToggle();
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && isMenuOpen()) closeMenu();
  });
}


window.addEventListener("headerLoaded", initMobileMenu);
