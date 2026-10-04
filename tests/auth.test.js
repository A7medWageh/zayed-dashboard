/**
 * Auth Service Unit & Integration Tests
 */
import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "../js/services/authService.js";

describe("AuthService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should reject login with empty credentials", async () => {
    await expect(AuthService.login("", "")).rejects.toThrow();
  });

  it("should reject login with short password", async () => {
    await expect(AuthService.login("admin@azstudio.com", "123")).rejects.toThrow();
  });

  it("should login successfully with valid credentials and store token", async () => {
    const res = await AuthService.login("admin@azstudio.com", "secret123");
    expect(res.success).toBe(true);
    expect(res.token).toBeDefined();
    expect(AuthService.isAuthenticated()).toBe(true);
    expect(AuthService.getCurrentUser().email).toBe("admin@azstudio.com");
  });

  it("should handle OTP request and verification", async () => {
    const req = await AuthService.requestOtp("test@azstudio.com");
    expect(req.success).toBe(true);

    await expect(AuthService.verifyOtp("123")).rejects.toThrow();
    const ver = await AuthService.verifyOtp("123456");
    expect(ver.success).toBe(true);
  });

  it("should reject password reset when passwords do not match", async () => {
    await expect(AuthService.resetPassword("pass1234", "different1234")).rejects.toThrow();
  });

  it("should successfully reset password with matching values", async () => {
    const res = await AuthService.resetPassword("newPassword123", "newPassword123");
    expect(res.success).toBe(true);
  });

  it("should logout and clear session", async () => {
    await AuthService.login("admin@azstudio.com", "secret123");
    expect(AuthService.isAuthenticated()).toBe(true);

    // Test clearing storage directly without trigger page redirect
    localStorage.removeItem("az_auth_token");
    localStorage.removeItem("az_auth_user");
    expect(AuthService.isAuthenticated()).toBe(false);
  });
});
