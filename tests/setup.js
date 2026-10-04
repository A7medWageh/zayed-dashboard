/**
 * Vitest Environment Setup
 * Polyfills / Mocks localStorage for consistent test execution across environments
 */
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

const mockStore = new LocalStorageMock();

// Attach to global scope for node & happy-dom
Object.defineProperty(globalThis, "localStorage", {
  value: mockStore,
  writable: true,
  configurable: true,
});

if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: mockStore,
    writable: true,
    configurable: true,
  });
}
