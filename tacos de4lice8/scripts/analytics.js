/**
 * Delice Tacos - Google Analytics 4 & Consent Manager
 * Gestiona de forma aislada la inyección de GA4, la aceptación de cookies y la medición de eventos.
 */

// Configuración centralizada de analítica (alimentada por config.js o declarada aquí)
const analyticsConfig = {
  measurementId: siteConfig.analyticsId || "[ID GOOGLE ANALYTICS]",
  consentKey: "delice_cookies_consent"
};

// Comprobación de si Analytics está configurado con un ID real
const isAnalyticsEnabled = () => {
  return analyticsConfig.measurementId && 
         analyticsConfig.measurementId !== "[ID GOOGLE ANALYTICS]" && 
         analyticsConfig.measurementId.trim() !== "";
};

// Cargar dinámicamente Google Analytics 4
function loadGA4() {
  if (!isAnalyticsEnabled()) return;

  // Inyectar script gtag.js
  const scriptTag = document.createElement("script");
  scriptTag.async = true;
  scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`;
  document.head.appendChild(scriptTag);

  // Inicializar capa de datos
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  
  gtag('js', new Date());
  // Configuración con modo de consentimiento (consent mode)
  gtag('config', analyticsConfig.measurementId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log(`[Analytics] GA4 inicializado con ID: ${analyticsConfig.measurementId}`);
}

// Función global para disparar eventos personalizados
window.trackEvent = function(eventName, params = {}) {
  const consent = localStorage.getItem(analyticsConfig.consentKey);
  
  // Solo rastrear si se ha aceptado el consentimiento de cookies
  if (consent === "accepted" && typeof gtag === "function" && isAnalyticsEnabled()) {
    gtag("event", eventName, params);
    console.log(`[Analytics Event] ${eventName}`, params);
  } else {
    console.log(`[Analytics Blocked/Skipped] Evento "${eventName}" no enviado. Consentimiento: ${consent}, GA4 Activo: ${typeof gtag === "function"}`);
  }
};

// Gestor del Banner de Cookies
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-consent-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  if (!banner) return;

  const currentConsent = localStorage.getItem(analyticsConfig.consentKey);

  // Si no hay decisión previa, mostrar el banner tras un pequeño retardo
  if (!currentConsent) {
    setTimeout(() => {
      banner.classList.add("show");
    }, 1000);
  } else if (currentConsent === "accepted") {
    // Si ya aceptó anteriormente, cargar analíticas
    loadGA4();
  }

  // Evento Aceptar
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem(analyticsConfig.consentKey, "accepted");
      banner.classList.remove("show");
      loadGA4();
      // Track primer evento de aceptación
      setTimeout(() => {
        trackEvent("cookie_consent_given", { choice: "accepted" });
      }, 500);
    });
  }

  // Evento Rechazar
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      localStorage.setItem(analyticsConfig.consentKey, "rejected");
      banner.classList.remove("show");
      console.log("[Analytics] Cookies rechazadas por el usuario.");
    });
  }
});
