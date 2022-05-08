import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const CART_STORE_NAME = "Cart";
const CART_STORE_ID = 1;
export const INITIAL_CART = { products: [], totalPrice: 0, id: CART_STORE_ID };

export function initDB() {
  return openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const productStore = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id",
      });

      productStore.createIndex("id", "id");
      productStore.createIndex("category", "category");

      db.createObjectStore(CART_STORE_NAME, { keyPath: "id" });
    },
  });
}

export async function setLocalProducts(data = []) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  data.forEach((item) => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function setLocalProduct(data = {}) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", data.id);
}

export async function getLocalProducts() {
  const db = await initDB();
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function getLocalProduct(id) {
  const db = await initDB();
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", Number(id));
}

export async function deleteLocalProduct(id) {
  const db = await initDB();
  await db.delete(PRODUCT_STORE_NAME, id);
}

export async function getLocalCart() {
  const db = await initDB();
  const cart = await db.get(CART_STORE_NAME, CART_STORE_ID);
  return cart || INITIAL_CART;
}

export async function setLocalCart(cart = INITIAL_CART) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE_NAME, "readwrite");
  tx.store.put(cart);
  await tx.done;
  return db.get(CART_STORE_NAME, CART_STORE_ID);
}

async function updateCart(product = {}, getProducts) {
  const db = await initDB();
  const cart = (await db.get(CART_STORE_NAME, CART_STORE_ID)) || INITIAL_CART;

  const products = getProducts(cart.products, product).filter(
    ({ quantity }) => quantity > 0
  );

  const totalPrice = products.reduce((prev, curr) => prev + curr.totalPrice, 0);

  const tx = db.transaction(CART_STORE_NAME, "readwrite");

  tx.store.put({ products, totalPrice, id: CART_STORE_ID });

  await tx.done;

  return db.get(CART_STORE_NAME, CART_STORE_ID);
}

function updateCartProductCallback(cartProducts, product) {
  const { productId, price, quantity } = product;
  const totalPrice = price * quantity;

  const isProductInCart =
    cartProducts
      .map(({ productId }) => productId)
      .indexOf(product.productId) !== -1;

  if (isProductInCart) {
    return cartProducts.map((product) => {
      if (product.productId === productId) {
        return {
          ...product,
          totalPrice: product.totalPrice + totalPrice,
          quantity: product.quantity + quantity,
        };
      }

      return product;
    });
  }

  return [...cartProducts, { ...product, totalPrice }];
}

function setCartProductCallback(cartProducts, product) {
  const { productId, price, quantity } = product;

  return cartProducts.map((cartProduct) => {
    if (cartProduct.productId === productId) {
      return {
        ...cartProduct,
        ...product,
        totalPrice: price * quantity,
      };
    }

    return cartProduct;
  });
}

export async function updateCartProduct(product) {
  return updateCart(product, updateCartProductCallback);
}

export async function setCartProduct(product) {
  return updateCart(product, setCartProductCallback);
}
