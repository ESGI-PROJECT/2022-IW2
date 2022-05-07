import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const CART_STORE_NAME = "Carts";
const CART_ID = 1;

export function initDB() {
  return  openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const productStore = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id"
      });

      const cartStore = db.createObjectStore(CART_STORE_NAME, {
        keyPath: "id"
      });

      productStore.createIndex("id", "id");
      productStore.createIndex("category", "category");

      cartStore.createIndex("id", "id");
      // Create cart on start
      cartStore.put({
        id: 1,
        products: []
      });
    }
  });
}

/***** PRODUCTS FUNCTIONS *****/
export async function setRessources(data = []) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(PRODUCT_STORE_NAME, 'id');
}

export async function setRessource(data = {}) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(PRODUCT_STORE_NAME, 'id', data.id);
}

export async function getRessources() {
  const db = await initDB();
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function getRessource(id) {
  const db = await initDB();
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", Number(id));
}

export async function unsetRessource(id) {
  const db = await initDB();
  await db.delete(PRODUCT_STORE_NAME, id);
}

/***** CART FUNCTIONS *****/
export async function addProductToCart(newProduct = {}) {
  const db = await initDB();
  let cart = await getLocalCart();
  
  let productAlreadyExist = false;
  cart.products.forEach(product => {
    if (product.id === newProduct.id) {
      productAlreadyExist = true;
      product.quantity += 1;
    }
  })
  
  if (!productAlreadyExist) {
    newProduct.quantity = 1;
    cart.products.push(newProduct);
  }

  // update cart in db
  const tx = db.transaction(CART_STORE_NAME, 'readwrite');
  tx.store.put(cart);
  await tx.done;
  return db.getFromIndex(CART_STORE_NAME, 'id', CART_ID);
}

export async function getLocalCart() {
  const db = await initDB();
  return db.getFromIndex(CART_STORE_NAME, "id", Number(CART_ID));
}

export async function setLocalCart(cart = {}) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE_NAME, 'readwrite');
  tx.store.put(cart);
  await tx.done;
  return db.getFromIndex(CART_STORE_NAME, 'id', CART_ID);
}

export async function removeProductFromCart(productId) {
  const db = await initDB();
  const cart = await getLocalCart();

  for (let i = 0; i < cart.products.length; i++) {
    const product = cart.products[i];

    // Decrease product quantity if the product is more than 1 time in cart
    if (product.id === productId && product.quantity > 1) {
      product.quantity--;
      break;
    }

    // Remove product if the product is only 1 time in cart
    if (product.id === productId && product.quantity <= 1) {
      cart.products.splice(i, 1);
      break;
    }
  }

  // update cart in db
  const tx = db.transaction(CART_STORE_NAME, 'readwrite');
  tx.store.put(cart);
  await tx.done;
  const updatedProduct = cart.products.find(product => product.id === productId);
  return updatedProduct;
}