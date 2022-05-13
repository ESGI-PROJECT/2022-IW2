import { openDB } from "idb";

export const PRODUCT_STORE_NAME = "Products";
export const CART_STORE_NAME = "Cart";

export function initDB() {
  return openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id",
      });
      store.createIndex("id", "id");
      store.createIndex("category", "category");

      db.createObjectStore(CART_STORE_NAME);
    },
  });
}

export async function setRessources(data = []) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  data.forEach((item) => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function setRessource(data = {}) {
  const db = await initDB();
  const tx = db.transaction(PRODUCT_STORE_NAME, "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", data.id);
}

export async function getRessources(store) {
  const db = await initDB();
  return db.getAllFromIndex(store, "id");
}

export async function getRessource(id) {
  const db = await initDB();
  return db.getFromIndex(PRODUCT_STORE_NAME, "id", Number(id));
}

export async function unsetRessource(id) {
  const db = await initDB();
  await db.delete(PRODUCT_STORE_NAME, id);
}

// export async function setRessourcesCart(data = []) {
//   const db = await initDB();
//   const tx = db.transaction(CART_STORE_NAME, "readwrite");
//   data.forEach((item) => {
//     tx.store.put(item);
//   });
//   await tx.done;
//   return db.getAllFromIndex(CART_STORE_NAME, "id");
// }

// export async function addRessourceCart(obj) {
//   const db = await initDB();
//   await db.add(CART_STORE_NAME, obj);
// }

export async function getCartValue(key) {
  return (await initDB()).get(CART_STORE_NAME, key);
}
export async function setCartValue(key, val) {
  return (await initDB()).put(CART_STORE_NAME, val, key);
}
export async function delCartValue(key) {
  return (await initDB()).delete(CART_STORE_NAME, key);
}
export async function clearCart() {
  return (await initDB()).clear(CART_STORE_NAME);
}
export async function getCartKeys() {
  return (await initDB()).getAllKeys(CART_STORE_NAME);
}
