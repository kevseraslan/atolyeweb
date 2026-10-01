"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { loginAdmin } from "@/features/admin/api";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Lütfen e-posta ve şifrenizi giriniz.");
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(email.trim(), password);
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("E-posta veya şifre hatalı.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#e5e2e1] rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#442a22] text-white font-serif font-bold text-xl rounded flex items-center justify-center mx-auto mb-3">
            AW
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#442a22]">
            Yönetim Paneli Girişi
          </h1>
          <p className="text-xs text-[#827470] mt-1">Yetkili Yönetici Giriş Ekranı</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              E-Posta Adresi
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#504441] mb-1">
              Şifre
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white border border-[#d4c3be] rounded text-sm text-[#1b1c1c] focus:outline-none focus:border-[#442a22]"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 font-semibold"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Yönetim Paneline Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  );
}
