# Technical Privacy & KVKK Architecture Guide

## SECTION A: IMPLEMENTED TECHNICALLY

### 1. Personal Data Inventory & System Boundaries
- **Direct Identifiers (Orders):** `customer_name` (Ad Soyad), `phone` (Telefon Numarası), `email` (Opsiyonel E-posta).
- **Location Data (Orders):** `city` (Şehir bilgisi - Lojistik ve teslimat fizibilitesi amacıyla).
- **Order & Product Preferences:** `requested_width`, `requested_height`, `requested_depth`, `quantity`, `custom_note`, `product_id`, `color_id`, `material_id`.
- **Order Tracking:** `tracking_number` (Sipariş doğrulama anahtarı), `phone`.
- **Administrative Account Data:** `admins.email`, `admins.full_name`, `admins.password_hash`, `admins.last_login_at`.
- **NON-EXISTENT DATA (Excluded by Design):** Customer accounts/passwords (Üyeliksiz sistem), Customer Image Uploads, Credit Card/Payment Data (Sitede online ödeme yoktur), T.C. Kimlik No, Birthdate, Full Street Address.

---

### 2. Form & UI Privacy Disclosures (Aydınlatma ≠ Rıza)
- **Special Order Form (`/ozel-siparis`):** Form submit butonu altında bilgilendirme bağlantısı yer alır: *"Talebinizi göndermeden önce kişisel verilerinizin işlenmesine ilişkin KVKK Aydınlatma Metni'ni inceleyebilirsiniz."* (Zorunlu rıza kutusu veya kabul etme zorunluluğu empoze edilmez).
- **Order Tracking Form (`/siparis-takip`):** *"Telefon numaranız yalnızca talep doğrulaması amacıyla kullanılır."*
- **Public Cookie Behavior:** Anonim ziyaretçilere kamusal gezinmede (`/`, `/urunler`, `/gizlilik`, `/kvkk`) hiçbir yönetici veya takip çerezi set edilmez.

---

### 3. Detailed Third-Party Service Flow & Data Boundaries
- **Cloudinary CDN:** Yalnızca yöneticiler tarafından yüklenen **kamusal ürün katalog fotoğrafları** ve ahşap doku görsellerini sunar. Müşteri kişisel verileri veya sipariş detayları Cloudinary platformuna **gönderilmez**.
- **Contabo (Gelecek VPS Host):** Gelecekte uygulama ve veritabanı sunucusu olarak kullanılacaktır.
- **Nginx:** Self-hosted altyapı ters sunucusu.
- **Let's Encrypt:** TLS sertifika altyapısı.
- **GitHub:** Yalnızca kaynak kod deposu. Üretim müşteri veritabanı veya kişisel veriler GitHub deposuna **kesinlikle taahhüt edilmez/yüklenmez**.
- **Google Analytics / Facebook Pixel / Marketing Scripts:** **KULLANILMAMAKTADIR**.

---

### 4. Cookie Inventory
- **Strictly Necessary Cookies Only:**
  - `admin_session` (Development) / `__Host-admin_session` (Production): Yalnızca yetkili yönetici paneli oturumunu korur. (Süre: 4 Saat, Yalnızca admin kullanıcılarına atanır).
- **Analytics & Marketing Cookies:** **YOKTUR**. Bu nedenle kullanıcıyı rahatsız eden rıza banner'ı eklenmemiş; teknik açıklama `/gizlilik` sayfasında yapılmıştır.

---

### 5. Data Subject Request (DSR) Identity Verification Approach
- Sistemde üyelik hesabı bulunmadığı için sipariş verilerine ilişkin bilgi alma/silme taleplerinde yalnızca `phone + tracking_number` kombinasyonu otomatik kimlik doğrulaması için yeterli sayılmaz.
- Başvurularda risk tabanlı manuel kimlik doğrulaması uygulanır (Talep kaydıyla eşleşen iletişim bilgileri teyit edilir, üçüncü şahısların verilerine erişimi kesinlikle engellenir).

---

## SECTION B: LEGAL / BUSINESS CONFIRMATION REQUIRED PRIOR TO PRODUCTION

### 1. Veri Sorumlusunun Resmi Kimliği & İletişim Bilgileri
- [ ] Gerçek ticari unvanın (veya gerçek kişi işletmesi ise resmi veri sorumlusu adının) `/kvkk` metnine işlenmesi.
- [ ] Veri sorumlusu resmi tebligat adresi ve KVKK başvuru e-posta adresinin tanımlanması (Sahte e-posta kullanılmamıştır).
- [ ] İşletmenin hukuki yapısına göre MERSİS/Vergi numarasının beyan gereksiniminin hukuk danışmanı ile netleştirilmesi.

---

### 2. Draft Legal Grounds Mapping (KVKK Md. 5 Review)
*(Hukuk danışmanı tarafından üretim öncesi nihai onay verilmelidir)*
- **Sipariş / Teklif Talebinin Alınması:** KVKK md. 5/2-c (Sözleşmenin kurulması/ifasıyla doğrudan ilgili olması).
- **Sipariş Takibi & Doğrulama:** KVKK md. 5/2-c (Sözleşmenin ifası).
- **Teknik Güvenlik & Rate Limiting (IP Loglama):** KVKK md. 5/2-f (Meşru menfaat) ve md. 5/2-ç (Hukuki yükümlülük).

---

### 3. Data Retention Matrix
*(Final retention periods require business and legal confirmation based on tax/accounting/contract law)*

| Veri Kategorisi | Saklama Süresi (Retention) | Tetikleyici (Trigger) | İmha Aksiyonu (Action) |
| :--- | :--- | :--- | :--- |
| **Sonuçsuz Kalan Teklif Talepleri** | TBD — Hukuk/İşletme Teyidi Gerekli | Talebin sonuçsuz kalması + İşleme amacının sona ermesi | Silme, Yok Etme veya Anonimleştirme |
| **Tamamlanan / Teslim Edilen Siparişler** | TBD — İlgili Vergi/Muhasebe/Ticaret Mevzuatı | Yasal saklama yükümlülüğü süresinin dolması | Silme, Yok Etme veya Anonimleştirme |
| **Yönetici Oturum Logları** | TBD — Teknik Denetim İhtiyacı | Teknik denetim amacının tamamlanması | Güvenli Silme |

**Temel İmha İlkesi:** Kişisel verilerin işlenmesini gerektiren sebepler ortadan kalktığında ve başka bir yasal saklama yükümlülüğü bulunmadığında veriler silinir, yok edilir veya anonim hale getirilir. Silme ve anonimleştirme işlemleri operasyonel olarak kayıt altına alınacaktır.

---

### 4. Yurt Dışına Aktarım Checklist (KVKK Md. 9 - 2024 Reformu)
- [ ] Production sunucusunun (Contabo VPS) veri merkezi ülkesinin tespiti.
- [ ] Cloudinary görsel sunucusunun veri işleme lokasyonlarının incelenmesi.
- [ ] Yurt dışına veri aktarımı oluşuyorsa KVKK md. 9 uyarınca uygun aktarım mekanizmasının (Standart Sözleşme vb.) tespiti ve Kurum bildirimi değerlendirmesi.
