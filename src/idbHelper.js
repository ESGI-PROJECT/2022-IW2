import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const CART_PRODUCTS = "Cart";

export function initDB() {
  return  openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id"
      });
      const cart = db.createObjectStore(CART_PRODUCTS, {
        keyPath: "id"
      });
      cart.createIndex("id", "id");
      cart.createIndex("amount", "amount");
      cart.createIndex("product", "product");

      store.createIndex("id", "id");
      store.createIndex("category", "category");
    }
  });
}

export async function setCart(data = {}) {

  const db = await initDB();
  const tx = db.transaction(CART_PRODUCTS, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(CART_PRODUCTS, "id", data.id);
}

export async function setCarts(data = []) {
  const db = await initDB();
  const tx = db.transaction(CART_PRODUCTS, 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(CART_PRODUCTS, "id");
}

export async function getCart(id) {
  const db = await initDB();
  return db.getAllFromIndex(CART_PRODUCTS, "id");
}

export async function getCarts() {
  const db = await initDB();
  return db.getAllFromIndex(CART_PRODUCTS, "id");
}

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
