import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const CART_STORE_NAME = "Carts";

export function initDB() {
  return  openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id"
      });

      store.createIndex("id", "id");
      store.createIndex("category", "category");

      const cart = db.createObjectStore(CART_STORE_NAME, {
        keyPath: "id"
      });

      cart.createIndex("id", "id");
    }
  });
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

export async function setCartRessources(data = []) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE_NAME, 'readwrite');
  console.log(data);
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(CART_STORE_NAME, 'id');
}

export async function setCartRessource(data = {}, index) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE_NAME, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(CART_STORE_NAME, 'id', index);
}

export async function getCartRessources() {
  const db = await initDB();
  return db.getAllFromIndex(CART_STORE_NAME, "id");
}

export async function getCartRessource(id) {
  const db = await initDB();
  return db.getFromIndex(CART_STORE_NAME, "id", Number(id));
}

export async function unsetCartRessource(id) {
  const db = await initDB();
  await db.delete(CART_STORE_NAME, id);
}
