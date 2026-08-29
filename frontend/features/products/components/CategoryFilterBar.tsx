"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "../types";

interface CategoryFilterBarProps {
  categories: Category[];
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/urunler?${params.toString()}`);
  };

  return (
    <div className="sticky top-20 z-40 bg-[#fcf9f8]/95 glass-effect py-4 border-b border-[#e5e2e1] mb-12">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 flex items-center justify-between gap-4">
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button
            onClick={() => handleCategorySelect("")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
              activeCategory === ""
                ? "bg-[#442a22] text-white"
                : "border border-[#d4c3be] text-[#504441] hover:border-[#442a22] hover:text-[#442a22]"
            }`}
          >
            Tümü
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                activeCategory === cat.slug
                  ? "bg-[#442a22] text-white"
                  : "border border-[#d4c3be] text-[#504441] hover:border-[#442a22] hover:text-[#442a22]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
