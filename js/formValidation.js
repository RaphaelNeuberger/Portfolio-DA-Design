/**
 * Contact form: validation on blur, submit button state, sending and feedback.
 */

const EMAIL_PATTERN = /^[^\s@]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const SUCCESS_VISIBLE_MS = 4000;
const ERROR_VISIBLE_MS = 6000;

const FIELD_RULES = {
  name: { isValid: (v) => v.length >= 2, errorKey: "contact.form.error.name" },
  email: { isValid: (v) => EMAIL_PATTERN.test(v), errorKey: "contact.form.error.email" },
  message: { isValid: (v) => v.length >= 5, errorKey: "contact.form.error.message" },
};

const contactForm = { form: null, touched: { name: false, email: false, message: false } };


/**
 * Returns the translated text for a key in the current page language.
 * @param {string} key
 * @returns {string}
 */
function getTranslation(key) {
  const lang = document.documentElement.lang === "de" ? "de" : "en";
  const dict = window.translations && window.translations[lang];
  return (dict && dict[key]) || key;
}


/**
 * Returns a form field by its name.
 * @param {string} name
 * @returns {HTMLInputElement|HTMLTextAreaElement}
 */
function getField(name) {
  return contactForm.form.elements[name];
}


/**
 * Checks a single field against its rule (whitespace is trimmed first).
 * @param {string} name - field name (name, email, message)
 * @returns {boolean}
 */
function isFieldValid(name) {
  return FIELD_RULES[name].isValid(getField(name).value.trim());
}


/**
 * Shows or clears the error text below a field once it has been touched.
 * @param {string} name - field name
 */
function validateField(name) {
  if (!contactForm.touched[name]) return;
  const valid = isFieldValid(name);
  getField(name).setAttribute("aria-invalid", String(!valid));
  const feedback = document.getElementById("feedback-" + name);
  if (feedback) feedback.textContent = valid ? "" : getTranslation(FIELD_RULES[name].errorKey);
}


/**
 * Enables the submit button only when all fields and the privacy checkbox are valid.
 * @returns {boolean} whether the form is valid
 */
function updateSubmitState() {
  const valid = Object.keys(FIELD_RULES).every(isFieldValid) && getField("privacy").checked;
  const submitBtn = contactForm.form.querySelector('button[type="submit"]');
  submitBtn.disabled = !valid;
  submitBtn.classList.toggle("active", valid);
  return valid;
}


/**
 * Validates a field when it is left and keeps validating it while typing afterwards.
 * @param {string} name - field name
 */
function bindField(name) {
  getField(name).addEventListener("blur", () => {
    contactForm.touched[name] = true;
    validateField(name);
    updateSubmitState();
  });
  getField(name).addEventListener("input", () => {
    validateField(name);
    updateSubmitState();
  });
}


/**
 * Collects the trimmed form values including the honeypot field.
 * @returns {{name: string, email: string, message: string, website: string}}
 */
function getFormData() {
  return {
    name: getField("name").value.trim(),
    email: getField("email").value.trim().toLowerCase(),
    message: getField("message").value.trim(),
    website: getField("website") ? getField("website").value : "",
  };
}


/**
 * Shows a success or error message below the form for a few seconds.
 * @param {boolean} isError
 */
function showFormMessage(isError) {
  let msg = contactForm.form.querySelector(".form-success-message");
  if (!msg) {
    msg = document.createElement("div");
    msg.className = "form-success-message";
    contactForm.form.appendChild(msg);
  }
  msg.textContent = getTranslation(isError ? "contact.form.error" : "contact.form.success");
  msg.classList.toggle("is-error", isError);
  msg.setAttribute("role", isError ? "alert" : "status");
  msg.classList.add("visible");
  setTimeout(() => msg.classList.remove("visible"), isError ? ERROR_VISIBLE_MS : SUCCESS_VISIBLE_MS);
}


/**
 * Resets the form, the touched state and all error texts.
 */
function resetContactForm() {
  contactForm.form.reset();
  Object.keys(contactForm.touched).forEach((name) => (contactForm.touched[name] = false));
  contactForm.form.querySelectorAll(".input-feedback").forEach((el) => (el.textContent = ""));
  contactForm.form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
}


/**
 * Evaluates the server response and shows the matching feedback.
 * @param {Response} response
 * @returns {Promise<void>}
 */
async function handleResponse(response) {
  const json = await response.json();
  if (response.ok && json.success) {
    resetContactForm();
    showFormMessage(false);
  } else {
    showFormMessage(true);
  }
}


/**
 * Sends the form data to the mailer and restores the button afterwards.
 * @param {Object} data - form values
 */
function sendForm(data) {
  fetch("phpMailer.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .catch(() => showFormMessage(true))
    .finally(resetSubmitButton);
}


/**
 * Restores the label of the submit button and its enabled state.
 */
function resetSubmitButton() {
  const submitBtn = contactForm.form.querySelector('button[type="submit"]');
  submitBtn.textContent = getTranslation("contact.form.btn");
  updateSubmitState();
}


/**
 * Validates all fields and sends the form; the button stays disabled while sending.
 * @param {SubmitEvent} e
 */
function handleSubmit(e) {
  e.preventDefault();
  Object.keys(FIELD_RULES).forEach((name) => {
    contactForm.touched[name] = true;
    validateField(name);
  });
  if (!updateSubmitState()) return;
  const submitBtn = contactForm.form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = getTranslation("contact.form.sending");
  sendForm(getFormData());
}


/**
 * Initializes the contact form if it exists on the page.
 */
function initContactForm() {
  contactForm.form = document.querySelector(".contact-form");
  if (!contactForm.form) return;
  Object.keys(FIELD_RULES).forEach(bindField);
  getField("privacy").addEventListener("change", updateSubmitState);
  contactForm.form.addEventListener("submit", handleSubmit);
  updateSubmitState();
}


document.addEventListener("DOMContentLoaded", initContactForm);
