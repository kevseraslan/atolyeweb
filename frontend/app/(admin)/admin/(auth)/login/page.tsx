"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#f0eded]">
      <div className="w-full max-w-md bg-[#fcf9f8] rounded-xl shadow-lg p-8 border border-[#e5e2e1]">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#442a22]">
            Artisan Woodworks
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#504441] mt-2 font-semibold">
            Yönetim Paneli Girişi
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Kullanıcı Adı"
            type="text"
            required
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Şifre"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="primary" type="submit" className="w-full py-4 mt-2">
            Giriş Yap
          </Button>
        </form>
      </div>
    </main>
  );
}
