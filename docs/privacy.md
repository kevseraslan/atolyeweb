# Technical Privacy & KVKK Compliance Architecture Guide

## 1. Personal Data Inventory & Categorization
- **Direct Identifiers (Orders):** `customer_name` (Ad Soyad), `phone` (Telefon Numarası), `email` (Opsiyonel E-posta).
- **Location Data (Orders):** `city` (Şehir bilgisi - Lojistik/teslimat değerlendirmesi amacıyla).
- **Order & Product tercihleri:** `requested_width`, `requested_height`, `requested_depth`, `quantity`, `custom_note`, `product_id`, `color_id`, `material_id`.
- **Order Tracking:** `tracking_number` (Sipariş doğrulama anahtarı), `phone`.
- **Administrative Account Data:** `admins.email`, `admins.full_name`, `admins.password_hash`, `admins.last_login_at`.
- **NON-EXISTENT DATA (Excluded by Design):** Customer accounts/passwords (Üyeliksiz sistem), Customer Image Uploads, Credit Card/Payment Data (Sitede online ödeme yoktur), T.C. Kimlik No, Birthdate, Full Street Address.

---

## 2. Processing Purposes & Legal Grounds (KVKK Md. 5 Matrix)
- **`customer_name`:** Talep sahibini tanımlama ve iletişim kurulması (KVKK md. 5/2-c Sözleşmenin kurulması/ifası).
- **`phone`:** Özel sipariş teklif bilgilendirmesi ve sipariş doğrulama (KVKK md. 5/2-c).
- **`email` (Opsiyonel):** Müşteri tercih etmişse ek iletişim ve teklif iletimi (KVKK md. 5/2-c).
- **`city`:** Üretim tesisi teslimat ve lojistik fizibilitesi (KVKK md. 5/2-f Meşru menfaat).
- **`custom_note` & Ölçüler:** Özel üretim mobilya tasarımı, ahşap/cila seçimi ve teklif hesaplaması (KVKK md. 5/2-c).

---

## 3. Third-Party Service Flow & Data Boundaries
- **Cloudinary CDN:** Yalnızca yöneticiler tarafından yüklenen **kamusal ürün katalog fotoğrafları** ve ahşap doku görsellerini sunar. Müşteri kişisel verileri veya sipariş detayları Cloudinary platformuna **gönderilmez**.
- **Unsplash:** Demo/placeholder görseller için istemci tarafı doğrudan görsel çekimi (Kişisel veri iletilmez).
- **Google Fonts / Analytics / Marketing Pixels:** **KULLANILMAMAKTADIR**. İstemciye reklam, analiz veya harici font izleme script'leri yerleştirilmez.

---

## 4. Cookie Classification
- **Strictly Necessary Cookies Only:**
  - `admin_session` / `__Host-admin_session`: Yalnızca yetkili yönetici paneli oturumu için kullanılır (Ömrü: 4 Saat). Kamusal ziyaretçilere atanmaz.
- **Analytics / Marketing Cookies:** **YOKTUR**. Bu nedenle kullanıcıyı rahatsız eden "Tümünü Kabul Et" rıza banner'ı yerleştirilmemiş; bilgilendirme `/gizlilik` sayfasında açıkça yapılmıştır.

---

## 5. Retention Matrix & Data Lifecycle
*(Final retention periods require business and legal confirmation prior to production)*
- **İptal Edilen / Onaylanmayan Teklif Talepleri:** 1 Yıl sonra otomatik arşivleme/anonimleştirme önerilir.
- **Tamamlanan / Teslim Edilen Siparişler:** Ticaret ve Vergi Usul Kanunu uyarınca 10 yıl yasal zamanaşımı süresince saklanır.
- **Yönetici Giriş Logları:** 2 Yıl teknik denetim amacıyla saklanır.

---

## 6. Data Subject Requests (İlgili Kişi Hakları Süreci)
- Müşteri hesabı bulunmadığından KVKK md. 11 kapsamındaki bilgi alma ve silme talepleri **`info@artisanwoodworks.com`** e-posta adresi üzerinden yazılı doğrulamayla kabul edilir.
- Telefon numarası ve sipariş takip numarası doğrulaması yapılmadan üçüncü şahıslara bilgi verilmez.

---

## 7. Production Legal Checklist (Deploy Blockers)
- [ ] Gerçek işletme unvanı ve MERSİS/Vergi numarasının `/kvkk` sayfasına işlenmesi
- [ ] Veri sorumlusu açık tebligat adresi ve KVKK başvuru e-posta adresinin doğrulanması
- [ ] Production sunucusu (Contabo/VPS) veri merkezi lokasyonu ve KVKK yurt dışı aktarım kontrolleri
- [ ] İşletmenin mali müşaviri/hukuk danışmanı ile nihai veri saklama sürelerinin onaylanması
