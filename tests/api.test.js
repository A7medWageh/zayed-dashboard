/**
 * API Client & Persistence Store Tests
 */
import { describe, it, expect, beforeEach } from "vitest";
import { ApiClient } from "../js/services/apiClient.js";

describe("ApiClient Persistence Store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should fetch default seeded orders", async () => {
    const orders = await ApiClient.getAll("orders");
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].clientName).toBeDefined();
  });

  it("should create a new order and persist it in storage", async () => {
    const newOrderData = {
      code: "#AZ-9999",
      clientName: "شركة الاختبار التقني",
      serviceName: "تطبيق موشن جرافيك",
      amount: 50000,
      status: "pending",
    };

    const created = await ApiClient.create("orders", newOrderData);
    expect(created.id).toBeDefined();
    expect(created.clientName).toBe("شركة الاختبار التقني");

    const all = await ApiClient.getAll("orders");
    expect(all.find((o) => o.id === created.id)).toBeDefined();
  });

  it("should update an existing record", async () => {
    const all = await ApiClient.getAll("orders");
    const firstId = all[0].id;

    const updated = await ApiClient.update("orders", firstId, { clientName: "اسم معدل" });
    expect(updated.clientName).toBe("اسم معدل");

    const fetched = await ApiClient.getById("orders", firstId);
    expect(fetched.clientName).toBe("اسم معدل");
  });

  it("should delete a record", async () => {
    const all = await ApiClient.getAll("orders");
    const firstId = all[0].id;
    const initialLength = all.length;

    const delRes = await ApiClient.delete("orders", firstId);
    expect(delRes.success).toBe(true);

    const remaining = await ApiClient.getAll("orders");
    expect(remaining.length).toBe(initialLength - 1);
    expect(remaining.find((o) => o.id === firstId)).toBeUndefined();
  });
});
