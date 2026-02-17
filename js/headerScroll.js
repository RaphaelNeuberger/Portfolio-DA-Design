/**
 * Scroll header function for the portfolio.
 * Adds the 'scrolled' class to the header when scrolling.
 * Removes the class when back at the top.
 */
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

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
