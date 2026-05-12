const products = [
  {
    name: "Fall Limited Edition Sneakers",
    unitPrice: 125,
    fullImage: "./images/image-product-1.jpg",
    thumbnail: "./images/image-product-1-thumbnail.jpg",
  },
  {
    name: "Fall Limited Edition Sneakers",
    unitPrice: 125,
    fullImage: "./images/image-product-2.jpg",
    thumbnail: "./images/image-product-2-thumbnail.jpg",
  },
  {
    name: "Fall Limited Edition Sneakers",
    unitPrice: 125,
    fullImage: "./images/image-product-3.jpg",
    thumbnail: "./images/image-product-3-thumbnail.jpg",
  },
  {
    name: "Fall Limited Edition Sneakers",
    unitPrice: 125,
    fullImage: "./images/image-product-4.jpg",
    thumbnail: "./images/image-product-4-thumbnail.jpg",
  },
];

const state = {
  activeImageIndex: 0,
  quantity: 0,
  cartQuantity: 0,
};

const mainImage = document.querySelector(".main-product-image");
const mainImageButton = document.querySelector(".main-image-button");
const quantityValue = document.querySelector(".quantity-value");
const quantityButtons = document.querySelectorAll(".quantity-button");
const addToCartButton = document.querySelector(".add-to-cart");
const cartToggle = document.querySelector(".cart-toggle");
const cartPanel = document.querySelector(".cart-panel");
const cartContent = document.querySelector(".cart-content");
const cartCount = document.querySelector(".cart-count");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const primaryNavigation = document.querySelector(".primary-nav");
const overlay = document.querySelector("[data-overlay]");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const previousButtons = document.querySelectorAll(".gallery-nav--previous");
const nextButtons = document.querySelectorAll(".gallery-nav--next");
const thumbnailGroups = document.querySelectorAll(".thumbnail-list");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function setActiveImage(index) {
  state.activeImageIndex = (index + products.length) % products.length;
  const activeProduct = products[state.activeImageIndex];

  mainImage.src = activeProduct.fullImage;
  lightboxImage.src = activeProduct.fullImage;

  thumbnailGroups.forEach((group) => {
    group.querySelectorAll(".thumbnail").forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === state.activeImageIndex;
      thumbnail.classList.toggle("is-active", isActive);
      if (isActive) {
        thumbnail.setAttribute("aria-current", "true");
      } else {
        thumbnail.removeAttribute("aria-current");
      }
    });
  });
}

function changeImage(direction) {
  setActiveImage(state.activeImageIndex + direction);
}

function setQuantity(value) {
  state.quantity = Math.max(0, value);
  quantityValue.textContent = state.quantity;
}

function updateCartBadge() {
  if (state.cartQuantity > 0) {
    cartCount.hidden = false;
    cartCount.textContent = state.cartQuantity;
    cartCount.setAttribute("aria-label", `${state.cartQuantity} items in cart`);
  } else {
    cartCount.hidden = true;
    cartCount.textContent = "0";
    cartCount.setAttribute("aria-label", "0 items in cart");
  }
}

function renderCart() {
  if (state.cartQuantity === 0) {
    cartContent.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    updateCartBadge();
    return;
  }

  const product = products[0];
  const total = product.unitPrice * state.cartQuantity;

  cartContent.innerHTML = `
    <div class="cart-item">
      <img src="${product.thumbnail}" alt="" />
      <div>
        <p class="cart-item-title">${product.name}</p>
        <p class="cart-item-calculation">${formatCurrency(product.unitPrice)} x ${state.cartQuantity} <span class="cart-total">${formatCurrency(total)}</span></p>
      </div>
      <button class="delete-cart-item" type="button" aria-label="Remove item from cart">
        <img src="./images/icon-delete.svg" alt="" aria-hidden="true" />
      </button>
    </div>
    <button class="checkout-button" type="button">Checkout</button>
  `;

  cartContent.querySelector(".delete-cart-item").addEventListener("click", () => {
    state.cartQuantity = 0;
    renderCart();
  });

  updateCartBadge();
}

function openCart() {
  const shouldOpen = cartPanel.hidden;
  cartPanel.hidden = !shouldOpen;
  cartToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function closeCart() {
  cartPanel.hidden = true;
  cartToggle.setAttribute("aria-expanded", "false");
}

function openMenu() {
  primaryNavigation.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  overlay.hidden = false;
  overlay.classList.add("menu-mode");
  document.body.classList.add("no-scroll");
  menuClose.focus();
}

function closeMenu() {
  primaryNavigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  overlay.hidden = true;
  overlay.classList.remove("menu-mode");
  document.body.classList.remove("no-scroll");
}

function openLightbox() {
  if (!window.matchMedia("(min-width: 48rem)").matches) {
    return;
  }

  closeCart();
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
  mainImageButton.focus();
}

thumbnailGroups.forEach((group) => {
  group.addEventListener("click", (event) => {
    const thumbnail = event.target.closest(".thumbnail");
    if (!thumbnail) return;
    setActiveImage(Number(thumbnail.dataset.index));
  });
});

previousButtons.forEach((button) => {
  button.addEventListener("click", () => changeImage(-1));
});

nextButtons.forEach((button) => {
  button.addEventListener("click", () => changeImage(1));
});

quantityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const amount = button.dataset.action === "increase" ? 1 : -1;
    setQuantity(state.quantity + amount);
  });
});

addToCartButton.addEventListener("click", () => {
  if (state.quantity === 0) return;
  state.cartQuantity = state.quantity;
  renderCart();
});

cartToggle.addEventListener("click", openCart);
menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
mainImageButton.addEventListener("click", openLightbox);
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!lightbox.hidden) {
      closeLightbox();
      return;
    }
    if (primaryNavigation.classList.contains("is-open")) {
      closeMenu();
    }
    closeCart();
  }

  if (!lightbox.hidden && event.key === "ArrowLeft") {
    changeImage(-1);
  }

  if (!lightbox.hidden && event.key === "ArrowRight") {
    changeImage(1);
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 48rem)").matches && primaryNavigation.classList.contains("is-open")) {
    closeMenu();
  }
});

renderCart();
setActiveImage(0);
