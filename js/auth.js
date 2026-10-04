/**
 * AZ Studio - Unified Authentication Module
 * Handles Login, Forgot Password, OTP 6-Digit input, Password Reset, and UI states
 */

import { AuthService } from "./services/authService.js";
import { toast } from "./components/ToastManager.js";

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  initPasswordToggles();
  initLoginForm();
  initEnterEmailForm();
  initOtpForm();
  initResetPasswordForm();
});

/**
 * Universal Password Visibility Toggle
 */
function initPasswordToggles() {
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(
      "#toggleLoginPass, #toggleNewPass, #toggleConfirmPass, .btn-toggle-eye, .btn-toggle-password"
    );
    if (!toggleBtn) return;

    e.preventDefault();
    const wrap = toggleBtn.closest(".auth-input-wrap, .form-input-wrap");
    if (!wrap) return;

    const input = wrap.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;

    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";

    const icon = toggleBtn.querySelector("[data-lucide]");
    if (icon) {
      icon.setAttribute("data-lucide", isPass ? "eye-off" : "eye");
      if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons({ root: toggleBtn });
      }
    }
  });
}

/**
 * Screen 1: Login Form
 */
function initLoginForm() {
  const form = document.querySelector("form.auth-form, #loginForm");
  if (!form || !window.location.pathname.endsWith("login.html")) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passInput = form.querySelector('input[type="password"], #loginPassword');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput?.value.trim();
    const password = passInput?.value;

    if (!email || !email.includes("@")) {
      toast.show("يرجى إدخال بريد إلكتروني صحيح", "error");
      emailInput?.focus();
      return;
    }

    if (!password || password.length < 6) {
      toast.show("كلمة المرور يجب أن لا تقل عن 6 أحرف", "error");
      passInput?.focus();
      return;
    }

    // Set Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<span>جاري التحقق...</span> <i data-lucide="loader" class="animate-spin"></i>';
      if (typeof lucide !== "undefined") lucide.createIcons({ root: submitBtn });
    }

    try {
      await AuthService.login(email, password);
      toast.show("تم تسجيل الدخول بنجاح! جاري التوجيه...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } catch (err) {
      toast.show(err.message || "فشل تسجيل الدخول", "error");
      if (submitBtn && submitBtn.dataset.originalHtml) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.originalHtml;
        if (typeof lucide !== "undefined") lucide.createIcons({ root: submitBtn });
      }
    }
  });
}

/**
 * Screen 2: Forgot Password / Enter Email Form
 */
function initEnterEmailForm() {
  const form = document.querySelector("form.auth-form");
  if (!form || !window.location.pathname.endsWith("enter-email.html")) return;

  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();

    if (!email || !email.includes("@")) {
      toast.show("يرجى كتابة بريد إلكتروني صحيح", "error");
      emailInput?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>جاري الإرسال...</span>";
    }

    try {
      await AuthService.requestOtp(email);
      toast.show("تم إرسال رمز التحقق بنجاح!", "success");
      setTimeout(() => {
        window.location.href = "otp.html";
      }, 700);
    } catch (err) {
      toast.show(err.message || "حدث خطأ في الإرسال", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>استمرار</span>";
      }
    }
  });
}

/**
 * Screen 3: OTP 6-Digit Form
 */
function initOtpForm() {
  if (!window.location.pathname.endsWith("otp.html")) return;

  const form = document.querySelector("form.auth-form");
  const otpBoxes = Array.from(document.querySelectorAll(".otp-box"));
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (otpBoxes.length > 0) {
    otpBoxes.forEach((box, index) => {
      box.setAttribute("inputmode", "numeric");
      box.setAttribute("pattern", "[0-9]*");
      box.setAttribute("aria-label", `رقم رمز الأمان ${index + 1}`);

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
        const data = (e.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/[^0-9]/g, "");
        if (data.length > 0) {
          for (let i = 0; i < Math.min(data.length, otpBoxes.length); i++) {
            otpBoxes[i].value = data[i];
          }
          const nextIdx = Math.min(data.length, otpBoxes.length - 1);
          otpBoxes[nextIdx].focus();
        }
      });
    });
  }

  // Resend OTP Countdown & Action
  const resendBtn = document.getElementById("btnResendOtp");
  if (resendBtn) {
    let countdown = 60;
    let timerInterval = null;

    const startTimer = () => {
      countdown = 60;
      resendBtn.style.pointerEvents = "none";
      resendBtn.style.opacity = "0.6";
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timerInterval);
          resendBtn.textContent = "إعادة الإرسال";
          resendBtn.style.pointerEvents = "auto";
          resendBtn.style.opacity = "1";
        } else {
          resendBtn.textContent = `إعادة الإرسال (${countdown} ث)`;
        }
      }, 1000);
    };

    resendBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        toast.show("تمت إعادة إرسال رمز التحقق إلى بريدك الإلكتروني", "info");
        startTimer();
      } catch (err) {
        toast.show(err.message || "فشلت إعادة الإرسال", "error");
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = otpBoxes.map((b) => b.value).join("");

      if (code.length !== 6) {
        toast.show("يرجى إدخال رمز التحقق كاملاً المكون من 6 أرقام", "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>جاري التحقق...</span>";
      }

      try {
        await AuthService.verifyOtp(code);
        toast.show("تم التحقق بنجاح! جاري المتابعة...", "success");
        setTimeout(() => {
          window.location.href = "new-password.html";
        }, 600);
      } catch (err) {
        toast.show(err.message || "رمز التحقق غير صحيح", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "<span>فعل الحساب</span>";
        }
      }
    });
  }
}

/**
 * Screen 4: New / Reset Password Form
 */
function initResetPasswordForm() {
  const isReset =
    window.location.pathname.endsWith("new-password.html") ||
    window.location.pathname.endsWith("reset-password.html");
  if (!isReset) return;

  const form = document.querySelector("form.auth-form, #newPasswordForm");
  if (!form) return;

  const p1Input =
    document.getElementById("newPassInput") || form.querySelectorAll('input[type="password"]')[0];
  const p2Input =
    document.getElementById("confirmPassInput") ||
    form.querySelectorAll('input[type="password"]')[1];
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const p1 = p1Input?.value;
    const p2 = p2Input?.value;

    if (!p1 || p1.length < 6) {
      toast.show("كلمة المرور يجب أن لا تقل عن 6 أحرف", "error");
      p1Input?.focus();
      return;
    }

    if (p1 !== p2) {
      toast.show("كلمتا المرور غير متطابقتين!", "error");
      p2Input?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>جاري الحفظ...</span>";
    }

    try {
      await AuthService.resetPassword(p1, p2);
      toast.show("تم تعيين كلمة المرور الجديدة بنجاح! جاري الانتقال لتسجيل الدخول...", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 900);
    } catch (err) {
      toast.show(err.message || "فشل تعيين كلمة المرور", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>تعيين كلمة مرور جديدة</span>";
      }
    }
  });
}
