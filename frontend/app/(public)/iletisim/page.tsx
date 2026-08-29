"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex-grow pt-8 pb-24 px-5 md:px-16 max-w-[1280px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info & Map */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#442a22] font-bold mb-4">
              Bize Ulaşın
            </h1>
            <p className="text-base text-[#504441] leading-relaxed">
              Atölyemizi ziyaret etmek, projelerinizi konuşmak veya üretim
              sürecimizi yakından görmek için bizimle iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-[#1b1c1c] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-sm">
                  location_on
                </span>{" "}
                Adres
              </h4>
              <p className="text-sm text-[#504441]">
                Atölye Sokak No:123
                <br />
                Ahşap Mahallesi, İstanbul
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1b1c1c] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-sm">
                  schedule
                </span>{" "}
                Çalışma Saatleri
              </h4>
              <p className="text-sm text-[#504441]">
                Pzt - Cum: 09:00 - 18:00
                <br />
                Cmt: 10:00 - 15:00
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1b1c1c] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#442a22] text-sm">
                  call
                </span>{" "}
                İletişim
              </h4>
              <p className="text-sm text-[#504441]">
                +90 (212) 555 01 23
                <br />
                info@artisanwoodworks.com
              </p>
            </div>
          </div>

          {/* Map Image Placeholder */}
          <div className="w-full h-64 bg-[#e5e2e1] rounded-lg overflow-hidden shadow-ambient relative">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
              alt="Atölye harita konumu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#fcf9f8] p-8 md:p-12 rounded-xl shadow-ambient border border-[#eae7e7]">
          <h2 className="font-serif text-2xl text-[#442a22] font-semibold mb-6">
            Mesaj Gönderin
          </h2>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-[#233600]">
                check_circle
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#442a22]">
                Mesajınız İletildi
              </h3>
              <p className="text-sm text-[#504441]">
                Mesajınız atölyemize ulaşmıştır. En kısa sürede yanıt vereceğiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Ad Soyad *" required placeholder="Ahmet Yılmaz" />
                <Input
                  label="E-posta *"
                  type="email"
                  required
                  placeholder="ahmet@example.com"
                />
              </div>

              <Select
                label="Konu"
                options={[
                  { value: "Sipariş Talebi", label: "Özel Sipariş Talebi" },
                  { value: "Bilgi Alma", label: "Bilgi Alma" },
                  { value: "Atölye Ziyareti", label: "Atölye Ziyareti" },
                  { value: "Diğer", label: "Diğer" },
                ]}
              />

              <Textarea
                label="Mesajınız *"
                required
                rows={4}
                placeholder="Mesajınızı buraya yazabilirsiniz..."
              />

              <Button variant="primary" type="submit" className="w-full md:w-auto py-4">
                Gönder
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
