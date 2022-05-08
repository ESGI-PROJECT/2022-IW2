import { openDB } from "idb";
import { setTotal } from "./api/api";

const PRODUCT_STORE_NAME = "Products";
const CART = "Cart";

export function initDB() {
  return  openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id"
      });

      store.createIndex("id", "id");
      store.createIndex("category", "category");

      const cart = db.createObjectStore(CART, {
        keyPath: "id"
      });

      cart.createIndex("id", "id");
      cart.put({ id: 1, products: [], totalPrice: 0 });

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

export async function getRessources() {
  const db = await initDB();
  return db.getAllFromIndex(PRODUCT_STORE_NAME, "id");
}

export async function getRessource(store, id) {
  const db = await initDB();
  return db.getFromIndex(store, "id", Number(id));
}

export async function unsetRessource(store ,id) {
  const db = await initDB();
  await db.delete(store, id);
}

export async function setRessource(store, data = {}) {
  const db = await initDB();
  const tx = db.transaction(store, 'readwrite');
  if (store == 'Cart') {
      setTotal(data);
  }
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(store, 'id', data.id);
}