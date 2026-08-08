/**
 * Delice Tacos - Taco Builder Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Estado actual del configurador
  const builderState = {
    type: "classique", // classique | gratine
    size: "simple",    // simple | double | maxi
    meats: [],         // Array de carnes seleccionadas
    sauces: ["sin_salsas"], // Array de salsas seleccionadas (por defecto Sin salsa)
    gratin: null,      // Acabado gratinado
    modality: "solo"   // solo | menu
  };

  const maxSauces = 2;

  // Base de Datos con las fichas de información oficiales de cada salsa
  const sauceInfo = {
    argelina: {
      name: "Argelina",
      flavor: "Cremosa, ligeramente dulce, especiada y con un toque suave de picante.",
      ingredients: "Aceite de colza, tomate, cebolla, vinagre, yema de huevo, pimiento y chile.",
      allergens: "Contiene huevo y mostaza."
    },
    samurai: {
      name: "Samurái",
      flavor: "Muy cremosa, intensa y picante.",
      ingredients: "Aceite de colza, mostaza, chile, yema de huevo, tomate y paprika.",
      allergens: "Contiene huevo y mostaza.",
      spiceLevel: "Alto"
    },
    biggy: {
      name: "Biggy",
      flavor: "Cremosa, dulce y ligeramente avinagrada, similar a una salsa de hamburguesa.",
      ingredients: "Aceite de colza, pepinillos, mostaza, vinagre, yema de huevo, tomate, cebolla, piña y especias.",
      allergens: "Contiene huevo y mostaza."
    },
    brazil: {
      name: "Brazil",
      flavor: "Dulce, tropical y afrutada, con notas de piña y limón.",
      ingredients: "Aceite de colza, tomate, piña, mostaza, limón, cebolla y especias.",
      allergens: "Contiene huevo y mostaza."
    },
    andaluza: {
      name: "Andaluza",
      flavor: "Cremosa, especiada y ligeramente ácida, con sabor a tomate y hierbas.",
      ingredients: "Aceite de colza, tomate, mostaza, yema de huevo, alcaparras, cebolla, perejil y especias.",
      allergens: "Contiene huevo y mostaza."
    },
    barbacoa: { name: "Barbacoa" },
    mayonesa: { name: "Mayonesa" },
    ketchup: { name: "Kétchup" },
    blanca: { name: "Blanca" },
    harissa: { name: "Harissa" },
    yoyo: {
      name: "Yoyo",
      flavor: "Cremosa, dulce y especiada, con sabor destacado a cebolla y curry.",
      ingredients: "Aceite de colza, cebolla, azúcar, mostaza, especias, tomate y limón.",
      allergens: "Contiene huevo, mostaza y apio."
    },
    chili_thai: { name: "Chili Thai" }
  };

  // Inicializar el configurador
  function initBuilder() {
    renderOptions();
    setupEventListeners();
    updateSummary();
  }

  // Renderizar las opciones desde menuConfig en el DOM
  function renderOptions() {
    // 1. Tipos (Clásico / Gratinado)
    const typeGrid = document.getElementById("builder-type-grid");
    if (typeGrid) {
      typeGrid.innerHTML = menuConfig.ingredients.types.map(t => `
        <div class="option-card ${builderState.type === t.id ? 'selected' : ''}" data-type="type" data-value="${t.id}" role="radio" aria-checked="${builderState.type === t.id}" tabindex="0">
          <div class="option-card-title">${t.label}</div>
          <div class="option-card-desc">${t.desc}</div>
        </div>
      `).join('');
    }

    // 2. Tamaños
    const sizeGrid = document.getElementById("builder-size-grid");
    if (sizeGrid) {
      const isGratin = builderState.type === "gratine";
      const supplement = isGratin ? menuConfig.gratinSupplement : 0;
      sizeGrid.innerHTML = Object.entries(menuConfig.tacos).map(([key, value]) => {
        const displayedPrice = value.price + supplement;
        const displayedMenuPrice = value.menuPrice + supplement;
        return `
          <div class="option-card ${builderState.size === key ? 'selected' : ''}" data-type="size" data-value="${key}" role="radio" aria-checked="${builderState.size === key}" tabindex="0">
            <div class="option-card-title">${value.label}</div>
            <div class="option-card-desc">Hasta ${value.meats} ${value.meats === 1 ? 'carne' : 'carnes'}</div>
            <div class="option-card-price">Taco: ${displayedPrice.toFixed(2)}€ / Menú: ${displayedMenuPrice.toFixed(2)}€</div>
          </div>
        `;
      }).join('');
    }

    // 3. Carnes
    const meatGrid = document.getElementById("builder-meat-grid");
    if (meatGrid) {
      const maxMeats = menuConfig.tacos[builderState.size].meats;
      meatGrid.innerHTML = menuConfig.ingredients.meats.map(m => {
        const isSelected = builderState.meats.includes(m.id);
        const isDisabled = !isSelected && builderState.meats.length >= maxMeats;
        return `
          <div class="option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
               data-type="meat" data-value="${m.id}" role="checkbox" aria-checked="${isSelected}" tabindex="${isDisabled ? '-1' : '0'}">
            <div class="option-card-title">${m.label}</div>
          </div>
        `;
      }).join('');
    }

    // 4. Salsas
    const sauceGrid = document.getElementById("builder-sauce-grid");
    if (sauceGrid) {
      sauceGrid.innerHTML = menuConfig.ingredients.sauces.map(s => {
        const isSelected = builderState.sauces.includes(s.id);
        const isDisabled = !isSelected && builderState.sauces.length >= maxSauces;
        
        // Solo inyectar el botón informativo si la salsa tiene descripción (flavor) en sauceInfo
        const info = sauceInfo[s.id];
        const hasInfo = info && !!info.flavor;
        const infoButtonHTML = hasInfo 
          ? `<button type="button" class="sauce-info-button" data-sauce="${s.id}" aria-label="Información sobre la salsa"><svg class="sauce-info-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></button>`
          : "";

        return `
          <div class="option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
               data-type="sauce" data-value="${s.id}" role="checkbox" aria-checked="${isSelected}" tabindex="${isDisabled ? '-1' : '0'}">
            ${infoButtonHTML}
            <div class="option-card-title">${s.label}</div>
          </div>
        `;
      }).join('');
    }

    // 5. Gratinados (Paso condicional)
    const gratinStep = document.getElementById("builder-step-gratin");
    const gratinGrid = document.getElementById("builder-gratin-grid");
    
    if (gratinStep && gratinGrid) {
      if (builderState.type === "gratine") {
        gratinStep.style.display = "block";
        gratinGrid.innerHTML = menuConfig.ingredients.gratins.map(g => {
          const isSelected = builderState.gratin === g.id;
          return `
            <div class="option-card ${isSelected ? 'selected' : ''}" data-type="gratin" data-value="${g.id}" role="radio" aria-checked="${isSelected}" tabindex="0">
              <div class="option-card-title">${g.label}</div>
              <div class="option-card-price">+${menuConfig.gratinSupplement.toFixed(2)}€</div>
            </div>
          `;
        }).join('');
      } else {
        gratinStep.style.display = "none";
        builderState.gratin = null;
      }
    }

    // 6. Modalidad (Solo / Menú)
    const modalityGrid = document.getElementById("builder-modality-grid");
    if (modalityGrid) {
      modalityGrid.innerHTML = `
        <div class="option-card ${builderState.modality === 'solo' ? 'selected' : ''}" data-type="modality" data-value="solo" role="radio" aria-checked="${builderState.modality === 'solo'}" tabindex="0">
          <div class="option-card-title">Solo Taco</div>
          <div class="option-card-desc">El taco francés preparado individualmente</div>
        </div>
        <div class="option-card ${builderState.modality === 'menu' ? 'selected' : ''}" data-type="modality" data-value="menu" role="radio" aria-checked="${builderState.modality === 'menu'}" tabindex="0">
          <div class="option-card-title">Menú Acompañado</div>
          <div class="option-card-desc">Incluye patatas fritas y bebida en lata</div>
        </div>
      `;
    }
  }

  // Escuchar eventos en las tarjetas y configurar el Tooltip flotante
  function setupEventListeners() {
    const builderContainer = document.getElementById("taco-builder-container");
    if (!builderContainer) return;

    // Crear o recuperar elemento de tooltip con accesibilidad ARIA
    let tooltip = document.getElementById("sauce-tooltip-card");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "sauce-tooltip-card";
      tooltip.className = "sauce-tooltip-card";
      tooltip.setAttribute("role", "dialog");
      tooltip.setAttribute("aria-labelledby", "sauce-tooltip-title");
      tooltip.setAttribute("aria-modal", "false");
      document.body.appendChild(tooltip);
    }

    let pinnedTrigger = null;

    // Helper: Mostrar Tooltip
    function showTooltip(trigger, sauceId) {
      const info = sauceInfo[sauceId];
      if (!info) return;

      let contentHTML = "";
      if (info.flavor) {
        contentHTML = `
          <div class="sauce-tooltip-section">
            <strong>Sabor:</strong>
            <p>${info.flavor}</p>
          </div>
          <div class="sauce-tooltip-section">
            <strong>Ingredientes principales:</strong>
            <p>${info.ingredients}</p>
          </div>
          <div class="sauce-tooltip-section">
            <strong>Alérgenos:</strong>
            <p class="sauce-allergens-text">${info.allergens}</p>
          </div>
        `;
        if (info.spiceLevel) {
          contentHTML += `
            <div class="sauce-tooltip-section">
              <strong>Nivel de picante:</strong>
              <p>${info.spiceLevel}</p>
            </div>
          `;
        }
      } else {
        contentHTML = `
          <div class="sauce-tooltip-section">
            <p class="sauce-pending-text">Información pendiente de confirmar.</p>
          </div>
        `;
      }

      tooltip.innerHTML = `
        <h4 class="sauce-tooltip-title" id="sauce-tooltip-title">${info.name}</h4>
        ${contentHTML}
      `;

      // Forzar layout del navegador para medir el tamaño real del tooltip
      tooltip.style.visibility = "hidden";
      tooltip.classList.add("visible");
      const tooltipHeight = tooltip.offsetHeight || 150;
      const tooltipWidth = tooltip.offsetWidth || 280;
      tooltip.classList.remove("visible");
      tooltip.style.visibility = "";

      // Calcular posiciones de la tarjeta flotante
      const rect = trigger.getBoundingClientRect();
      let top = rect.top + window.scrollY - tooltipHeight - 12;
      let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);

      // Si no cabe arriba, mostrar abajo
      if (top - window.scrollY < 10) {
        top = rect.bottom + window.scrollY + 12;
      }

      // Límites de pantalla laterales
      if (left < 10) {
        left = 10;
      } else if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      
      // Mostrar finalmente
      tooltip.classList.add("visible");
    }

    // Helper: Ocultar Tooltip
    function hideTooltip() {
      tooltip.classList.remove("visible");
    }

    // 1. Delegar clicks en el configurador
    builderContainer.addEventListener("click", (e) => {
      // Click en el icono de información
      const trigger = e.target.closest(".sauce-info-button");
      if (trigger) {
        e.stopPropagation();
        e.preventDefault();

        const sauceId = trigger.dataset.sauce;
        if (pinnedTrigger === trigger) {
          hideTooltip();
          pinnedTrigger = null;
        } else {
          showTooltip(trigger, sauceId);
          pinnedTrigger = trigger;
        }
        return;
      }

      // Click en una opción de tarjeta
      const card = e.target.closest(".option-card");
      if (card && !card.classList.contains("disabled")) {
        handleSelection(card.dataset.type, card.dataset.value);
      }
    });

    // 2. Delegar eventos hover en ordenador para ℹ️
    builderContainer.addEventListener("mouseover", (e) => {
      const trigger = e.target.closest(".sauce-info-button");
      if (trigger && pinnedTrigger === null) {
        showTooltip(trigger, trigger.dataset.sauce);
      }
    });

    builderContainer.addEventListener("mouseout", (e) => {
      const trigger = e.target.closest(".sauce-info-button");
      if (trigger && pinnedTrigger === null) {
        hideTooltip();
      }
    });

    // 3. Cerrar al hacer clic fuera del tooltip o pulsar Escape
    document.addEventListener("click", (e) => {
      if (e.target.closest(".sauce-info-button")) return;
      if (tooltip.classList.contains("visible") && !e.target.closest("#sauce-tooltip-card")) {
        hideTooltip();
        pinnedTrigger = null;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && tooltip.classList.contains("visible")) {
        hideTooltip();
        pinnedTrigger = null;
      }
    });

    // 4. Accesibilidad por teclado en tarjetas
    builderContainer.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        const trigger = e.target.closest(".sauce-info-button");
        if (trigger) {
          e.preventDefault();
          e.stopPropagation();
          trigger.click();
          return;
        }

        const card = e.target.closest(".option-card");
        if (!card || card.classList.contains("disabled")) return;
        
        e.preventDefault();
        handleSelection(card.dataset.type, card.dataset.value);
      }
    });
  }

  // Manejar la selección y actualizar estados
  function handleSelection(type, value) {
    if (type === "type") {
      builderState.type = value;
      triggerAnalytics("change_taco_type", { type: value });
    } 
    else if (type === "size") {
      builderState.size = value;
      const maxMeats = menuConfig.tacos[value].meats;
      if (builderState.meats.length > maxMeats) {
        builderState.meats = builderState.meats.slice(0, maxMeats);
      }
      triggerAnalytics("selection_taco_size", { size: value });
    } 
    else if (type === "meat") {
      const maxMeats = menuConfig.tacos[builderState.size].meats;
      const index = builderState.meats.indexOf(value);
      
      if (index > -1) {
        builderState.meats.splice(index, 1);
      } else if (builderState.meats.length < maxMeats) {
        builderState.meats.push(value);
      }
    } 
    else if (type === "sauce") {
      if (value === "sin_salsas") {
        const index = builderState.sauces.indexOf("sin_salsas");
        if (index === -1) {
          builderState.sauces = ["sin_salsas"];
        }
      } else {
        const sinIndex = builderState.sauces.indexOf("sin_salsas");
        if (sinIndex > -1) {
          builderState.sauces.splice(sinIndex, 1);
        }
        const index = builderState.sauces.indexOf(value);
        if (index > -1) {
          builderState.sauces.splice(index, 1);
        } else if (builderState.sauces.length < maxSauces) {
          builderState.sauces.push(value);
        }
        if (builderState.sauces.length === 0) {
          builderState.sauces = ["sin_salsas"];
        }
      }
    } 
    else if (type === "gratin") {
      builderState.gratin = builderState.gratin === value ? null : value;
    } 
    else if (type === "modality") {
      builderState.modality = value;
      builderState.drink = null; // Limpiar selección al cambiar de modalidad
    }
    else if (type === "drink") {
      builderState.drink = value;
    }

    renderOptions();
    updateSummary();
  }

  // Calcular precio y actualizar resumen visual
  function updateSummary() {
    const sizeData = menuConfig.tacos[builderState.size];
    let totalPrice = builderState.modality === "menu" ? sizeData.menuPrice : sizeData.price;

    const hasGratin = builderState.type === "gratine";
    if (hasGratin) {
      totalPrice += menuConfig.gratinSupplement;
    }

    const typeLabel = menuConfig.ingredients.types.find(t => t.id === builderState.type)?.label || "Clásico";
    const sizeLabel = sizeData.label;
    
    const meatNames = builderState.meats.map(mId => 
      menuConfig.ingredients.meats.find(m => m.id === mId)?.label
    );
    const meatsVal = document.getElementById("sum-meats");
    if (meatsVal) {
      meatsVal.textContent = meatNames.length > 0 ? meatNames.join(", ") : "Selecciona carne(s)";
      meatsVal.className = meatNames.length > 0 ? "summary-item-value" : "summary-item-value placeholder";
    }

    const sauceNames = builderState.sauces.map(sId => 
      menuConfig.ingredients.sauces.find(s => s.id === sId)?.label
    );
    const saucesVal = document.getElementById("sum-sauces");
    if (saucesVal) {
      saucesVal.textContent = sauceNames.length > 0 ? sauceNames.join(", ") : "Selecciona salsas";
      saucesVal.className = sauceNames.length > 0 ? "summary-item-value" : "summary-item-value placeholder";
    }

    const gratinVal = document.getElementById("sum-gratin");
    const gratinRow = document.getElementById("sum-gratin-row");
    if (gratinVal && gratinRow) {
      if (builderState.type === "gratine") {
        gratinRow.style.display = "flex";
        const gratinName = menuConfig.ingredients.gratins.find(g => g.id === builderState.gratin)?.label;
        gratinVal.textContent = gratinName ? `${gratinName} (+${menuConfig.gratinSupplement.toFixed(2)}€)` : "Selecciona gratinado";
        gratinVal.className = gratinName ? "summary-item-value" : "summary-item-value placeholder";
      } else {
        gratinRow.style.display = "none";
      }
    }

    const drinkVal = document.getElementById("sum-drink");
    const drinkRow = document.getElementById("sum-drink-row");
    const drinkWarning = document.getElementById("builder-drink-warning");
    if (drinkVal && drinkRow) {
      if (builderState.modality === "menu") {
        drinkRow.style.display = "flex";
        drinkVal.textContent = builderState.drink ? builderState.drink : "Selecciona bebida";
        drinkVal.className = builderState.drink ? "summary-item-value" : "summary-item-value placeholder";
      } else {
        drinkRow.style.display = "none";
      }
    }

    if (drinkWarning) {
      if (builderState.modality === "menu" && !builderState.drink) {
        drinkWarning.style.display = "block";
      } else {
        drinkWarning.style.display = "none";
      }
    }

    const typeVal = document.getElementById("sum-type");
    if (typeVal) typeVal.textContent = typeLabel;

    const sizeVal = document.getElementById("sum-size");
    if (sizeVal) sizeVal.textContent = sizeLabel;

    const modalityVal = document.getElementById("sum-modality");
    if (modalityVal) modalityVal.textContent = builderState.modality === "menu" ? "Menú (con patatas y bebida)" : "Solo Taco";

    const priceAmount = document.getElementById("builder-total-amount");
    if (priceAmount) {
      priceAmount.textContent = `${totalPrice.toFixed(2)} €`;
    }

    const isReady = builderState.meats.length > 0 && builderState.sauces.length > 0 && 
                    (builderState.type !== "gratine" || builderState.gratin !== null) &&
                    (builderState.modality !== "menu" || builderState.drink !== null);
    
    const addCartBtn = document.getElementById("builder-add-cart-btn");
    if (addCartBtn) {
      if (isReady) {
        addCartBtn.removeAttribute("disabled");
        addCartBtn.style.opacity = "1";
        addCartBtn.style.pointerEvents = "auto";
        
        const gratinName = menuConfig.ingredients.gratins.find(g => g.id === builderState.gratin)?.label || "";
        const meatNamesText = meatNames.join(" y ");
        const sauceNamesText = sauceNames.join(" y ");
        const gratinText = hasGratin && gratinName ? `\nGratinado: ${gratinName}` : '';
        
        let variantText = `Carnes: ${meatNamesText}\nSalsas: ${sauceNamesText}${gratinText}`;
        if (builderState.modality === "menu") {
          variantText += `\nBebida: ${builderState.drink}`;
        }
        
        addCartBtn.dataset.name = `Taco ${builderState.size} – ${builderState.modality === "menu" ? "Menú" : "Solo Taco"}`;
        addCartBtn.dataset.price = totalPrice;
        addCartBtn.dataset.variant = variantText;
      } else {
        addCartBtn.setAttribute("disabled", "true");
        addCartBtn.style.opacity = "0.5";
        addCartBtn.style.pointerEvents = "none";
        addCartBtn.dataset.name = "";
        addCartBtn.dataset.price = "";
        addCartBtn.dataset.variant = "";
      }
    }
  }

  function triggerAnalytics(eventName, params) {
    if (typeof trackEvent === "function") {
      trackEvent(eventName, params);
    }
  }

  const finalBtn = document.getElementById("builder-add-cart-btn");
  if (finalBtn) {
    finalBtn.addEventListener("click", (e) => {
      const name = finalBtn.dataset.name;
      const price = finalBtn.dataset.price;
      const variant = finalBtn.dataset.variant;
      if (name && price) {
        window.addToCart(name, price, variant);
        triggerAnalytics("complete_taco_builder", {
          taco_type: builderState.type,
          taco_size: builderState.size,
          taco_modality: builderState.modality
        });
      }
    });
  }

  // 7. Bebida del Menú (Renderizado Condicional)
  function renderDrinkSelector() {
    const drinkStep = document.getElementById("builder-step-drink");
    const drinkGrid = document.getElementById("builder-drink-grid");
    if (drinkStep && drinkGrid) {
      if (builderState.modality === "menu") {
        drinkStep.style.display = "block";
        const drinks = [
          "Coca-Cola",
          "Fanta Limón",
          "Fanta Naranja",
          "Sprite",
          "Hawaii Tropical",
          "Poms",
          "Aquarius Limón",
          "Aquarius Naranja",
          "Agua"
        ];
        drinkGrid.innerHTML = drinks.map(d => {
          const isSelected = builderState.drink === d;
          return `
            <div class="option-card ${isSelected ? 'selected' : ''}" data-type="drink" data-value="${d}" role="radio" aria-checked="${isSelected}" tabindex="0">
              <div class="option-card-title">${d}</div>
            </div>
          `;
        }).join('');
      } else {
        drinkStep.style.display = "none";
      }
    }
  }

  // Modificar renderOptions original para incluir la llamada al selector de bebida
  const originalRenderOptions = renderOptions;
  renderOptions = function() {
    originalRenderOptions();
    renderDrinkSelector();
  };

  // Inicializar
  if (document.getElementById("taco-builder-container")) {
    initBuilder();
  }
});
