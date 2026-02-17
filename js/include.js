// Simple JS include for header and footer
/**
 * Loads external HTML into a specified element and executes a callback when done.
 * @param {string} selector - CSS selector for the target element.
 * @param {string} url - URL of the HTML file to load.
 * @param {function} [callback] - Optional callback function to execute after loading.
 */

function includeHTML(selector, url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = data;
        const isSubpage = !window.location.pathname.endsWith("index.html") &&
          !window.location.pathname.endsWith("/");
        if (isSubpage) {
          element.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.setAttribute("href", "index.html" + link.getAttribute("href"));
          });
          const logoImg = element.querySelector(".logo img");
          if (logoImg) {
            logoImg.src = "assets/img/logo_blue.svg";
          }
        }
        if (callback) callback();
      }
    })
    .catch((error) => {
      console.error("Error loading HTML include:", error);
    });
}

/**
 * Initializes header and footer includes on DOMContentLoaded.
 * Triggers custom events when header and footer are loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#header-include")) {
    includeHTML("#header-include", "header.html", function () {
      // Trigger custom event when header is loaded
      window.dispatchEvent(new CustomEvent("headerLoaded"));
    });
  }
  if (document.querySelector("#footer-include")) {
    includeHTML("#footer-include", "footer.html", function () {
      // Trigger custom event when footer is loaded
      window.dispatchEvent(new CustomEvent("footerLoaded"));
    });
  }
});
