/**
 * AZ Studio Dashboard - Vanilla JS Interactive Handlers
 * Handles: Password Toggle, OTP Auto-Jump & Paste, Form Navigation
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Password Visibility Toggle (All screens)
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Locate the input inside the parent field container
      const container = btn.closest(".container");
      const input =
        container?.querySelector(".password-input") || container?.querySelector("input");

      if (input) {
        const isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");
        btn.setAttribute("aria-label", isPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
      }
    });
  });

  // 2. Hide dummy dots preview when user types in password
  document.querySelectorAll(".password-input").forEach((input) => {
    const parentContainer = input.closest(".container");
    const dotsPreview = parentContainer?.querySelector(".frame-2085664965 > .el-");

    if (dotsPreview) {
      input.addEventListener("input", () => {
        if (input.value.length > 0) {
          dotsPreview.style.visibility = "hidden";
        } else {
          dotsPreview.style.visibility = "visible";
        }
      });
    }
  });

  // 3. OTP Auto-Focus, Jump & Paste Handlers
  const otpBoxes = document.querySelectorAll(".otp-box");
  if (otpBoxes.length > 0) {
    otpBoxes.forEach((box, index) => {
      box.addEventListener("input", (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = val;

        if (val.length === 1 && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && index > 0) {
          otpBoxes[index - 1].focus();
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/[^0-9]/g, "");
        if (pastedData.length >= otpBoxes.length) {
          for (let i = 0; i < otpBoxes.length; i++) {
            otpBoxes[i].value = pastedData[i];
          }
          otpBoxes[otpBoxes.length - 1].focus();
        }
      });
    });
  }

  // 4. Form Submissions Navigation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (_e) => {
      // Allow standard form action navigation to enter-email.html or next step
    });
  }

  const enterEmailForm = document.getElementById("enterEmailForm");
  if (enterEmailForm) {
    enterEmailForm.addEventListener("submit", (_e) => {
      // Standard action will take user to otp.html
    });
  }

  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", (_e) => {
      // Standard action will take user to new-password.html
    });
  }

  const newPasswordForm = document.getElementById("newPasswordForm");
  if (newPasswordForm) {
    newPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("تم تعيين كلمة المرور بنجاح!");
      window.location.href = "login.html";
    });
  }
});
