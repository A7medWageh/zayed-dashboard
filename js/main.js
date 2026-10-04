/**
 * @deprecated This file is NO LONGER USED and should not be imported anywhere.
 *
 * The canonical Auth implementation lives in js/auth.js (ES module).
 * All Auth pages (login, enter-email, otp, new-password, reset-password)
 * import js/auth.js via <script type="module" src="./js/auth.js">.
 *
 * Kept here only to prevent a 404 if any stale external reference still exists.
 * DO NOT add new logic here. Reference js/auth.js for all Auth flows.
 */

if (typeof console !== "undefined") {
  console.warn(
    "[AZ Studio] js/main.js is deprecated and has no effect. " +
      "Auth logic is handled by js/auth.js. " +
      'Please remove any <script src="js/main.js"> tags from HTML pages.'
  );
}
