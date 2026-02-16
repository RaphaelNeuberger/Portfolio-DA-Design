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
