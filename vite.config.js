import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        enterEmail: resolve(__dirname, "enter-email.html"),
        otp: resolve(__dirname, "otp.html"),
        newPassword: resolve(__dirname, "new-password.html"),
        orders: resolve(__dirname, "orders.html"),
        services: resolve(__dirname, "services.html"),
        addService: resolve(__dirname, "add-service.html"),
        editService: resolve(__dirname, "edit-service.html"),
        packages: resolve(__dirname, "packages.html"),
        supervisors: resolve(__dirname, "supervisors.html"),
        roles: resolve(__dirname, "roles.html"),
        settings: resolve(__dirname, "settings.html"),
        contact: resolve(__dirname, "contact.html")
      }
    }
  },
  test: {
    environment: "happy-dom",
    globals: true
  }
});
