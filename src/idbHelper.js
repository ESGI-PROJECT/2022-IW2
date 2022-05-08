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

      const store_cart = db.createObjectStore(CART_STORE_NAME, {
        keyPath: "id"
      });
      store_cart.createIndex("id", "id");
      store_cart.put({ id: "cart" , products: [] , total: 0});
    }
  });
}


export async function setRessources(name,data = []) {
  const db = await initDB();
  const tx = db.transaction(name, 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(name, 'id');
}

export async function setRessource(name,data = {}) {
  const db = await initDB();
  const tx = db.transaction(name, 'readwrite');
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(name, 'id', data.id);
}

export async function getRessources(name) {
  const db = await initDB();
  return db.getAllFromIndex(name, "id");
}

export async function getRessource(name,id) {
  const db = await initDB();
  if(name === CART_STORE_NAME){
    id = id;
  }else{
    id= Number(id)
  }
  return db.getFromIndex(name, "id", id);
}

export async function unsetRessource(name,id) {
  const db = await initDB();
  await db.delete(name, id);
}
