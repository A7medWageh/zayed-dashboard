/**
 * AZ Studio - Authentication Service
 * Manages JWT tokens, user sessions, mock API validation and state persistence
 */

const TOKEN_KEY = "az_auth_token";
const USER_KEY = "az_auth_user";
const OTP_EMAIL_KEY = "az_otp_pending_email";

export const AuthService = {
  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  /**
   * Get current authenticated user details
   * @returns {object|null}
   */
  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Get JWT / Auth Token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Authenticate user with email and password
   * Simulates real backend authentication API
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, user?: object, message?: string}>}
   */
  async login(email, password) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    }

    if (password.length < 6) {
      throw new Error("كلمة المرور يجب ألا تقل عن 6 أحرف");
    }

    // Success response with token and session data
    const mockUser = {
      id: "usr_az_9012",
      name: "أحمد زايد",
      email: cleanEmail,
      role: "مشرف عام (Admin)",
      avatar: "./assets/avatar.png",
      permissions: ["ALL"],
    };

    const mockToken =
      "az_jwt_" + btoa(JSON.stringify({ id: mockUser.id, exp: Date.now() + 86400000 }));

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

    return {
      success: true,
      token: mockToken,
      user: mockUser,
      message: "تم تسجيل الدخول بنجاح",
    };
  },

  /**
   * Request OTP code for password recovery
   * @param {string} email
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async requestOtp(email) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("يرجى إدخال بريد إلكتروني صحيح");
    }

    localStorage.setItem(OTP_EMAIL_KEY, cleanEmail);
    return {
      success: true,
      message: "تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني",
    };
  },

  /**
   * Verify 6-digit OTP code
   * @param {string} code
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyOtp(code) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanCode = (code || "").trim();
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      throw new Error("رمز التحقق يجب أن يتكون من 6 أرقام");
    }

    return {
      success: true,
      message: "تم التحقق من الرمز بنجاح",
    };
  },

  /**
   * Set new password
   * @param {string} newPassword
   * @param {string} confirmPassword
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resetPassword(newPassword, confirmPassword) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!newPassword || newPassword.length < 6) {
      throw new Error("كلمة المرور يجب أن لا تقل عن 6 خانات");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("كلمتا المرور غير متطابقتين");
    }

    localStorage.removeItem(OTP_EMAIL_KEY);
    return {
      success: true,
      message: "تم تعيين كلمة المرور الجديدة بنجاح! يمكنك الآن تسجيل الدخول",
    };
  },

  /**
   * Logout user and clear tokens
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(OTP_EMAIL_KEY);
    window.location.href = "login.html";
  },
};
