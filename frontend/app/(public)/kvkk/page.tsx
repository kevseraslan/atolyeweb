import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata = {
  title: "KVKK Aydınlatma Metni | Özel Mobilya Atölyesi",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto my-12 py-12 px-6 sm:px-10 bg-white rounded-2xl shadow-sm border border-[#e5e2e1]">
        <div className="flex items-center gap-4 border-b border-[#e5e2e1] pb-6 mb-8">
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image
              src="/visuals/illustrations/legal-shield.svg"
              alt="Veri Koruma & KVKK Rozeti"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#442a22] font-bold">
              Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni
            </h1>
            <p className="text-xs text-[#827470] mt-1 italic">
              6698 Sayılı KVKK Uyarınca Bilgilendirme • Son Güncelleme: 29 Ağustos 2026
            </p>
          </div>
        </div>

        <div className="space-y-8 text-[#1b1c1c] text-sm md:text-base leading-relaxed">
          {/* 1. Veri Sorumlusu */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              1. Veri Sorumlusu
            </h2>
            <p className="text-[#504441]">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla atölyemiz (&quot;İşletme&quot;) tarafından aşağıda açıklanan kapsamda işlenmektedir.
            </p>
            <div className="mt-3 p-4 bg-[#fcf9f8] rounded-xl border border-[#e5e2e1] text-xs text-[#504441]">
              <p><strong>Veri Sorumlusu:</strong> Özel Masif Ahşap Mobilya Atölyesi</p>
              <p className="mt-1"><strong>İletişim Adresi:</strong> İstanbul, Türkiye</p>
              <p className="mt-1 text-amber-800">* Veri sorumlusu açık adresi ve resmi iletişim bilgileri işletme tarafından yayına alma öncesi tanımlanacaktır.</p>
            </div>
          </section>

          {/* 2. İşlenen Kişisel Veriler */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              2. İşlenen Kişisel Veriler
            </h2>
            <p className="text-[#504441] mb-2">
              Özel üretim mobilya talebinizin ve siparişinizin değerlendirilmesi sürecinde işlenen kişisel verileriniz şunlardır:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#504441]">
              <li><strong>Kimlik Bilgisi:</strong> Adınız ve soyadınız</li>
              <li><strong>İletişim Bilgileri:</strong> Telefon numaranız ve (varsa) e-posta adresiniz</li>
              <li><strong>Lokasyon Bilgisi:</strong> Bulunduğunuz şehir (lojistik ve teslimat değerlendirmesi amacıyla)</li>
              <li><strong>Talep &amp; İletişim Detayları:</strong> Seçilen mobilya kategorisi, ölçü tercihleri (en, boy, derinlik), renk/malzeme tercihleri ve talebinize ilişkin ilettiğiniz özel notlar</li>
              <li><strong>Sipariş İşlem Bilgisi:</strong> Benzersiz sipariş takip numaranız ve durum geçmişiniz</li>
            </ul>
          </section>

          {/* 3. Kişisel Verilerin İşlenme Amaçları */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              3. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[#504441]">
              <li>Özel üretim mobilya talebinizin alınması, fizibilite ve teklif fiyatının hazırlanması</li>
              <li>Sipariş durumunuza ilişkin sizinle telefon veya e-posta üzerinden iletişim kurulması</li>
              <li>Siparişinizin durumunu hesap oluşturmadan doğrulayabilmeniz için sipariş takip hizmetinin sunulması</li>
              <li>Üretim, nakliye ve teslimat süreçlerinin koordinasyonu</li>
              <li>Müşteri memnuniyetinin ve hukuki yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </section>

          {/* 4. Hukuki Sebepler */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              4. Kişisel Verilerin İşlenme Hukuki Sebepleri
            </h2>
            <p className="text-[#504441]">
              Kişisel verileriniz, KVKK&apos;nın 5. maddesinin 2. fıkrasında yer alan şu hukuki sebeplere dayanılarak işlenmektedir:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#504441] mt-2">
              <li><strong>c)</strong> Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması (Özel üretim teklif ve sipariş süreci)</li>
              <li><strong>ç)</strong> Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</li>
              <li><strong>f)</strong> Temel hak ve özgürlüklerinize zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
            </ul>
          </section>

          {/* 5. Kişisel Verilerin Aktarılması */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              5. Kişisel Verilerin Aktarılması
            </h2>
            <p className="text-[#504441]">
              Toplanan kişisel verileriniz; üçüncü taraf reklam veya pazarlama şirketleriyle **asla paylaşılmamaktadır**. Verileriniz yalnızca kanunen yetkili kamu kurum ve kuruluşlarına yasal zorunluluklar halinde veya teslimat sürecinin yürütülmesi amacıyla lojistik tedarikçilerine aktarılabilir.
            </p>
          </section>

          {/* 6. Kişisel Verilerin Saklanma Süresi */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              6. Saklama Süreleri
            </h2>
            <p className="text-[#504441]">
              Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır. İlgili yasal saklama süreleri sona erdiğinde ve verilerin işlenmesini gerektiren hukuki sebepler ortadan kalktığında kişisel verileriniz güvenli şekilde silinir, yok edilir veya anonim hale getirilir.
            </p>
          </section>

          {/* 7. İlgili Kişinin Hakları */}
          <section>
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              7. KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="text-[#504441] mb-2">
              KVKK&apos;nın 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#504441]">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>KVKK şartları çerçevesinde silinmesini veya yok edilmesini isteme</li>
            </ul>
          </section>

          {/* 8. Başvuru Yöntemi */}
          <section className="pt-4 border-t border-[#e5e2e1]">
            <h2 className="font-serif text-xl text-[#442a22] font-semibold mb-3">
              8. İletişim ve Başvuru
            </h2>
            <p className="text-[#504441]">
              Haklarınıza ilişkin taleplerinizi işletmemize yazılı olarak iletebilirsiniz. Başvuru kanalları ve resmi iletişim bilgileri işletme tarafından yayına alma öncesi ilan edilecektir.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e5e2e1] flex justify-between items-center text-xs text-[#504441]">
          <Link href="/gizlilik" className="hover:text-[#442a22] font-semibold underline">
            Gizlilik ve Çerez Politikası →
          </Link>
          <Link href="/ozel-siparis" className="hover:text-[#442a22] font-semibold underline">
            Özel Sipariş Formuna Dön
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
