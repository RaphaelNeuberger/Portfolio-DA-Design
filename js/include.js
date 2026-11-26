/**
 * Loads the shared header and footer into every page.
 */

const INCLUDE_VERSION = "20261126e";


/**
 * Checks whether the current page is a subpage (legal notice, privacy policy).
 * @returns {boolean}
 */
function isSubpage() {
  const path = window.location.pathname;
  return !path.endsWith("index.html") && !path.endsWith("/");
}


/**
 * Points anchor links to the start page and uses the dark logo on subpages.
 * @param {Element} element - container holding the included HTML
 */
function adjustForSubpage(element) {
  element.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.setAttribute("href", "index.html" + link.getAttribute("href"));
  });
  const headerLogo = element.querySelector("#header .logo img");
  if (headerLogo) headerLogo.src = "assets/img/logo-rn-dark.webp";
}


/**
 * Inserts the loaded HTML and announces it with a custom event.
 * @param {Element} element - target element
 * @param {string} html - loaded markup
 * @param {string} eventName - event dispatched on window afterwards
 */
function injectInclude(element, html, eventName) {
  element.innerHTML = html;
  if (isSubpage()) adjustForSubpage(element);
  window.dispatchEvent(new CustomEvent(eventName));
}


/**
 * Loads an HTML file into an element. On failure the page simply stays
 * without the include, so no error is shown in the console.
 * @param {string} selector - CSS selector of the target element
 * @param {string} url - HTML file to load
 * @param {string} eventName - event dispatched after loading
 */
function includeHTML(selector, url, eventName) {
  const element = document.querySelector(selector);
  if (!element) return;
  fetch(url)
    .then((response) => (response.ok ? response.text() : ""))
    .then((html) => html && injectInclude(element, html, eventName))
    .catch(() => {});
}


document.addEventListener("DOMContentLoaded", () => {
  includeHTML("#header-include", `header.html?v=${INCLUDE_VERSION}`, "headerLoaded");
  includeHTML("#footer-include", `footer.html?v=${INCLUDE_VERSION}`, "footerLoaded");
});
