export interface StatusConfig {
  label: string;
  description: string;
  variant: "primary" | "secondary" | "tertiary";
}

export const STATUS_MAP: Record<string, StatusConfig> = {
  RECEIVED: {
    label: "Talebiniz Alındı",
    description: "Sipariş talebiniz atölyemize ulaştı ve incelenmeyi bekliyor.",
    variant: "secondary",
  },
  UNDER_REVIEW: {
    label: "İnceleniyor",
    description: "Atölye ekibimiz ölçü ve teknik detayları değerlendiriyor.",
    variant: "tertiary",
  },
  CONTACTED: {
    label: "İletişime Geçildi",
    description: "Müşteri temsilcimiz teklif detaylarını görüşmek için sizinle iletişime geçti.",
    variant: "primary",
  },
  QUOTED: {
    label: "Teklif Hazırlandı",
    description: "Özel üretim fiyat ve teslimat teklifiniz hazırlandı.",
    variant: "tertiary",
  },
  APPROVED: {
    label: "Onaylandı",
    description: "Teklif onaylandı ve üretime hazırlık süreci başladı.",
    variant: "primary",
  },
  IN_PRODUCTION: {
    label: "Üretimde",
    description: "Masif ahşap mobilyanız atölyemizde ustalarımız tarafından üretiliyor.",
    variant: "primary",
  },
  FINISHING: {
    label: "Son İşlemler",
    description: "Zımpara, cila ve son kalite kontrol detayları uygulanıyor.",
    variant: "tertiary",
  },
  READY: {
    label: "Teslimata Hazır",
    description: "Mobilyanızın üretimi ve kontrolü tamamlandı, teslimat için hazır.",
    variant: "primary",
  },
  DELIVERED: {
    label: "Teslim Edildi",
    description: "Mobilyanız adresinize başarıyla teslim edilmiştir.",
    variant: "primary",
  },
  CANCELLED: {
    label: "İptal Edildi",
    description: "Sipariş talebiniz iptal edilmiştir.",
    variant: "secondary",
  },
};

export function getStatusConfig(statusKey: string): StatusConfig {
  return (
    STATUS_MAP[statusKey] || {
      label: statusKey,
      description: "Sipariş durumu güncellendi.",
      variant: "secondary",
    }
  );
}
