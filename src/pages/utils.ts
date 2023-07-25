export function setLoginSpanFocusStyles() {
  let input = document.getElementById("email-input");
  let passwordInput = document.getElementById("password-input");

  let span = document.getElementById("email");
  let passwordSpan = document.getElementById("password");

  if (passwordInput == null || input == null) {
    return;
  }

  passwordInput.addEventListener("focus", () => {
    if (passwordSpan == null) {
      return;
    }
    passwordSpan.style.border = "2px solid var(--main-color)";
  });

  passwordInput.addEventListener("focusout", () => {
    if (passwordSpan == null) {
      return;
    }
    passwordSpan.style.border = "2px solid var(--login-contrast-border)";
  });

  input.addEventListener("focus", () => {
    if (span == null) {
      return;
    }
    span.style.border = "2px solid var(--main-color)";
  });

  input.addEventListener("focusout", () => {
    if (span == null) {
      return;
    }
    span.style.border = "2px solid var(--login-contrast-border)";
  });
}
