import { test, expect } from "@playwright/test";

test.describe("Release Verification E2E Suite", () => {

  test("01. Public Catalog & Navigation E2E", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("404")) consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // A) Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/Özel Mobilya & Masif Ahşap Tasarım/);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Verify public access leaves zero admin auth cookies
    const cookies = await page.context().cookies();
    const adminCookie = cookies.find((c) => c.name === "admin_session" || c.name === "__Host-admin_session");
    expect(adminCookie).toBeUndefined();

    // B) Catalog Page
    await page.goto("/urunler");
    await expect(page.locator("h1")).toContainText("Ürünlerimiz");
    const buyNowButtons = page.locator("text=/Hemen Satın Al|Sepete Ekle/i");
    await expect(buyNowButtons).toHaveCount(0);

    // C) Product 404
    const response = await page.goto("/urunler/gecersiz-urun-modeli-404");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=Aradığınız Sayfa Bulunamadı")).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test("02. Catalog Product Order Flow E2E", async ({ page }) => {
    await page.goto("/ozel-siparis");
    await expect(page.locator("h1")).toContainText("Evinize Özel Mobilya Siparişi");

    // Validation Error Test on Empty Submit
    await page.click("button[type='submit']");
    await expect(page.locator("text=/Lütfen bir katalog ürünü|Lütfen Ad Soyad/")).toBeVisible();

    // Fill Catalog Order Form
    await page.fill("input[placeholder='180']", "180");
    await page.fill("input[placeholder='75']", "75");
    await page.fill("input[placeholder='90']", "90");
    await page.fill("input[placeholder='Ahmet Yılmaz']", "Ahmet Yılmaz E2E");
    await page.fill("input[placeholder='0532 123 45 67']", "05321112233");
    await page.fill("input[placeholder='İstanbul']", "İstanbul");

    // Submit Order
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    // Success Screen & Tracking Number Box
    await expect(page.locator("text=Sipariş Talebiniz Başarıyla Oluşturuldu")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Sipariş Takip Numarası")).toBeVisible();

    // Verify No Payment / Checkout fields
    await expect(page.locator("text=/Kredi Kartı|Ödeme|Checkout/i")).toHaveCount(0);
  });

  test("03. Custom Design Order Flow E2E", async ({ page }) => {
    await page.goto("/ozel-siparis");

    // Custom design radio option
    await page.click("input[value='custom']");
    await page.fill("input[placeholder*='8 Kişilik']", "Özel Tasarım Masif Kestane Çalışma Masası");
    await page.fill("input[placeholder='Ahmet Yılmaz']", "Mehmet Demir");
    await page.fill("input[placeholder='0532 123 45 67']", "05334445566");
    await page.fill("input[placeholder='İstanbul']", "İzmir");

    // Optional email left empty
    await page.click("button[type='submit']");
    await expect(page.locator("text=Sipariş Talebiniz Başarıyla Oluşturuldu")).toBeVisible({ timeout: 10000 });
  });

  test("04. Order Tracking Flow E2E (Security & Generic Error Verification)", async ({ page }) => {
    await page.goto("/siparis-takip");
    await expect(page.locator("h1")).toContainText("Sipariş & Teklif Durumu Sorgulama");

    // A) Wrong Phone / Unknown Tracking Generic Error Test
    await page.fill("input[placeholder='ORD-XXXXXXXX']", "ORD-99999999");
    await page.fill("input[placeholder='05XX XXX XX XX']", "05000000000");
    await page.click("button[type='submit']");

    // Must return generic error without revealing whether tracking ID or phone was incorrect
    await expect(
      page.locator("text=Girilen takip numarası veya telefon numarası eşleşmedi.")
    ).toBeVisible();
  });

  test("05. Admin Auth, Session & Route Protection E2E", async ({ page }) => {
    // Unauthenticated user attempting to access /admin must be redirected to /admin/login
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Test Invalid Credentials
    await page.fill("input[type='email']", "wrongadmin@example.com");
    await page.fill("input[type='password']", "wrongpassword123");
    await page.click("button[type='submit']");
    await expect(page.locator("text=E-posta veya şifre hatalı.")).toBeVisible();
  });

  test("06. Controlled API Network Failure UX E2E", async ({ page }) => {
    // Intercept order tracking request and simulate HTTP 500 server error
    await page.route("**/api/v1/orders/track", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.",
          },
        }),
      });
    });

    await page.goto("/siparis-takip");
    await page.fill("input[placeholder='ORD-XXXXXXXX']", "ORD-12345678");
    await page.fill("input[placeholder='05XX XXX XX XX']", "05321112233");
    await page.click("button[type='submit']");

    // Friendly generic error message shown - raw stack trace / SQL detail NEVER shown to user
    await expect(page.locator("text=Bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.")).toBeVisible();
    await expect(page.locator("text=/Traceback|SQLAlchemy|sqlite3/i")).toHaveCount(0);
  });

  test("07. Accessibility & Keyboard Focus Navigation Smoke E2E", async ({ page }) => {
    await page.goto("/siparis-takip");

    // Test keyboard navigation via Tab key
    const trackingInput = page.locator("input[placeholder='ORD-XXXXXXXX']");
    await trackingInput.focus();
    await expect(trackingInput).toBeFocused();

    // Verify submit button has accessible name
    const submitBtn = page.locator("button[type='submit']");
    await expect(submitBtn).toHaveText("Sorgula");
  });

});
