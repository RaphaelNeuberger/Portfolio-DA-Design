/**
 * Adds the 'scrolled' class to the header once the page is scrolled.
 * Also runs on load/header include, so deep links (#work) and reloads
 * further down the page get the light header immediately.
 */
function updateHeaderState() {
  const header = document.getElementById("header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("headerLoaded", updateHeaderState);
window.addEventListener("load", updateHeaderState);
window.addEventListener("hashchange", updateHeaderState);

// Active nav link indicator via IntersectionObserver
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            if (link.getAttribute("href") === "#" + id) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
});
