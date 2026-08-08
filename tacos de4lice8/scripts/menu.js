/**
 * Delice Tacos - Menu Accordion Interaction (Dynamic Digital Menu)
 */

(function() {
  function initMenu() {
    const accordionContainer = document.getElementById("menu-accordion");
    const activeMenuData = window.menuData || (typeof menuData !== "undefined" ? menuData : null);
    const activeSiteConfig = window.siteConfig || (typeof siteConfig !== "undefined" ? siteConfig : null);

    if (!accordionContainer) {
      console.warn("[Menu] Contenedor #menu-accordion no encontrado en el DOM.");
      return;
    }

    if (!activeMenuData) {
      console.warn("[Menu] Objeto menuData no definido. Reintente verificar config.js.");
      return;
    }

    console.log("[Menu] Iniciando renderizado de la carta digital...");

    // 1. Renderizar Dinámicamente la Carta desde el Objeto menuData
    function renderAccordionMenu() {
      accordionContainer.innerHTML = activeMenuData.map(category => {
        // Formatear productos
        const productsHTML = category.products.map(product => {
          const isDoublePrice = !!product.prices;
          
          let priceText = "";
          let rawPrice = 0;
          if (isDoublePrice) {
            const priceSolo = product.prices.taco || product.prices.solo;
            if (category.id === "tacos") {
              priceText = `Taco: ${formatPrice(product.prices.taco)} · Menú: ${formatPrice(product.prices.menu)}`;
            } else {
              priceText = `Solo: ${formatPrice(product.prices.solo)} · Menú: ${formatPrice(product.prices.menu)}`;
            }
          } else if (product.price) {
            if (product.price === "[PRECIO AGUA]") {
              rawPrice = activeSiteConfig && activeSiteConfig.waterPrice !== "[PRECIO AGUA]" ? activeSiteConfig.waterPrice : 2.50;
              priceText = formatPrice(rawPrice);
            } else {
              rawPrice = product.price;
              priceText = formatPrice(rawPrice);
            }
          }

          const priceClass = product.price === "[PRECIO AGUA]" ? "menu-product__price water-price" : "menu-product__price";
          const descriptionHTML = product.description 
            ? `<p class="menu-product__description">${product.description}</p>` 
            : "";

          // Si es la categoría de Tacos Franceses (id === "tacos"), forzar la personalización en el constructor
          if (category.id === "tacos") {
            return `
              <article class="menu-product">
                <div class="menu-product__header">
                  <h3 class="menu-product__name">${product.name}</h3>
                  <div class="menu-product__actions">
                    <span class="menu-product__prices" style="font-size: 0.9rem; color: var(--light-gray); font-weight: 600; margin-right: 12px;">${priceText}</span>
                    <a href="#configurador" class="btn-personalizar-taco" style="color: var(--gold); border: 1px solid var(--gold); padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: var(--transition);">
                      Personalizar
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                  </div>
                </div>
                ${descriptionHTML}
              </article>
            `;
          }

          // Maquetación según si es doble precio o precio simple (con estructura BEM y botones de carrito)
          if (isDoublePrice) {
            const priceSolo = product.prices.taco || product.prices.solo;
            const priceMenu = product.prices.menu;
            const labelSolo = category.id === "tacos" ? "Solo Taco" : "Solo";
            return `
              <article class="menu-product">
                <div class="menu-product__header">
                  <h3 class="menu-product__name">${product.name}</h3>
                  <div class="menu-product__actions">
                    <button type="button" class="btn-add-cart btn-add-cart--double" data-name="${product.name}" data-price="${priceSolo}" data-variant="${labelSolo}">
                      + ${labelSolo === "Solo Taco" ? "Taco" : "Solo"} (${formatPrice(priceSolo)})
                    </button>
                    <button type="button" class="btn-add-cart btn-add-cart--double" data-name="${product.name}" data-price="${priceMenu}" data-variant="Menú">
                      + Menú (${formatPrice(priceMenu)})
                    </button>
                  </div>
                </div>
                ${descriptionHTML}
              </article>
            `;
          } else {
            return `
              <article class="menu-product">
                <div class="menu-product__header">
                  <h3 class="menu-product__name">${product.name}</h3>
                  <div class="menu-product__actions">
                    <span class="${priceClass}">${priceText}</span>
                    <button type="button" class="btn-add-cart btn-add-cart--single" data-name="${product.name}" data-price="${rawPrice}" data-variant="" aria-label="Añadir al carrito">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
                ${descriptionHTML}
              </article>
            `;
          }
        }).join('');

        // Nota opcional de pie de categoría (ej. "Menú con patatas fritas y bebida: +2 €")
        const noteHTML = category.note 
          ? `<div class="accordion-category-note">${category.note}</div>` 
          : "";

        return `
          <div class="accordion-item" id="item-${category.id}">
            <button type="button" class="accordion-trigger" id="trig-${category.id}" 
                    aria-expanded="false" aria-controls="panel-${category.id}">
              <span class="accordion-trigger-center">
                ${category.icon}
                <span class="accordion-title-text">${category.title}</span>
              </span>
              <span class="accordion-indicator" aria-hidden="true">+</span>
            </button>
            <div class="accordion-panel" id="panel-${category.id}" role="region" 
                 aria-labelledby="trig-${category.id}" aria-hidden="true" style="max-height: 0px;">
              <div class="accordion-panel-inner">
                <div class="menu-items-list">
                  ${productsHTML}
                </div>
                ${noteHTML}
              </div>
            </div>
          </div>
        `;
      }).join('');

      setupAccordionEvents();
      console.log("[Menu] Renderizado completado con éxito.");
    }

    // Helper para formatear precios con símbolo de Euro y coma decimal en España
    function formatPrice(val) {
      if (typeof val === "number") {
        const formatted = val % 1 === 0 ? val.toString() : val.toFixed(2).replace('.', ',');
        return `${formatted} €`;
      }
      if (typeof val === "string" && val.includes("€")) {
        return val;
      }
      return val !== "" ? `${val} €` : "";
    }
    window.formatPrice = formatPrice;

    // 2. Configurar eventos de click y accesibilidad en el acordeón
    function setupAccordionEvents() {
      const triggers = accordionContainer.querySelectorAll(".accordion-trigger");

      triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
          const panelId = trigger.getAttribute("aria-controls");
          const panel = document.getElementById(panelId);
          const isExpanded = trigger.getAttribute("aria-expanded") === "true";
          const indicator = trigger.querySelector(".accordion-indicator");

          // Cerrar todos los demás paneles antes de abrir el actual
          if (!isExpanded) {
            triggers.forEach(otherTrigger => {
              if (otherTrigger !== trigger) {
                otherTrigger.setAttribute("aria-expanded", "false");
                otherTrigger.classList.remove("active");
                
                const otherIndicator = otherTrigger.querySelector(".accordion-indicator");
                if (otherIndicator) otherIndicator.textContent = "+";
                
                const otherPanelId = otherTrigger.getAttribute("aria-controls");
                const otherPanel = document.getElementById(otherPanelId);
                if (otherPanel) {
                  otherPanel.style.maxHeight = "0px";
                  otherPanel.setAttribute("aria-hidden", "true");
                }
              }
            });
          }

          // Conmutar el panel actual
          if (isExpanded) {
            // Colapsar
            trigger.setAttribute("aria-expanded", "false");
            trigger.classList.remove("active");
            if (indicator) indicator.textContent = "+";
            panel.style.maxHeight = "0px";
            panel.setAttribute("aria-hidden", "true");
          } else {
            // Desplegar
            trigger.setAttribute("aria-expanded", "true");
            trigger.classList.add("active");
            if (indicator) indicator.textContent = "−";
            panel.setAttribute("aria-hidden", "false");
            
            // Animar altura dinámicamente según contenido interno
            panel.style.maxHeight = panel.scrollHeight + "px";

            // Disparar evento de analítica si está definido
            if (typeof trackEvent === "function") {
              const categoryId = trigger.id.replace("trig-", "");
              trackEvent("view_menu", { category: categoryId });
            }

            // Desplazamiento suave en móviles
            setTimeout(() => {
              const headerHeight = document.getElementById("main-header")?.offsetHeight || 70;
              const offsetPosition = trigger.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }, 150);
          }
        });
      });

      // Control adicional de redimensionamiento de ventana (resize)
      window.addEventListener("resize", () => {
        const openPanels = accordionContainer.querySelectorAll(".accordion-panel[aria-hidden='false']");
        openPanels.forEach(panel => {
          panel.style.maxHeight = panel.scrollHeight + "px";
        });
      });

      // Interceptar clic en personalizar para scroll suave con offset
      accordionContainer.addEventListener("click", (e) => {
        const persBtn = e.target.closest(".btn-personalizar-taco");
        if (persBtn) {
          e.preventDefault();
          const target = document.getElementById("configurador");
          if (target) {
            const headerHeight = document.getElementById("main-header")?.offsetHeight || 70;
            const offsetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }
      });
    }

    renderAccordionMenu();
  }

  // Ejecución segura evitando la condición de carrera del evento DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenu);
  } else {
    initMenu();
  }
})();
