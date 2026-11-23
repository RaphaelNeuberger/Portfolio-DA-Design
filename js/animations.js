/**
 * Fade-in animations, to-top button and small page helpers.
 */
document.documentElement.classList.remove("no-js");

document.addEventListener("DOMContentLoaded", function () {
  initToTop();
  initFadeIn();
});

window.addEventListener("footerLoaded", setFooterYear);

/**
 * Shows the to-top button after scrolling and scrolls up on click.
 */
function initToTop() {
  const toTop = document.querySelector(".to-top-arrow");
  if (!toTop) return;
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const update = function () {
    toTop.classList.toggle("visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/**
 * Adds the class "visible" to .fade-in elements once they enter the viewport.
 */
function initFadeIn() {
  const els = document.querySelectorAll(".fade-in, .project-grid .project-card");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => observer.observe(el));
}

/**
 * Keeps the copyright year in the footer current.
 */
function setFooterYear() {
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
