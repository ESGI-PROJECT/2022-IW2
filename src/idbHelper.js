import { openDB } from "idb";

const PRODUCT_STORE_NAME = "Products";
const SHOP_STORE_NAME = "Shop";

export function initDB() {
  return  openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store_product = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id"
      });

      store_product.createIndex("id", "id");
      store_product.createIndex("category", "category");

      const store_shop = db.createObjectStore(SHOP_STORE_NAME,{
        keyPath: "id"
      });
      store_shop.createIndex("id", "id");
    }
  });
}

//PRODUCT
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

//Shop


export async function getShop() {
  const db = await initDB();
  return await db.getFromIndex(SHOP_STORE_NAME, "id",Number(1));
}

export async function setProductInShop(data = {}) {
  data = {...data,id:1}
  const db = await initDB();
  const tx = db.transaction(SHOP_STORE_NAME, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return await db.getFromIndex(SHOP_STORE_NAME, 'id', 1);
}
