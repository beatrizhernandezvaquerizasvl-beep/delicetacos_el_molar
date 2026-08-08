/**
 * Delice Tacos - Shopping Cart Core Logic
 */

(function() {
  let cart = [];

  // Inicializar el carrito
  function initCart() {
    loadCartFromStorage();
    renderCart();
    setupCartEvents();
    bindAddToCartButtons();
  }

  // Cargar artículos del localStorage
  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem("tacosdelice_cart");
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error al cargar el carrito de localStorage:", e);
      cart = [];
    }
  }

  // Guardar artículos en localStorage
  function saveCartToStorage() {
    try {
      localStorage.setItem("tacosdelice_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error al guardar el carrito en localStorage:", e);
    }
  }

  // Añadir un artículo al carrito
  window.addToCart = function(name, price, variant = "") {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return;

    // Buscar si ya existe el mismo artículo con la misma variante
    const existingIndex = cart.findIndex(item => item.name === name && item.variant === variant);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: name,
        price: numericPrice,
        variant: variant,
        quantity: 1
      });
    }

    saveCartToStorage();
    renderCart();
    openCartDrawer();

    // Feedback visual/sonido sutil si se desea, o evento analytics
    if (typeof trackEvent === "function") {
      trackEvent("add_to_cart", { item_name: name, item_price: numericPrice, item_variant: variant });
    }
  };

  // Actualizar cantidad de un artículo
  function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      saveCartToStorage();
      renderCart();
    }
  }

  // Eliminar un artículo del carrito
  function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    renderCart();
  }

  // Calcular el total
  function calculateTotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Calcular cantidad total de artículos
  function calculateCount() {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  // Renderizar la interfaz del carrito
  function renderCart() {
    const countElement = document.getElementById("cart-count");
    const container = document.getElementById("cart-items-container");
    const emptyMsg = document.getElementById("cart-empty-message");
    const form = document.getElementById("cart-form");
    const footer = document.getElementById("cart-footer");
    const totalPriceElement = document.getElementById("cart-total-price");

    const totalCount = calculateCount();
    
    // Actualizar badge del contador flotante
    if (countElement) {
      countElement.textContent = totalCount;
      countElement.style.display = totalCount > 0 ? "flex" : "none";
    }

    if (totalCount === 0) {
      if (container) container.innerHTML = "";
      if (emptyMsg) emptyMsg.style.display = "block";
      if (form) form.style.display = "none";
      if (footer) footer.style.display = "none";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      if (form) form.style.display = "block";
      if (footer) footer.style.display = "block";

      if (container) {
        container.innerHTML = cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ""}
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-qty">
                <button type="button" class="qty-btn dec-qty" data-id="${item.id}" aria-label="Disminuir cantidad">−</</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn inc-qty" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
              </div>
              <div class="cart-item-price">${formatPriceHelper(item.price * item.quantity)}</div>
              <button type="button" class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar producto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        `).join('');
      }

      if (totalPriceElement) {
        totalPriceElement.textContent = formatPriceHelper(calculateTotal());
      }
    }
  }

  // Abrir y cerrar el drawer del carrito
  function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("cart-open");
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cart-open");
    }
  }

  // Configurar eventos generales del carrito
  function setupCartEvents() {
    const toggleBtn = document.getElementById("cart-toggle-btn");
    const closeBtn = document.getElementById("cart-close-btn");
    const backdrop = document.getElementById("cart-backdrop");
    const container = document.getElementById("cart-items-container");
    const submitBtn = document.getElementById("cart-submit-btn");

    if (toggleBtn) toggleBtn.addEventListener("click", openCartDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
    if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

    // Eventos delegados dentro del contenedor de artículos del carrito
    if (container) {
      container.addEventListener("click", (e) => {
        const decBtn = e.target.closest(".dec-qty");
        const incBtn = e.target.closest(".inc-qty");
        const removeBtn = e.target.closest(".btn-remove-item");

        if (decBtn) {
          updateQuantity(decBtn.dataset.id, -1);
        } else if (incBtn) {
          updateQuantity(incBtn.dataset.id, 1);
        } else if (removeBtn) {
          removeItem(removeBtn.dataset.id);
        }
      });
    }

    // Procesar la compra por Gmail/Email
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const villageSelect = document.getElementById("checkout-village");
        const addressInput = document.getElementById("checkout-address");
        const phoneInput = document.getElementById("checkout-phone");
        const emailInput = document.getElementById("checkout-email");
        const paymentSelect = document.getElementById("checkout-payment");
        const noteTextarea = document.getElementById("checkout-note");

        if (!villageSelect.value) {
          alert("Por favor, selecciona una localidad válida de reparto.");
          villageSelect.focus();
          return;
        }

        if (!addressInput.value.trim()) {
          alert("Por favor, introduce tu dirección completa para la entrega.");
          addressInput.focus();
          return;
        }

        if (!phoneInput.value.trim()) {
          alert("Por favor, introduce tu número de teléfono de contacto.");
          phoneInput.focus();
          return;
        }

        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
          alert("Por favor, introduce una dirección de correo electrónico válida.");
          emailInput.focus();
          return;
        }

        if (!paymentSelect.value) {
          alert("Por favor, selecciona un método de pago.");
          paymentSelect.focus();
          return;
        }

        // Compilar pedido y datos
        const village = villageSelect.value;
        const address = addressInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const payment = paymentSelect.value;
        const note = noteTextarea.value.trim();
        const total = calculateTotal();

        let itemsText = "";
        cart.forEach(item => {
          const variantText = item.variant ? ` (${item.variant})` : "";
          itemsText += `- ${item.quantity}x ${item.name}${variantText} [Precio Unid: ${formatPriceHelper(item.price)}] -> Total: ${formatPriceHelper(item.price * item.quantity)}\n`;
        });

        // Cambiar estado del botón a cargando
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.setAttribute("disabled", "true");
        submitBtn.style.opacity = "0.7";
        submitBtn.innerHTML = `
          <svg class="spinner" viewBox="0 0 50 50" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 80, 200; stroke-dashoffset: 0; animation: spin 1s linear infinite; margin-right: 8px; display: inline-block; vertical-align: middle;">
            <circle cx="25" cy="25" r="20"></circle>
          </svg>
          Enviando pedido...
        `;

        // Datos para FormSubmit.co AJAX
        const payload = {
          _subject: "PEDIDO",
          _captcha: "false",
          _template: "table",
          email: email, // Envía auto-responder copia al cliente
          "Mensaje de Confirmación": "¡Muchas gracias por su pedido! Le avisaremos en breve de cuánto tardará en llegar su comida y nuestro repartidor le llamará cuando esté aproximándose a su dirección.",
          "Detalles del Pedido": itemsText,
          "Localidad de Envío": village,
          "Dirección Completa": address,
          "Teléfono de Contacto": phone,
          "Correo del Cliente": email,
          "Método de Pago": payment,
          "Notas / Comentarios": note ? note : "Ninguna",
          "Importe Total": formatPriceHelper(total)
        };

        // Enviar pedido vía AJAX (Fetch) en segundo plano
        fetch("https://formsubmit.co/ajax/delicetacoselmolar@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (response.ok) {
            alert("¡Pedido recibido con éxito! Tu pedido ha sido enviado directamente a la cocina.");
            
            // Vaciar el carrito
            cart = [];
            saveCartToStorage();
            renderCart();
            closeCartDrawer();
            
            // Resetear el formulario de la interfaz
            villageSelect.value = "";
            addressInput.value = "";
            phoneInput.value = "";
            emailInput.value = "";
            paymentSelect.value = "";
            noteTextarea.value = "";

            if (typeof trackEvent === "function") {
              trackEvent("submit_order_success", { total_amount: total, delivery_village: village });
            }
          } else {
            throw new Error("Respuesta de red no válida.");
          }
        })
        .catch(err => {
          console.error("Error al enviar pedido por API AJAX. Usando alternativa de respaldo:", err);
          alert("Hubo un problema al enviar el pedido de forma automática. Te abriremos tu gestor de correo para que lo envíes manualmente.");
          
          const emailBody = `PEDIDO DE COMIDA A DOMICILIO - DELICE TACOS

--- DETALLES DEL PEDIDO ---
${itemsText}
--- DATOS DE ENTREGA Y PAGO ---
Localidad: ${village}
Dirección exacta: ${address}
Teléfono de contacto: ${phone}
Correo del cliente: ${email}
Método de pago: ${payment}
Nota / Aclaraciones: ${note ? note : "Ninguna"}

--- TOTAL A PAGAR ---
Total del pedido: ${formatPriceHelper(total)}

(Nota: El pago se efectuará en la modalidad seleccionada (${payment}) al repartidor tras la confirmación telefónica o recepción).`;
          
          const mailtoUrl = `mailto:delicetacoselmolar@gmail.com?subject=PEDIDO&body=${encodeURIComponent(emailBody)}`;
          window.location.href = mailtoUrl;
        })
        .finally(() => {
          // Restaurar botón
          submitBtn.removeAttribute("disabled");
          submitBtn.style.opacity = "";
          submitBtn.innerHTML = originalBtnText;
        });
      });
    }
  }

  // Helper para identificar la categoría de un producto
  function getProductCategory(name) {
    if (typeof window.menuData !== "undefined" && window.menuData) {
      for (const cat of window.menuData) {
        const found = cat.products.find(p => p.name === name);
        if (found) return cat.id;
      }
    }
    // Fallback basado en subcadenas
    const lower = name.toLowerCase();
    if (lower.includes("bocadillo") || lower.includes("oriental") || lower.includes("suizo") || lower.includes("mexicano")) return "bocadillos";
    if (lower.includes("shawarma")) return "shawarmas";
    return "";
  }

  // Modal State for Product Customization
  let productModalState = {
    itemName: "",
    itemPrice: 0,
    itemVariant: "",
    category: "",
    selectedSauces: [], // Array de salsas seleccionadas
    selectedDrink: null
  };

  const modalDrinksList = [
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

  const modalSaucesList = [
    "Barbacoa",
    "Argelina",
    "Mayonesa",
    "Ketchup",
    "Blanca",
    "Samurai",
    "Harissa",
    "Biggy",
    "Yoyo",
    "Andaluza",
    "Chili Thai",
    "Brazil"
  ];

  function openDrinkModal(name, price, variant) {
    productModalState.itemName = name;
    productModalState.itemPrice = parseFloat(price);
    productModalState.itemVariant = variant;
    productModalState.category = getProductCategory(name);
    productModalState.selectedSauces = [];
    productModalState.selectedDrink = null;

    const modal = document.getElementById("drink-modal");
    const title = document.getElementById("drink-modal-title");
    
    const saucesContainer = document.getElementById("modal-salsas-container");
    const saucesGrid = document.getElementById("modal-salsas-grid");
    const saucesWarning = document.getElementById("modal-salsas-warning");

    const bebidaContainer = document.getElementById("modal-bebida-container");
    const bebidaGrid = document.getElementById("modal-bebida-grid");
    const bebidaWarning = document.getElementById("modal-bebida-warning");
    const bebidaTitle = document.getElementById("modal-bebida-title");

    // Ocultar avisos iniciales
    if (saucesWarning) saucesWarning.style.display = "none";
    if (bebidaWarning) bebidaWarning.style.display = "none";

    // Determinar necesidades
    const needsSauces = (productModalState.category === "bocadillos" || productModalState.category === "shawarmas");
    const needsBebida = (variant === "Menú" || name === "Bebida");

    if (title) {
      if (name === "Bebida") {
        title.textContent = "Elige tu bebida";
      } else {
        title.textContent = "Personalizar pedido";
      }
    }

    // Renderizar Salsas
    if (needsSauces && saucesContainer && saucesGrid) {
      saucesContainer.style.display = "block";
      saucesGrid.innerHTML = modalSaucesList.map(s => `
        <div class="drink-option-card" data-sauce="${s}">
          ${s}
        </div>
      `).join('');

      const cards = saucesGrid.querySelectorAll(".drink-option-card");
      cards.forEach(card => {
        card.addEventListener("click", () => {
          const sauce = card.dataset.sauce;
          const idx = productModalState.selectedSauces.indexOf(sauce);
          if (idx > -1) {
            productModalState.selectedSauces.splice(idx, 1);
            card.classList.remove("selected");
          } else {
            if (productModalState.selectedSauces.length < 2) {
              productModalState.selectedSauces.push(sauce);
              card.classList.add("selected");
              if (saucesWarning) saucesWarning.style.display = "none";
            }
          }
        });
      });
    } else if (saucesContainer) {
      saucesContainer.style.display = "none";
    }

    // Renderizar Bebida
    if (needsBebida && bebidaContainer && bebidaGrid) {
      bebidaContainer.style.display = "block";
      if (bebidaTitle) {
        bebidaTitle.textContent = name === "Bebida" ? "Elige tu bebida" : "¿Qué bebida quieres con tu menú?";
      }
      bebidaGrid.innerHTML = modalDrinksList.map(d => `
        <div class="drink-option-card" data-drink="${d}">
          ${d}
        </div>
      `).join('');

      const cards = bebidaGrid.querySelectorAll(".drink-option-card");
      cards.forEach(card => {
        card.addEventListener("click", () => {
          cards.forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          productModalState.selectedDrink = card.dataset.drink;
          if (bebidaWarning) bebidaWarning.style.display = "none";
        });
      });
    } else if (bebidaContainer) {
      bebidaContainer.style.display = "none";
    }

    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }
  }

  function closeDrinkModal() {
    const modal = document.getElementById("drink-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
  }

  function setupDrinkModalEvents() {
    const backdrop = document.getElementById("drink-modal-backdrop");
    const closeBtn = document.getElementById("drink-modal-close");
    const submitBtn = document.getElementById("modal-drink-submit-btn");

    if (backdrop) backdrop.addEventListener("click", closeDrinkModal);
    if (closeBtn) closeBtn.addEventListener("click", closeDrinkModal);

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const needsSauces = (productModalState.category === "bocadillos" || productModalState.category === "shawarmas");
        const needsBebida = (productModalState.itemVariant === "Menú" || productModalState.itemName === "Bebida");

        const saucesWarning = document.getElementById("modal-salsas-warning");
        const bebidaWarning = document.getElementById("modal-bebida-warning");

        // Validar salsas obligatorias
        if (needsSauces && productModalState.selectedSauces.length === 0) {
          if (saucesWarning) saucesWarning.style.display = "block";
          return;
        }

        // Validar bebida obligatoria
        if (needsBebida && !productModalState.selectedDrink) {
          if (bebidaWarning) bebidaWarning.style.display = "block";
          return;
        }

        let finalName = productModalState.itemName;
        let finalVariant = productModalState.itemVariant;

        if (finalName === "Bebida") {
          finalName = `${productModalState.selectedDrink} 33 cl`;
          finalVariant = "";
        } else {
          const parts = [];
          if (needsSauces) {
            parts.push(`Salsas: ${productModalState.selectedSauces.join(" y ")}`);
          }
          if (productModalState.itemVariant === "Menú") {
            finalName = `${productModalState.itemName} – Menú`;
            parts.push(`Bebida: ${productModalState.selectedDrink}`);
          } else {
            // Solo
            finalVariant = "Solo";
          }

          if (parts.length > 0) {
            finalVariant = parts.join("\n");
          }
        }

        window.addToCart(finalName, productModalState.itemPrice, finalVariant);
        closeDrinkModal();
      });
    }
  }

  // Delegación de eventos para los botones de "Añadir al carrito" de la carta digital
  function bindAddToCartButtons() {
    const accordion = document.getElementById("menu-accordion");
    if (accordion) {
      accordion.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-add-cart");
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          
          const name = btn.dataset.name;
          const price = btn.dataset.price;
          const variant = btn.dataset.variant || "";

          const category = getProductCategory(name);
          const needsSauces = (category === "bocadillos" || category === "shawarmas");
          const needsBebida = (variant === "Menú" || name === "Bebida");

          // Si requiere algún tipo de configuración (salsas o bebida), abrimos selector
          if (needsSauces || needsBebida) {
            openDrinkModal(name, price, variant);
          } else {
            // Producto normal o Solo
            window.addToCart(name, price, variant);
          }
        }
      });
    }
  }

  // Helper para formatear precios con símbolo de Euro
  function formatPriceHelper(val) {
    if (typeof window.formatPrice === "function") {
      return window.formatPrice(val);
    }
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(2).replace('.', ',');
    return `${formatted} €`;
  }

  // Modificar initCart para configurar el modal de bebidas
  const originalInitCart = initCart;
  initCart = function() {
    originalInitCart();
    setupDrinkModalEvents();
  };

  // Inicializar
  initCart();
})();
