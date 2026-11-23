// Logo-Switch bei Scrollen
window.addEventListener("headerLoaded", function () {
  const header = document.getElementById("header");
  const logoImg = header?.querySelector(".logo img");
  if (!logoImg) return;

  function updateLogo() {
    if (header.classList.contains("scrolled") || document.body.classList.contains("page-light")) {
      logoImg.src = "assets/img/logo_blue.svg";
    } else {
      logoImg.src = "assets/img/logo.svg";
    }
  }

  window.addEventListener("scroll", updateLogo, { passive: true });
  updateLogo(); // Initial
});
