// Logo-Switch bei Scrollen
window.addEventListener("headerLoaded", function () {
  const header = document.getElementById("header");
  const logoImg = header?.querySelector(".logo img");
  if (!logoImg) return;

  function updateLogo() {
    header.classList.toggle("scrolled", window.scrollY > 10);
    if (header.classList.contains("scrolled") || document.body.classList.contains("page-light")) {
      logoImg.src = "assets/img/logo-rn-dark.webp";
    } else {
      logoImg.src = "assets/img/logo-rn-light.webp";
    }
  }

  window.addEventListener("scroll", updateLogo, { passive: true });
  updateLogo(); // Initial
  window.addEventListener("load", updateLogo);
  window.addEventListener("hashchange", updateLogo);
});
