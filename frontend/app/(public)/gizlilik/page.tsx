import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata = {
  title: "Gizlilik ve Çerez Politikası | Özel Mobilya Atölyesi",
  description: "Özel ahşap mobilya atölyesi gizlilik ve çerez kullanım politikası. Kişisel veri güvenliği ve teknik çerez açıklamaları.",
};

export default function GizlilikPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto my-12 py-12 px-6 sm:px-10 bg-white rounded-2xl shadow-sm border border-[#e5e2e1]">
        <div className="flex items-center gap-4 border-b border-[#e5e2e1] pb-6 mb-8">
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image
              src="/visuals/illustrations/legal-shield.svg"
              alt="Gizlilik & Güvenlik Rozeti"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#442a22] font-bold">
              Gizlilik ve Çerez Politikası
            </h1>
            <p className="text-xs text-[#827470] mt-1 italic">
              Kişisel Mahremiyet ve Teknik Çerezler • Son Güncelleme: 29 Ağustos 2026
            </p>
          </div>
        </div>

        <div className="space-y-8 text-[#1b1c1c] text-sm md:text-base leading-relaxed">
          {/* Gizlilik Prensiplerimiz */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              1. Gizlilik Prensiplerimiz
            </h2>
            <p className="text-[#504441]">
              Atölyemiz olarak kişisel mahremiyetinize saygı duyuyoruz. Web sitemizi ziyaret eden müşterilerimizin ve ziyaretçilerimizin kişisel verilerinin güvenliğini sağlamak öncelikli ilkemizdir.
            </p>
          </section>

          {/* Ne Toplamıyoruz? */}
          <section className="p-5 bg-[#fcf9f8] rounded-xl border border-[#e5e2e1]">
            <h2 className="font-serif text-lg text-[#442a22] font-semibold mb-2">
              Ne Toplamıyoruz? (Veri Minimizasyonu)
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-[#504441]">
              <li>Müşteri üyelik hesabı veya profil verisi **toplanmaz** (Üyeliksiz doğrudan sipariş talebi verilir).</li>
              <li>Kredi kartı, banka hesabı veya ödeme bilgisi **toplanmaz** (Sitemizde online ödeme altyapısı yoktur).</li>
              <li>T.C. Kimlik No veya doğum tarihi gibi hassas kişisel veriler **istenmez**.</li>
              <li>Ziyaretçi kişisel fotoğrafları **toplanmaz veya yüklenmez**.</li>
              <li>Google Analytics, Facebook Pixel gibi üçüncü taraf reklam/takip script&apos;leri **kullanılmaz**.</li>
            </ul>
          </section>

          {/* Çerez (Cookie) Kullanımı */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              2. Çerez (Cookie) Kullanımı
            </h2>
            <p className="text-[#504441] mb-3">
              Web sitemizde yalnızca sistemin güvenli ve doğru çalışması için zorunlu olan **Zorunlu Teknik Çerezler (Strictly Necessary Cookies)** kullanılmaktadır. Reklam veya pazarlama amaçlı çerez bulunmamaktadır.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-[#e5e2e1] text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#f0eded] text-[#442a22]">
                    <th className="p-3 border border-[#e5e2e1]">Çerez Adı</th>
                    <th className="p-3 border border-[#e5e2e1]">Türü</th>
                    <th className="p-3 border border-[#e5e2e1]">Kullanım Amacı</th>
                    <th className="p-3 border border-[#e5e2e1]">Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-[#e5e2e1] font-mono">admin_session / __Host-admin_session</td>
                    <td className="p-3 border border-[#e5e2e1]">Zorunlu Güvenlik Çerezi</td>
                    <td className="p-3 border border-[#e5e2e1]">Yalnızca yetkili yönetici paneli oturumunu korumak içindir. Kamusal ziyaretçilere atanmaz.</td>
                    <td className="p-3 border border-[#e5e2e1]">4 Saat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Üçüncü Taraf Hizmetler (Cloudinary) */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              3. Üçüncü Taraf İçerik ve Görsel Sunucuları
            </h2>
            <p className="text-[#504441]">
              Sitemizdeki ürün fotoğrafları ve ahşap doku görselleri güvenli görsel sunucusu (Cloudinary CDN) üzerinden sunulmaktadır. Cloudinary yalnızca kamusal ürün katalog görsellerini barındırır; müşteri kişisel verileri veya sipariş bilgileri Cloudinary platformuna gönderilmez.
            </p>
          </section>

          {/* Veri Güvenliği */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              4. Veri Güvenliği Önlemleri
            </h2>
            <p className="text-[#504441]">
              Toplanan sipariş talepleri HTTPS/TLS şifrelemeli bağlantılar üzerinden iletilir. Sunucu tarafında yetkisiz erişime karşı CSRF token koruması, Argon2id şifreleme ve IP bazlı istek sınırlandırma (Rate Limiting) uygulanmaktadır.
            </p>
          </section>

          {/* İletişim */}
          <section className="pt-4 border-t border-[#e5e2e1]">
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              5. İletişim
            </h2>
            <p className="text-[#504441]">
              Gizlilik politikamız veya çerez kullanımı ile ilgili sorularınızı atölyemizin iletişim kanalları üzerinden iletebilirsiniz. Resmi iletişim bilgileri yayına alma öncesinde işletme tarafından ilan edilecektir.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e5e2e1] flex justify-between items-center text-xs text-[#504441]">
          <Link href="/kvkk" className="hover:text-[#442a22] font-semibold underline">
            ← KVKK Aydınlatma Metni
          </Link>
          <Link href="/" className="hover:text-[#442a22] font-semibold underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
