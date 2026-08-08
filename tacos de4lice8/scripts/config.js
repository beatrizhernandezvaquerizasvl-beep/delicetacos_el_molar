/**
 * Delice Tacos - Archivo de Configuración Central
 * Todos los datos editables del negocio, carta y precios se encuentran aquí.
 */

const siteConfig = {
  businessName: "Delice Tacos",
  phone: "+34919405561",
  phoneDisplay: "91 940 55 61",
  phoneLabel: "Delivery y pedidos para recoger",
  address: "Calle Real, nº 22, El Molar, 28710",
  email: "delicetacoselmolar@gmail.com",
  googleMaps: "[ENLACE GOOGLE MAPS]",
  instagram: "https://www.instagram.com/tacos_delice/",
  analyticsId: "[ID GOOGLE ANALYTICS]",
  openingHours: {
    days: "Martes a domingo",
    open: "13:00–01:00",
    close: "01:00",
    closed: "Lunes"
  }
};

const menuConfig = {
  // Configuración de los tacos para el configurador interactivo
  tacos: {
    simple: {
      label: "Simple (1 Carne)",
      meats: 1,
      price: 7.50,
      menuPrice: 9.00
    },
    double: {
      label: "Double (2 Carnes)",
      meats: 2,
      price: 8.50,
      menuPrice: 10.00
    },
    maxi: {
      label: "Maxi (3 Carnes)",
      meats: 3,
      price: 9.50,
      menuPrice: 11.50
    }
  },
  gratinSupplement: 1.00, // Suplemento de gratinado (+1 €)
  
  // Ingredientes disponibles en el configurador
  ingredients: {
    types: [
      { id: "classique", label: "Clásico", desc: "Taco francés tradicional con tortilla tostada, carne, patatas, queso y salsa." },
      { id: "gratine", label: "Gratinado", desc: "Taco francés con acabado gratinado superior (+1 €)." }
    ],
    meats: [
      { id: "shawarma_pollo", label: "Shawarma de pollo" },
      { id: "pollo_tandoori", label: "Pollo tandoori" },
      { id: "pollo_curry", label: "Pollo al curry" },
      { id: "tenders_pollo", label: "Tenders de pollo" },
      { id: "cordon_bleu", label: "Cordon bleu" },
      { id: "carne_picada", label: "Carne picada" },
      { id: "pechuga_pollo", label: "Pechuga de pollo" },
      { id: "nuggets_pollo", label: "Nuggets de pollo" }
    ],
    sauces: [
      { id: "barbacoa", label: "Barbacoa" },
      { id: "sin_salsas", label: "Sin salsa" },
      { id: "argelina", label: "Argelina" },
      { id: "mayonesa", label: "Mayonesa" },
      { id: "ketchup", label: "Kétchup" },
      { id: "blanca", label: "Blanca" },
      { id: "samurai", label: "Samurái" },
      { id: "harissa", label: "Harissa" },
      { id: "biggy", label: "Biggy" },
      { id: "yoyo", label: "Yoyo" },
      { id: "andaluza", label: "Andaluza" },
      { id: "chili_thai", label: "Chili Thai" },
      { id: "brazil", label: "Brazil" }
    ],
    gratins: [
      { id: "cheddar", label: "Cheddar" },
      { id: "emmental", label: "Emmental" },
      { id: "chevre", label: "Chèvre" },
      { id: "raclette", label: "Raclette" },
      { id: "miel", label: "Miel" }
    ]
  }
};

