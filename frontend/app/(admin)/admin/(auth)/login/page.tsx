"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPageShell() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#f0eded]">
      <div className="w-full max-w-md bg-[#fcf9f8] rounded-xl shadow-md p-8 border border-[#e5e2e1]">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#442a22]">
            Artisan Woodworks
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#504441] mt-2 font-semibold">
            Yönetim Paneli Giriş Shell
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <Input label="Kullanıcı Adı" type="text" placeholder="admin" />
          <Input label="Şifre" type="password" placeholder="••••••••" />
          <Button variant="primary" type="button" className="w-full py-3">
            Giriş Yap
          </Button>
        </form>
      </div>
    </main>
  );
}
