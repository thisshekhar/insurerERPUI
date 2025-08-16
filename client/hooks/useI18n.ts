import { useState, useEffect, createContext, useContext } from "react";

// Translation keys and values
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.customers": "Customers",
    "nav.policies": "Policies",
    "nav.claims": "Claims",
    "nav.agents": "Agents",
    "nav.payments": "Payments",
    "nav.documents": "Documents",
    "nav.settings": "Settings",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle":
      "Welcome back! Here's what's happening with your insurance business today.",
    "dashboard.totalPolicies": "Total Policies",
    "dashboard.premiumCollected": "Premium Collected",
    "dashboard.pendingClaims": "Pending Claims",
    "dashboard.activeAgents": "Active Agents",
    "dashboard.monthlyPerformance": "Monthly Performance",
    "dashboard.topAgents": "Top Performing Agents",
    "dashboard.recentPolicies": "Recent Policies",
    "dashboard.pendingClaimsSection": "Pending Claims",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.status": "Status",
    "common.amount": "Amount",
    "common.date": "Date",
    "common.actions": "Actions",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle":
      "Manage your application preferences and global settings.",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.timezone": "Timezone",
    "settings.darkMode": "Dark Mode",
    "settings.notifications": "Notifications",
    "settings.profile": "Profile",
    "settings.saveChanges": "Save Changes",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.customers": "ग्राहक",
    "nav.policies": "पॉलिसियां",
    "nav.claims": "दावे",
    "nav.agents": "एजेंट",
    "nav.payments": "भुगतान",
    "nav.documents": "दस्तावेज",
    "nav.settings": "सेटिंग्स",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.subtitle":
      "वापसी पर स्���ागत! यहाँ आज आपके बीमा व्यवसाय के साथ क्या हो रहा है।",
    "dashboard.totalPolicies": "कुल पॉलिसियां",
    "dashboard.premiumCollected": "एकत्रित प्रीमियम",
    "dashboard.pendingClaims": "लंबित दावे",
    "dashboard.activeAgents": "सक्रिय एजेंट",

    // Common
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.status": "स्थिति",
    "common.amount": "राशि",
    "common.date": "दिनांक",
    "common.actions": "कार्य",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.subtitle":
      "अपनी एप्लिकेशन प्राथमिकताएं और वैश्विक सेटिंग्स प्रबंधित करें।",
    "settings.language": "भाषा",
    "settings.currency": "मुद्रा",
    "settings.timezone": "समय क्षेत्र",
    "settings.darkMode": "डार्क मोड",
    "settings.notifications": "सूचनाएं",
    "settings.profile": "प्रोफ़ाइल",
    "settings.saveChanges": "परिवर्तन सहेजें",
  },
  es: {
    // Navigation
    "nav.dashboard": "Panel de Control",
    "nav.customers": "Clientes",
    "nav.policies": "Pólizas",
    "nav.claims": "Reclamos",
    "nav.agents": "Agentes",
    "nav.payments": "Pagos",
    "nav.documents": "Documentos",
    "nav.settings": "Configuración",

    // Dashboard
    "dashboard.title": "Panel de Control",
    "dashboard.subtitle":
      "¡Bienvenido! Esto es lo que está pasando con tu negocio de seguros hoy.",
    "dashboard.totalPolicies": "Pólizas Totales",
    "dashboard.premiumCollected": "Prima Recaudada",
    "dashboard.pendingClaims": "Reclamos Pendientes",
    "dashboard.activeAgents": "Agentes Activos",

    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.status": "Estado",
    "common.amount": "Cantidad",
    "common.date": "Fecha",
    "common.actions": "Acciones",

    // Settings
    "settings.title": "Configuración",
    "settings.subtitle":
      "Gestiona tus preferencias de aplicación y configuraciones globales.",
    "settings.language": "Idioma",
    "settings.currency": "Moneda",
    "settings.timezone": "Zona Horaria",
    "settings.darkMode": "Modo Oscuro",
    "settings.notifications": "Notificaciones",
    "settings.profile": "Perfil",
    "settings.saveChanges": "Guardar Cambios",
  },
  ar: {
    // Navigation
    "nav.dashboard": "لوحة القيادة",
    "nav.customers": "العملاء",
    "nav.policies": "الوثائق",
    "nav.claims": "المطالبات",
    "nav.agents": "الوكلاء",
    "nav.payments": "المدفوعات",
    "nav.documents": "المستندات",
    "nav.settings": "الإعدادات",

    // Dashboard
    "dashboard.title": "لوحة القيادة",
    "dashboard.subtitle": "مرحباً بعودتك! إليك ما يحدث مع أعمال التأمين اليوم.",
    "dashboard.totalPolicies": "إجمالي الوثائق",
    "dashboard.premiumCollected": "الأقساط المحصلة",
    "dashboard.pendingClaims": "المطالبات المعلقة",
    "dashboard.activeAgents": "الوكلاء النشطون",

    // Common
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.edit": "تحرير",
    "common.delete": "حذف",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.status": "الحالة",
    "common.amount": "المبلغ",
    "common.date": "التاريخ",
    "common.actions": "الإجراءات",

    // Settings
    "settings.title": "الإعدادات",
    "settings.subtitle": "إدارة تفضيلات التطبيق والإعدادات العامة.",
    "settings.language": "اللغة",
    "settings.currency": "العملة",
    "settings.timezone": "المنطقة الزمنية",
    "settings.darkMode": "الوضع المظلم",
    "settings.notifications": "الإشعارات",
    "settings.profile": "الملف الشخصي",
    "settings.saveChanges": "حفظ التغييرات",
  },
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

// Hook for using internationalization
export function useI18n() {
  const [language, setLanguage] = useState<Language>("en");

  const isRTL = language === "ar";

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  useEffect(() => {
    // Set HTML direction for RTL languages
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return {
    language,
    setLanguage,
    t,
    isRTL,
  };
}

// Currency formatter hook
export function useCurrency() {
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR" | "GBP">(
    "USD",
  );

  const formatCurrency = (amount: number): string => {
    const formatters = {
      USD: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
      INR: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }),
      EUR: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }),
      GBP: new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }),
    };

    return formatters[currency].format(amount);
  };

  return {
    currency,
    setCurrency,
    formatCurrency,
  };
}

// Date formatter hook with timezone support
export function useDateTime() {
  const [timezone, setTimezone] = useState<string>("UTC");

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  return {
    timezone,
    setTimezone,
    formatDate,
    formatDateTime,
  };
}