// Base de Datos de la Carta Digital para renderizado dinámico en acordeón
const menuData = [
  {
    id: "tacos",
    title: "Tacos franceses",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M3 12c0 3.3 2.7 6 6 6h6a6 6 0 0 0 6-6M3 12h18"/></svg>`,
    products: [
      {
        name: "El clásico",
        description: "Taco francés tradicional con tortilla tostada, carne, patatas, queso y salsa.",
        prices: { taco: 7.50, menu: 9.00 }
      },
      {
        name: "El gratinado",
        description: "Taco francés con acabado gratinado superior.",
        prices: { taco: 9.50, menu: 11.50 }
      },
      {
        name: "Simple",
        description: "Incluye una carne.",
        prices: { taco: 7.50, menu: 9.00 }
      },
      {
        name: "Double",
        description: "Incluye dos carnes.",
        prices: { taco: 8.50, menu: 10.00 }
      },
      {
        name: "Maxi",
        description: "Incluye tres carnes.",
        prices: { taco: 9.50, menu: 11.50 }
      }
    ],
    note: "El menú incluye patatas fritas y bebida."
  },
  {
    id: "bocadillos",
    title: "Bocadillos",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M3 12h18M6 9l2 6M11 9l2 6M16 9l2 6M3 12c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4s-1.8 4-4 4H7c-2.2 0-4-1.8-4-4z"/></svg>`,
    products: [
      {
        name: "Bocadillo oriental",
        description: "Carne picada, picantes, pimientos y huevo.",
        prices: { solo: 7.50, menu: 9.50 }
      },
      {
        name: "Bocadillo de pollo",
        description: "Pechuga de pollo, ensalada, tomate y cebolla crujiente.",
        prices: { solo: 6.50, menu: 8.50 }
      },
      {
        name: "Bocadillo mexicano",
        description: "Pollo marinado picante, ensalada y pimientos.",
        prices: { solo: 7.50, menu: 9.50 }
      },
      {
        name: "Bocadillo de carne picada",
        description: "Carne picada, hierbas frescas y tomate.",
        prices: { solo: 6.50, menu: 8.50 }
      },
      {
        name: "Bocadillo suizo",
        description: "Pechuga de pollo, ajo, finas hierbas y crema de queso.",
        prices: { solo: 7.50, menu: 9.50 }
      }
    ],
    note: "Menú con patatas fritas y bebida: +2 €"
  },
  {
    id: "paninis",
    title: "Paninis",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M21 7H3v10h18V7zM6 7v10M10 7v10M14 7v10M18 7v10"/></svg>`,
    products: [
      {
        name: "Panini de pollo",
        prices: { solo: 6.00, menu: 8.00 }
      },
      {
        name: "Panini de ternera",
        prices: { solo: 6.00, menu: 8.00 }
      },
      {
        name: "Panini kebab",
        prices: { solo: 6.00, menu: 8.00 }
      },
      {
        name: "Panini triple queso",
        prices: { solo: 6.00, menu: 8.00 }
      }
    ],
    note: "Menú con patatas fritas y bebida: +2 €"
  },
  {
    id: "shawarmas",
    title: "Shawarmas",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M12 2A10 10 0 0 0 2 12c0 2 .6 3.9 1.7 5.5L12 22l8.3-4.5c1.1-1.6 1.7-3.5 1.7-5.5A10 10 0 0 0 12 2zM12 7l3 10M12 7l-3 10"/></svg>`,
    products: [
      {
        name: "Shawarma clásica de pollo",
        description: "Shawarma de pollo servido en formato wrap.",
        prices: { solo: 7.50, menu: 9.50 }
      },
      {
        name: "Bocadillo de shawarma",
        description: "Carne de shawarma servida en pan de bocadillo.",
        prices: { solo: 7.50, menu: 9.50 }
      }
    ],
    note: "Menú con patatas fritas y bebida: +2 €"
  },
  {
    id: "hamburguesas",
    title: "Hamburguesas",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M3 11a9 9 0 0 1 18 0M3 11h18M3 15h18M5 19h14M3 15a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4"/></svg>`,
    products: [
      {
        name: "Hamburguesa de queso",
        description: "Ternera, queso, pepinillos y cebolla.",
        prices: { solo: 6.00, menu: 8.00 }
      },
      {
        name: "Hamburguesa doble queso",
        description: "Dos carnes de ternera, queso, pepinillos y cebolla.",
        prices: { solo: 7.00, menu: 9.00 }
      },
      {
        name: "Hamburguesa mixta de pollo y ternera",
        description: "Filete de pollo, ternera, mezcla de carnes y queso.",
        prices: { solo: 7.50, menu: 9.50 }
      },
      {
        name: "Hamburguesa de bacon",
        description: "Bacon, ternera, queso y cebolla.",
        prices: { solo: 6.50, menu: 8.50 }
      },
      {
        name: "Hamburguesa de pescado",
        description: "Filete de pescado rebozado y salsa tártara.",
        prices: { solo: 6.00, menu: 8.00 }
      },
      {
        name: "Hamburguesa estilo BAP’S",
        description: "Ternera, galleta de patata y salsa.",
        prices: { solo: 7.00, menu: 9.00 }
      }
    ],
    note: "Menú con patatas fritas y bebida: +2 €"
  },
  {
    id: "platos",
    title: "Platos",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><circle cx="12" cy="12" r="9"/><path d="M7 8v5M7 16h0M17 8v8"/></svg>`,
    products: [
      {
        name: "Plato de 1 carne",
        description: "Combinación de una carne, patatas y ensalada.",
        price: 10.00
      },
      {
        name: "Plato de 2 carnes",
        description: "Combinación de dos carnes, patatas y ensalada.",
        price: 13.00
      },
      {
        name: "Plato de 3 carnes",
        description: "Combinación de tres carnes, patatas y ensalada.",
        price: 15.00
      }
    ]
  },
  {
    id: "ensaladas",
    title: "Ensaladas",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M2 12c0 4.4 3.6 8 8 8h4c4.4 0 8-3.6 8-8H2zM12 4c-2 2-2 5-2 8M12 4c2 2 2 5 2 8"/></svg>`,
    products: [
      {
        name: "Ensalada César",
        description: "Lechuga, pollo a la plancha, tomate cherry, picatostes, parmesano y salsa César.",
        price: 9.00
      },
      {
        name: "Ensalada mixta",
        description: "Lechuga, tomate, cebolla, maíz, aceitunas, atún, huevo y zanahoria.",
        price: 9.00
      }
    ]
  },
  {
    id: "infantil",
    title: "Menú infantil",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
    products: [
      {
        name: "5 nuggets + patatas fritas + zumo",
        description: "Cinco nuggets, patatas fritas y zumo.",
        price: 6.00
      },
      {
        name: "Minihamburguesa + patatas fritas + zumo",
        description: "Mini hamburguesa, patatas fritas y zumo.",
        price: 6.00
      }
    ]
  },
  {
    id: "postres",
    title: "Postres",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M20 21v-8a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v8M12 5v5M9 7l3-2 3 2"/></svg>`,
    products: [
      {
        name: "Tiramisú",
        price: 4.00
      },
      {
        name: "Tarta de queso",
        price: 4.00
      },
      {
        name: "Tarta de chocolate",
        price: 3.50
      }
    ]
  },
  {
    id: "bebidas",
    title: "Bebidas",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M7 21h10l1-13H6l1 13zM15 8l1-5M6 8h12"/></svg>`,
    products: [
      {
        name: "Bebida",
        description: "Bebida sola, sin menú: 2,50 €",
        price: 2.50
      }
    ]
  },
  {
    id: "extras",
    title: "Extras",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accordion-category-icon"><path d="M5 10h14l-2 11H7L5 10zM8 10V5M12 10V3M16 10V5"/></svg>`,
    products: [
      {
        name: "Nuggets x5",
        price: 3.00
      },
      {
        name: "Nuggets x10",
        price: 6.00
      },
      {
        name: "Tenders x4",
        price: 5.00
      },
      {
        name: "Tenders x8",
        price: 9.00
      },
      {
        name: "Wings x4",
        price: 5.00
      },
      {
        name: "Wings x6",
        price: 7.00
      },
      {
        name: "Mozzarella sticks x6",
        price: 4.00
      },
      {
        name: "Mozzarella sticks x9",
        price: 6.00
      }
    ]
  }
];

// Asignar explícitamente a window para evitar problemas de ámbito y caché
window.siteConfig = siteConfig;
window.menuConfig = menuConfig;
window.menuData = menuData;
