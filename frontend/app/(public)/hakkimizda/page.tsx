import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Hakkımızda & Atölye Hikayemiz",
  description:
    "Masif ahşap mobilya atölyemizin zanaat hikayesi, el işçiliği değerlerimiz ve zamansız tasarım anlayışımız.",
  alternates: {
    canonical: `${siteUrl}/hakkimizda`,
  },
};

export default function AboutPage() {
  return (
    <div className="w-full py-16">
      <PageContainer>
        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-20">
          <div className="md:col-span-6 flex flex-col gap-6">
            <Badge variant="tertiary" className="w-fit">
              Hakkımızda
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl text-[#442a22] font-bold leading-tight">
              Atölyemizin Hikayesi &amp; Zanaat Tutkumuz
            </h1>
            <p className="text-base text-[#504441] leading-relaxed">
              Ahşabın sıcaklığını ve doğal dokusunu modern tasarımla buluşturduğumuz
              yolculuğumuz, geleneksel bir marangoz tezgahında başladı. Seri üretimin
              tekdüzeliğine karşı, her bir ağaç parçasının kendine has damar yapısını,
              budak izlerini ve karakterini koruyarak zamansız mobilyalar üretiyoruz.
            </p>
            <p className="text-base text-[#504441] leading-relaxed">
              Bizim için her masa, sandalye veya konsol yalnızca bir eşya değil;
              yaşam alanlarında nesiller boyu anılara eşlik edecek yaşayan bir ahşap eserdir.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#e5e2e1] bg-[#f6f2ef] relative">
              <Image
                src="/visuals/illustrations/craftsman-story.svg"
                alt="Zanaatkar ahşap işçiliği ve marangoz tezgahı hikayesi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="border-t border-[#e5e2e1] pt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#8d5b4c] tracking-widest uppercase">
              İlkelerimiz
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[#442a22] font-bold mt-2">
              Neden Masif Ahşap?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1]">
              <h3 className="font-serif text-lg font-semibold text-[#442a22] mb-2">
                %100 Doğal Masif
              </h3>
              <p className="text-xs text-[#504441] leading-relaxed">
                Yonga levha veya sunta kullanmıyoruz. Gövde ve ayakların tamamı birinci sınıf masif ağaçtan üretilir.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1]">
              <h3 className="font-serif text-lg font-semibold text-[#442a22] mb-2">
                Kişiye Özel Üretim
              </h3>
              <p className="text-xs text-[#504441] leading-relaxed">
                Mekanınızın tam ölçülerine ve dekorasyonunuza uygun renk/cila seçenekleriyle üretim yapıyoruz.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1]">
              <h3 className="font-serif text-lg font-semibold text-[#442a22] mb-2">
                Geleneksel Birleşim
              </h3>
              <p className="text-xs text-[#504441] leading-relaxed">
                Zıvana ve kırlangıçkuyruğu gibi dayanıklı ahşap birleştirme teknikleriyle uzun ömürlü mukavemet sağlıyoruz.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1]">
              <h3 className="font-serif text-lg font-semibold text-[#442a22] mb-2">
                Doğal Yağ &amp; Cila
              </h3>
              <p className="text-xs text-[#504441] leading-relaxed">
                İnsan sağlığına ve çevreye dost, ahşabın nefes almasını sağlayan sertifikalı doğal yağlar uyguluyoruz.
              </p>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
