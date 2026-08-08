/**
 * Delice Tacos - Main Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cabecera Sticky (Reducción de tamaño y sombra al hacer scroll)
  const header = document.getElementById("main-header");
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Ejecutar en carga inicial por si hay scroll previo

  // 2. Control del Drawer Lateral (Panel de 3 Puntos)
  const drawer = document.getElementById("drawer-menu");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const drawerTrigger = document.getElementById("drawer-trigger");
  const drawerClose = document.getElementById("drawer-close");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openDrawer() {
    drawer.classList.add("open");
    drawerOverlay.classList.add("visible");
    document.body.style.overflow = "hidden"; // Evita scroll de fondo
    drawerClose.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("visible");
    document.body.style.overflow = ""; // Restaura scroll
    drawerTrigger.focus();
  }

  if (drawerTrigger && drawerClose && drawerOverlay) {
    drawerTrigger.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);

    // Cerrar al clickar en un enlace del panel
    drawerLinks.forEach(link => {
      link.addEventListener("click", closeDrawer);
    });

    // Cerrar al pulsar Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        closeDrawer();
      }
    });
  }

  // 4. Inyección dinámica de variables de configuración (config.js) en el DOM
  injectConfigToDOM();

  function injectConfigToDOM() {
    if (typeof siteConfig === "undefined") return;

    // Número de teléfono en enlaces tel:
    const telElements = document.querySelectorAll(".phone-link");
    telElements.forEach(el => {
      el.href = `tel:${siteConfig.phone}`;
      // Si el elemento no tiene texto modificado, poner el número formateado
      if (el.classList.contains("phone-text") && el.textContent.includes("[NÚMERO DE TELÉFONO]")) {
        el.textContent = siteConfig.phone;
      }
    });

    // Textos de dirección
    const addressElements = document.querySelectorAll(".address-text");
    addressElements.forEach(el => {
      if (el.textContent.includes("[DIRECCIÓN COMPLETA]")) {
        el.textContent = siteConfig.address;
      }
    });

    // Enlaces de Google Maps
    const mapsElements = document.querySelectorAll(".maps-link");
    mapsElements.forEach(el => {
      el.href = siteConfig.googleMaps;
    });

    // Enlaces de redes sociales
    const instagramElements = document.querySelectorAll(".instagram-link");
    instagramElements.forEach(el => {
      el.href = siteConfig.instagram;
    });
  }

  // 5. Medición de Clicks en Redes, Llamadas y Maps (GA4)
  setupInteractionTracking();

  function setupInteractionTracking() {
    // Interceptar llamadas
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
      el.addEventListener("click", () => {
        // Si viene del configurador, podemos pasar el detalle del taco
        const orderDetail = el.dataset.order || "";
        trackEvent("click_call", { 
          source: el.id || "general",
          order_summary: orderDetail 
        });
      });
    });

    // Interceptar Google Maps
    document.querySelectorAll(".maps-link").forEach(el => {
      el.addEventListener("click", () => {
        trackEvent("click_maps", { destination: "el_molar" });
      });
    });

    // Interceptar Instagram
    document.querySelectorAll(".instagram-link").forEach(el => {
      el.addEventListener("click", () => {
        trackEvent("click_instagram", { handle: "delicetacos" });
      });
    });

    // Tracking de accesos rápidos
    document.querySelectorAll(".shortcut-card").forEach(el => {
      el.addEventListener("click", () => {
        const title = el.querySelector(".shortcut-title")?.textContent || "";
        trackEvent("click_shortcut", { section: title.trim().toLowerCase() });
      });
    });
  }
});
