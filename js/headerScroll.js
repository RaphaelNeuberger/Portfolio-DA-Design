/**
 * Header state while scrolling and active navigation link per section.
 */


/**
 * Adds the 'scrolled' class to the header once the page is scrolled.
 * Also runs on load/header include, so deep links (#work) and reloads
 * further down the page get the light header immediately.
 */
function updateHeaderState() {
  const header = document.getElementById("header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 10);
}


/**
 * Marks the navigation links that point to the given section as current.
 * @param {string} id - id of the visible section
 */
function markActiveLink(id) {
  document.querySelectorAll(".nav-links a, .mobile-nav-links a").forEach((link) => {
    if (link.getAttribute("href") === "#" + id) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/**
 * Observes all sections and highlights the link of the section in view.
 */
function initActiveNav() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) markActiveLink(entry.target.id);
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
}


window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("headerLoaded", updateHeaderState);
window.addEventListener("load", updateHeaderState);
window.addEventListener("hashchange", updateHeaderState);
document.addEventListener("DOMContentLoaded", initActiveNav);
