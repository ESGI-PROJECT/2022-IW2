import { openDB } from "idb";

export function initDB() {
  return  openDB("Nozama shop 🛍", 3, {
    upgrade(db) {
      const store1 = db.createObjectStore("Products", {
        keyPath: "id"
      });
      const store2 = db.createObjectStore("Cart", {
        keyPath: "id"
      });
      store1.createIndex("id", "id");
      store1.createIndex("category", "category");
      store2.createIndex("id", "id");
      store2.createIndex("category", "category");
    }
  });
}

export async function setRessources(storeName, data = []) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(storeName, 'id');
}

export async function setRessource(storeName, data = {}) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(storeName, 'id', data.id);
}

export async function getRessources(storeName) {
  const db = await initDB();
  return db.getAllFromIndex(storeName, "id");
}

export async function getRessource(storeName, id) {
  const db = await initDB();
  return db.getFromIndex(storeName, "id", Number(id));
}

export async function unsetRessource(storeName, id) {
  const db = await initDB();
  await db.delete(storeName, Number(id));
}
