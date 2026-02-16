// Form validation for contact form (onBlur, button enable, feedback)

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  const privacyInput = form.querySelector('input[name="privacy"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  addFeedbackElements();
  addEventListeners();
  checkForm();

  function addFeedbackElements() {
    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("input-feedback")) {
        const el = document.createElement("div");
        el.className = "input-feedback";
        input.after(el);
      }
    });
  }

  function getFeedbackEl(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("input-feedback")) return next;
    return null;
  }

  function getTranslation(key) {
    const lang = document.documentElement.lang || "en";
    if (!window.translations || !window.translations[lang]) return key;
    return window.translations[lang][key] || key;
  }

  function isNameValid() {
    return nameInput.value.trim().length >= 2;
  }

  function isEmailValid() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailInput.value.trim());
  }

  function isMessageValid() {
    return messageInput.value.trim().length >= 5;
  }

  function validateField(input, isValid, errorKey) {
    const el = getFeedbackEl(input);
    el.textContent = isValid() ? "" : getTranslation(errorKey);
    return isValid();
  }

  function validateName() {
    return validateField(nameInput, isNameValid, "contact.form.error.name");
  }

  function validateEmail() {
    return validateField(emailInput, isEmailValid, "contact.form.error.email");
  }

  function validateMessage() {
    return validateField(messageInput, isMessageValid, "contact.form.error.message");
  }

  function checkForm() {
    const valid =
      isNameValid() && isEmailValid() && isMessageValid() && privacyInput.checked;
    submitBtn.disabled = !valid;
    return valid;
  }

  function addEventListeners() {
    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    messageInput.addEventListener("blur", validateMessage);
    privacyInput.addEventListener("change", checkForm);
    form.addEventListener("input", checkForm);
    form.addEventListener("submit", handleSubmit);
  }

  function getFormData() {
    return {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };
  }

  function showSuccessMessage() {
    let msg = form.querySelector(".form-success-message");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "form-success-message";
      form.appendChild(msg);
    }
    msg.textContent = getTranslation("contact.form.success");
    msg.classList.add("visible");
    setTimeout(function () { msg.classList.remove("visible"); }, 4000);
  }

  function showErrorMessage() {
    let msg = form.querySelector(".form-success-message");
    if (!msg) {
      msg = document.createElement("div");
      msg.className = "form-success-message";
      form.appendChild(msg);
    }
    msg.textContent = getTranslation("contact.form.error");
    msg.style.color = "#ff6b6b";
    msg.classList.add("visible");
    setTimeout(function () {
      msg.classList.remove("visible");
      msg.style.color = "";
    }, 4000);
  }

  function handleSuccess() {
    form.reset();
    clearAllFeedback();
    showSuccessMessage();
  }

  function clearAllFeedback() {
    form.querySelectorAll(".input-feedback").forEach(function (el) {
      el.textContent = "";
    });
  }

  function resetButton() {
    submitBtn.textContent = getTranslation("contact.form.btn");
    submitBtn.disabled = false;
    checkForm();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!checkForm()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = getTranslation("contact.form.sending");
    sendForm(getFormData());
  }

  function sendForm(data) {
    fetch("phpMailer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(parseResponse)
      .then(handleResponse)
      .catch(showErrorMessage)
      .finally(resetButton);
  }

  function parseResponse(response) {
    return response.json().then(function (json) {
      return { ok: response.ok, json: json };
    });
  }

  function handleResponse(result) {
    if (result.ok && result.json.success) {
      handleSuccess();
    } else {
      showErrorMessage();
    }
  }
});
