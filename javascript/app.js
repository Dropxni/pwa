const container = document.querySelector(".container");
const listView = document.getElementById("list-view");
const detailView = document.getElementById("detail-view");

const coffees = [
  {
    id: "espresso",
    name: "Espresso",
    image: "images/01-espresso.jpg",
    description: "Café concentrado y de sabor intenso, preparado al pasar agua caliente a presión por el café molido. Es la base de muchas otras bebidas.",
    ingredients: ["Café molido fino", "Agua"],
    prep: "30 segundos"
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    image: "images/02-cappuccino.jpg",
    description: "Equilibrio clásico entre espresso, leche caliente y una capa gruesa de espuma cremosa.",
    ingredients: ["Espresso", "Leche vaporizada", "Espuma de leche"],
    prep: "4 minutos"
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    image: "images/03-iced-coffee.jpg",
    description: "Café frío y refrescante servido sobre hielo, ideal para los días calurosos.",
    ingredients: ["Café", "Hielo", "Leche o azúcar (opcional)"],
    prep: "5 minutos"
  },
  {
    id: "coffee-beans",
    name: "Coffee Beans",
    image: "images/04-coffee-beans.jpg",
    description: "Granos de café tostados, la materia prima de todas las bebidas. Su tueste define el aroma y el sabor final.",
    ingredients: ["Granos de café tostados"],
    prep: "No aplica"
  },
  {
    id: "french-press",
    name: "French Press",
    image: "images/05-french-press.jpg",
    description: "Método de inmersión que extrae un café de cuerpo completo y textura más densa.",
    ingredients: ["Café molido grueso", "Agua caliente"],
    prep: "5 minutos"
  },
  {
    id: "turkish-coffee",
    name: "Turkish Coffee",
    image: "images/06-turkish-coffee.jpg",
    description: "Café finamente pulverizado que se hierve lentamente en una cezve y se sirve sin filtrar.",
    ingredients: ["Café pulverizado", "Agua", "Azúcar (opcional)", "Cardamomo (opcional)"],
    prep: "6 minutos"
  },
  {
    id: "latte-art",
    name: "Latte Art",
    image: "images/07-latte-art.jpg",
    description: "Espresso con leche vaporizada vertida con técnica para dibujar figuras sobre la superficie.",
    ingredients: ["Espresso", "Leche vaporizada"],
    prep: "5 minutos"
  },
  {
    id: "americano",
    name: "Americano",
    image: "images/08-americano.jpg",
    description: "Espresso diluido con agua caliente: más suave y largo, pero con el carácter del espresso.",
    ingredients: ["Espresso", "Agua caliente"],
    prep: "2 minutos"
  },
  {
    id: "pour-over",
    name: "Pour Over",
    image: "images/09-pour-over.jpg",
    description: "Café filtrado que se prepara vertiendo agua caliente poco a poco sobre el café molido. Resulta limpio y aromático.",
    ingredients: ["Café molido medio", "Agua caliente", "Filtro de papel"],
    prep: "4 minutos"
  },
  {
    id: "mocha",
    name: "Mocha",
    image: "images/10-mocha.jpg",
    description: "Combina espresso, chocolate y leche vaporizada, a menudo coronado con crema batida.",
    ingredients: ["Espresso", "Chocolate", "Leche vaporizada", "Crema batida (opcional)"],
    prep: "5 minutos"
  }
];

/* ===== Pantalla 1: lista ===== */
const showCoffees = () => {
  let output = "";
  coffees.forEach(({ id, name, image }) => {
    output += `
      <a class="card" href="#/cafe/${id}" aria-label="Ver detalle de ${name}">
        <img class="card-img" src="${image}" alt="${name}" loading="lazy" decoding="async">
        <div class="card-body">
          <h3 class="card-title">${name}</h3>
        </div>
      </a>
    `;
  });
  container.innerHTML = output;
};

/* ===== Pantalla 2: detalle ===== */
const showDetail = (coffee) => {
  const ingredients = coffee.ingredients
    .map((item) => `<li>${item}</li>`)
    .join("");

  detailView.innerHTML = `
    <article class="detail">
      <a class="back" href="#menu">← Volver al menú</a>
      <img class="detail-img" src="${coffee.image}" alt="${coffee.name}">
      <h2 class="detail-title">${coffee.name}</h2>
      <p class="detail-text">${coffee.description}</p>

      <h3 class="detail-subtitle">Ingredientes</h3>
      <ul class="chips">${ingredients}</ul>

      <p class="detail-meta"><strong>Tiempo de preparación:</strong> ${coffee.prep}</p>
    </article>
  `;
};

/* ===== Enrutador por hash ===== */
const route = () => {
  const match = location.hash.match(/^#\/cafe\/([\w-]+)$/);
  const coffee = match && coffees.find((c) => c.id === match[1]);

  if (coffee) {
    showDetail(coffee);
    listView.hidden = true;
    detailView.hidden = false;
    document.title = `${coffee.name} | Dev Coffee`;
    window.scrollTo(0, 0);
  } else {
    detailView.hidden = true;
    listView.hidden = false;
    document.title = "Dev Coffee";

    // Si la URL apunta a una sección (#menu, #inicio), desplazarse hasta ella
    const target = location.hash.length > 1
      ? document.getElementById(location.hash.slice(1))
      : null;
    if (target) target.scrollIntoView();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  showCoffees();
  route();
});
window.addEventListener("hashchange", route);

/* ===== Service worker ===== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registrado:", reg.scope))
      .catch((err) => console.error("Error al registrar el Service Worker:", err));
  });
}
