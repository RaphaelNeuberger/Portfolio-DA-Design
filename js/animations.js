// To-Top-Arrow visibility & fade-in animations for sections

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Initializes the visibility of the To-Top arrow and fade-in animations for sections.
   * Runs after DOMContentLoaded.
   */
  // To-Top-Arrow
  const toTop = document.querySelector(".to-top-arrow");
  /**
   * Shows or hides the To-Top arrow depending on the scroll position.
   * @function toggleToTop
   */
  function toggleToTop() {
    if (window.scrollY > window.innerHeight * 0.5) {
      toTop.classList.add("visible");
    } else {
      toTop.classList.remove("visible");
    }
  }
  window.addEventListener("scroll", toggleToTop);
  toggleToTop();

  // Scroll to header when to-top-arrow is clicked
  toTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Fade-in animations for sections
  /**
   * IntersectionObserver for fade-in animations of sections.
   * Adds the 'visible' class to a section as soon as it appears in the viewport.
   */
  const fadeEls = document.querySelectorAll(".fade-in");
  const observer = new window.IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  fadeEls.forEach((el) => observer.observe(el));
});
