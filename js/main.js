/**
 * AZ Studio Auth Flow - JavaScript Logic
 * Includes: Form validation, Password toggle, 6-digit OTP handling, Timer countdown, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initEnterEmailForm();
  initOtpForm();
  initResetPasswordForm();
});

/* ==========================================================================
   1. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast-msg ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   2. Password Visibility Toggle
   ========================================================================== */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.btn-toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const img = btn.querySelector('.input-icon-img') || btn.querySelector('img');
      if (img) {
        img.src = isPassword ? './assets/icons/eye-off.svg' : './assets/icons/eye.svg';
        img.alt = isPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور';
      }
    });
  });
}

/* ==========================================================================
   3. Screen 1: Login Form
   ========================================================================== */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate email
    const emailVal = emailInput.value.trim();
    if (!emailVal || !validateEmail(emailVal)) {
      showFieldError(emailInput, emailError, 'يرجى إدخال بريد إلكتروني صحيح');
      isValid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // Validate password
    const passVal = passwordInput.value;
    if (!passVal || passVal.length < 6) {
      showFieldError(passwordInput, passwordError, 'كلمة المرور يجب ألا تقل عن 6 أحرف');
      isValid = false;
    } else {
      clearFieldError(passwordInput, passwordError);
    }

    if (isValid) {
      showToast('تم تسجيل الدخول بنجاح!', 'success');
    }
  });

  [emailInput, passwordInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        clearFieldError(inp, inp.closest('.form-group')?.querySelector('.field-error'));
      });
    }
  });
}

/* ==========================================================================
   4. Screen 2: Enter Email (Forgot Password)
   ========================================================================== */
function initEnterEmailForm() {
  const form = document.getElementById('enterEmailForm');
  if (!form) return;

  const emailInput = document.getElementById('resetEmail');
  const emailError = document.getElementById('emailError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = emailInput.value.trim();

    if (!emailVal || !validateEmail(emailVal)) {
      showFieldError(emailInput, emailError, 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    clearFieldError(emailInput, emailError);
    showToast('تم إرسال كود التحقق إلى بريدك الإلكتروني', 'success');
    
    // Store email for reference in OTP page
    try {
      sessionStorage.setItem('resetEmail', emailVal);
    } catch(err) {}

    setTimeout(() => {
      window.location.href = 'otp.html';
    }, 1000);
  });

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearFieldError(emailInput, emailError);
    });
  }
}

/* ==========================================================================
   5. Screen 3: OTP 6-Digit Verification
   ========================================================================== */
function initOtpForm() {
  const form = document.getElementById('otpForm');
  if (!form) return;

  const otpBoxes = document.querySelectorAll('.otp-box');
  const otpError = document.getElementById('otpError');
  const timerElem = document.getElementById('otpTimer');
  const resendBtn = document.getElementById('btnResend');

  // Autofocus first box
  if (otpBoxes.length > 0) {
    otpBoxes[0].focus();
  }

  // Key navigation & validation for 6 boxes
  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      // Allow only numbers
      if (!/^\d*$/.test(val)) {
        box.value = '';
        return;
      }

      if (val.length > 0) {
        box.value = val.slice(-1); // Only keep 1 digit
        box.classList.add('filled');
        if (index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      } else {
        box.classList.remove('filled');
      }

      if (otpError) otpError.classList.remove('active');
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!box.value && index > 0) {
          otpBoxes[index - 1].focus();
          otpBoxes[index - 1].value = '';
          otpBoxes[index - 1].classList.remove('filled');
        } else {
          box.value = '';
          box.classList.remove('filled');
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        otpBoxes[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    // Handle paste of full 6-digit code
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
      const digits = pasteData.replace(/\D/g, '').slice(0, 6);

      if (digits.length > 0) {
        digits.split('').forEach((digit, i) => {
          if (otpBoxes[i]) {
            otpBoxes[i].value = digit;
            otpBoxes[i].classList.add('filled');
          }
        });
        const nextIndex = Math.min(digits.length, otpBoxes.length - 1);
        otpBoxes[nextIndex].focus();
      }
    });
  });

  // Countdown Timer
  let countdown = 59;
  let timerInterval = null;

  function startTimer() {
    if (resendBtn) resendBtn.disabled = true;
    countdown = 59;
    updateTimerText();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      countdown--;
      updateTimerText();
      if (countdown <= 0) {
        clearInterval(timerInterval);
        if (timerElem) timerElem.textContent = '00:00';
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  function updateTimerText() {
    if (!timerElem) return;
    const sec = countdown < 10 ? `0${countdown}` : countdown;
    timerElem.textContent = `00:${sec}`;
  }

  startTimer();

  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      showToast('تم إعادة إرسال رمز التحقق بنجاح!', 'success');
      startTimer();
    });
  }

  // Submit OTP
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let otpCode = '';
    otpBoxes.forEach(b => otpCode += b.value.trim());

    if (otpCode.length < 6) {
      if (otpError) {
        otpError.textContent = 'يرجى إدخال الرمز المكون من 6 أرقام بالكامل';
        otpError.classList.add('active');
      }
      return;
    }

    showToast('تم التحقق من الرمز بنجاح!', 'success');
    setTimeout(() => {
      window.location.href = 'new-password.html';
    }, 1000);
  });
}

/* ==========================================================================
   6. Screen 4: Reset Password Form
   ========================================================================== */
function initResetPasswordForm() {
  const form = document.getElementById('resetPasswordForm');
  if (!form) return;

  const newPassInput = document.getElementById('newPassword');
  const confirmPassInput = document.getElementById('confirmPassword');
  const newPassError = document.getElementById('newPasswordError');
  const confirmPassError = document.getElementById('confirmPasswordError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const newPass = newPassInput.value;
    const confirmPass = confirmPassInput.value;

    if (!newPass || newPass.length < 8) {
      showFieldError(newPassInput, newPassError, 'كلمة المرور يجب ألا تقل عن 8 أحرف');
      isValid = false;
    } else {
      clearFieldError(newPassInput, newPassError);
    }

    if (!confirmPass) {
      showFieldError(confirmPassInput, confirmPassError, 'يرجى تأكيد كلمة المرور');
      isValid = false;
    } else if (newPass !== confirmPass) {
      showFieldError(confirmPassInput, confirmPassError, 'كلمتا المرور غير متطابقتين');
      isValid = false;
    } else {
      clearFieldError(confirmPassInput, confirmPassError);
    }

    if (isValid) {
      showToast('تم تعيين كلمة المرور الجديدة بنجاح! جاري الانتقال...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    }
  });

  [newPassInput, confirmPassInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        clearFieldError(inp, inp.closest('.form-group')?.querySelector('.field-error'));
      });
    }
  });
}

/* ==========================================================================
   Helper Functions
   ========================================================================== */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, errorElement, message) {
  const wrapper = input.closest('.input-wrapper');
  if (wrapper) wrapper.classList.add('is-invalid');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('active');
  }
}

function clearFieldError(input, errorElement) {
  const wrapper = input.closest('.input-wrapper');
  if (wrapper) wrapper.classList.remove('is-invalid');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('active');
  }
}
