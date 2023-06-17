const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Verificar si hay un carrito almacenado en localStorage
const storedCart = localStorage.getItem('cart');

// Si hay un carrito almacenado, cargarlo en la variable allProducts
allProducts = storedCart ? JSON.parse(storedCart) : [];

// Funcion para mostrar HTML
const showHTML = () => {
  if (!allProducts.length) {
    cartEmpty.classList.remove('hidden');
    rowProduct.classList.add('hidden');
    cartTotal.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    rowProduct.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
  }

  // Limpiar HTML
  rowProduct.innerHTML = '';

  let total = 0;
  let totalOfProducts = 0;

  allProducts.forEach((product) => {
    const containerProduct = document.createElement('div');
    containerProduct.classList.add('cart-product');

    const factorConversion = product.currency === 'sole' ? 1 : 3.5;
    const convertedPrice = product.currency === 'sole' ? product.price.slice(2) : product.price.slice(1);

    containerProduct.innerHTML = `
      <div class="info-cart-product">
          <span class="cantidad-producto-carrito">${product.quantity}</span>
          <p class="titulo-producto-carrito">${product.title}</p>
          <span class="precio-producto-carrito">${product.price}</span>
      </div>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon-close"
      >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
          />
      </svg>
    `;

    rowProduct.append(containerProduct);
    total += parseInt(product.quantity) * parseFloat(convertedPrice) * factorConversion;
    totalOfProducts += product.quantity;
  });

  valorTotal.innerText = `S/ ${total.toFixed(2)}`;
  countProducts.innerText = totalOfProducts;
};

// Al cargar la página, mostrar el contenido del carrito almacenado en localStorage
window.addEventListener('DOMContentLoaded', () => {
  if (storedCart) {
    showHTML();
  }
});

productsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn')) {
    const product = e.target.closest('.col');
    const infoProduct = {
      quantity: 1,
      title: product.querySelector('h5.card-title').textContent,
      price: product.querySelector('p.card-text').textContent,
      currency: product.querySelector('p').textContent.charAt(0) === '$' ? 'dollar' : 'sole', // Obtener la moneda seleccionada
    };

    const exists = allProducts.some((product) => product.title === infoProduct.title);

    if (exists) {
      allProducts = allProducts.map((product) => {
        if (product.title === infoProduct.title) {
          product.quantity++;
        }
        return product;
      });
    } else {
      allProducts.push(infoProduct);
    }

    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(allProducts));

    showHTML();
  }
});

rowProduct.addEventListener('click', (e) => {
  if (e.target.classList.contains('icon-close')) {
    const product = e.target.parentElement;
    const title = product.querySelector('p').textContent;

    allProducts = allProducts.filter((product) => product.title !== title);

    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(allProducts));

    showHTML();
  }
});
