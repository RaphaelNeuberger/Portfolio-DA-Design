/**
 * Language switch (de/en) for all pages.
 * The dictionaries live in translationsEn.js and translationsDe.js.
 */

/**
 * Reads a value from localStorage without throwing (private mode, blocked storage).
 * @param {string} key
 * @returns {string|null}
 */
function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

/**
 * Writes a value to localStorage without throwing.
 * @param {string} key
 * @param {string} value
 */
function safeSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    /* storage unavailable – language simply isn't remembered */
  }
}

/**
 * Determines the initial language: saved choice, otherwise browser language.
 * @returns {"de"|"en"}
 */
function detectLanguage() {
  const saved = safeGetItem("lang");
  if (saved === "de" || saved === "en") return saved;
  const browser = (navigator.language || "en").toLowerCase();
  return browser.startsWith("de") ? "de" : "en";
}

let currentLang = detectLanguage();

/**
 * Applies a translation dictionary to all elements of one attribute type.
 * @param {Object.<string,string>} dict
 * @param {string} attr - data attribute holding the key
 * @param {function(Element,string):void} apply
 */
function translateAll(dict, attr, apply) {
  document.querySelectorAll("[" + attr + "]").forEach((el) => {
    const value = dict[el.getAttribute(attr)];
    if (value) apply(el, value);
  });
}

/**
 * Marks the active language button in all toggles.
 * @param {string} lang
 */
function updateToggles(lang) {
  document
    .querySelectorAll(".lang-toggle button, .mobile-lang-toggle button")
    .forEach((btn) => {
      const isActive = btn.textContent.trim().toLowerCase() === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
}

/**
 * Sets the page language and updates all i18n texts.
 * @param {"de"|"en"} lang
 */
function setLanguage(lang) {
  const dict = window.translations[lang];
  if (!dict) return;
  currentLang = lang;
  safeSetItem("lang", lang);
  document.documentElement.lang = lang;
  translateAll(dict, "data-i18n", (el, v) => (el.innerHTML = v));
  translateAll(dict, "data-i18n-html", (el, v) => (el.innerHTML = v));
  translateAll(dict, "data-i18n-placeholder", (el, v) => (el.placeholder = v));
  translateAll(dict, "data-i18n-aria", (el, v) => el.setAttribute("aria-label", v));
  translateAll(dict, "data-i18n-title", (el, v) => (document.title = v));
  updateToggles(lang);
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
}
window.setLanguage = setLanguage;

/**
 * Binds click handlers to the header language toggle (once).
 */
function initLanguageToggle() {
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const lang = btn.textContent.trim().toLowerCase();
      if (lang !== currentLang) setLanguage(lang);
    });
  });
}

window.addEventListener("headerLoaded", () => {
  initLanguageToggle();
  setLanguage(currentLang);
});

window.addEventListener("footerLoaded", () => setLanguage(currentLang));

document.addEventListener("DOMContentLoaded", () => setLanguage(currentLang));
