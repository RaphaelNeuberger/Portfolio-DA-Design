/**
 * Switches between the light and dark logo depending on the header state.
 */

const LOGO_LIGHT = "assets/img/logo-rn-light.webp";
const LOGO_DARK = "assets/img/logo-rn-dark.webp";


/**
 * Marks the header as scrolled and shows the matching logo.
 */
function updateLogo() {
  const header = document.getElementById("header");
  const logoImg = header?.querySelector(".logo img");
  if (!logoImg) return;
  header.classList.toggle("scrolled", window.scrollY > 10);
  const isDark = header.classList.contains("scrolled") ||
    document.body.classList.contains("page-light");
  logoImg.src = isDark ? LOGO_DARK : LOGO_LIGHT;
}


/**
 * Registers the listeners once the header has been included.
 */
function initLogoSwitch() {
  window.addEventListener("scroll", updateLogo, { passive: true });
  window.addEventListener("load", updateLogo);
  window.addEventListener("hashchange", updateLogo);
  updateLogo();
}


window.addEventListener("headerLoaded", initLogoSwitch);
