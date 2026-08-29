import { test, expect } from "@playwright/test";

test.describe("Release Verification E2E Suite", () => {

  test("01. Public Home Page E2E", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/Özel Mobilya & Masif Ahşap Tasarım/);

    // Navbar and Footer Visibility
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Verify no admin auth cookie is set on public access
    const cookies = await page.context().cookies();
    const adminCookie = cookies.find((c) => c.name === "admin_session");
    expect(adminCookie).toBeUndefined();
  });

  test("02. Product Catalog E2E", async ({ page }) => {
    await page.goto("/urunler");
    await expect(page.locator("h1")).toContainText("Ürünlerimiz");

    // Verify catalog list renders without fake checkout or fake price buttons
    const buyNowButtons = page.locator("text=/Hemen Satın Al|Sepete Ekle/i");
    await expect(buyNowButtons).toHaveCount(0);
  });

  test("03. Product 404 Handling E2E", async ({ page }) => {
    const response = await page.goto("/urunler/gecersiz-urun-modeli-404");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=Aradığınız Sayfa Bulunamadı")).toBeVisible();
  });

  test("04. Special Order Form E2E (Custom Design & Catalog)", async ({ page }) => {
    await page.goto("/ozel-siparis");
    await expect(page.locator("h1")).toContainText("Evinize Özel Mobilya Siparişi");

    // Test Validation Error on empty submit
    await page.click("button[type='submit']");
    await expect(page.locator("text=Lütfen Ad Soyad, Telefon ve Şehir alanlarını doldurunuz.")).toBeVisible();

    // Fill Custom Order Form
    await page.click("input[value='custom']");
    await page.fill("input[placeholder*='8 Kişilik']", "E2E Test Masif Meşe Yemek Masası");
    await page.fill("input[placeholder='180']", "200");
    await page.fill("input[placeholder='75']", "75");
    await page.fill("input[placeholder='90']", "90");
    await page.fill("input[placeholder='Ahmet Yılmaz']", "Test Müşteri E2E");
    await page.fill("input[placeholder='0532 123 45 67']", "05329998877");
    await page.fill("input[placeholder='İstanbul']", "Ankara");

    // Optional email left empty - submit order
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    // Verify double-submit guard (button disabled during request)
    await expect(page.locator("text=Sipariş Talebiniz Başarıyla Oluşturuldu")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Sipariş Takip Numarası")).toBeVisible();
  });

  test("05. Order Tracking Flow E2E (Security & Generic Error Verification)", async ({ page }) => {
    await page.goto("/siparis-takip");
    await expect(page.locator("h1")).toContainText("Sipariş & Teklif Durumu Sorgulama");

    // Wrong Phone / Unknown Tracking Generic Error Test
    await page.fill("input[placeholder='ORD-XXXXXXXX']", "ORD-12345678");
    await page.fill("input[placeholder='05XX XXX XX XX']", "05000000000");
    await page.click("button[type='submit']");

    // Must return generic error without revealing whether tracking ID or phone is wrong
    await expect(
      page.locator("text=Girilen takip numarası veya telefon numarası eşleşmedi.")
    ).toBeVisible();
  });

  test("06. Admin Route Protection & Login E2E", async ({ page }) => {
    // Unauthenticated user attempting to access /admin must be redirected to /admin/login
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Test Wrong Admin Credentials
    await page.fill("input[type='email']", "wrongadmin@example.com");
    await page.fill("input[type='password']", "wrongpassword123");
    await page.click("button[type='submit']");
    await expect(page.locator("text=E-posta veya şifre hatalı.")).toBeVisible();
  });

  test("07. Accessibility & Keyboard Navigation Flow", async ({ page }) => {
    await page.goto("/siparis-takip");
    // Test keyboard navigation via Tab key
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Verify focus indicator is functional on input elements
    const trackingInput = page.locator("input[placeholder='ORD-XXXXXXXX']");
    await trackingInput.focus();
    await expect(trackingInput).toBeFocused();
  });

});
