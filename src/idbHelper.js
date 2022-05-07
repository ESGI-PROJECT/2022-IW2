import { openDB } from "idb";

export const PRODUCT_STORE_NAME = "Products";
export const CART_STORE_NAME = "Cart";

export function initDB() {
  return openDB("Nozama shop 🛍", 1, {
    upgrade(db) {
      const store = db.createObjectStore(PRODUCT_STORE_NAME, {
        keyPath: "id",
      });

      const cart_store = db.createObjectStore(CART_STORE_NAME, {
        autoIncrement: true,
      });

      store.createIndex("id", "id");
      store.createIndex("category", "category");

      cart_store.createIndex("name", "name");
      cart_store.put({
        name: "cart",
        products: [],
        total: 0,
      });
    },
  });
}
export function getCardProduct(cart, id) {
  return cart.products.filter((item) => item.id === id);
}
export async function getRessources(db_name) {
  const db = await initDB();
  return db_name === CART_STORE_NAME
    ? db.getFromIndex(db_name, "name", "cart")
    : db.getAllFromIndex(db_name, "id");
}

export async function getRessource(id, db_name) {
  const db = await initDB();

  if (db_name === CART_STORE_NAME) {
    return db.getFromIndex(db_name, "name", "cart");
  } else {
    return db.getFromIndex(db_name, "id", Number(id));
  }
}

export async function setRessources(data, db_name) {
  const db = await initDB();
  const tx = db.transaction(db_name, "readwrite");
  if (db_name === CART_STORE_NAME) {
    tx.store.put(data);
  } else {
    data.forEach((item) => {
      tx.store.put(item);
    });
  }
  await tx.done;
  return db_name === CART_STORE_NAME
    ? db.getFromIndex(db_name, "name", "cart")
    : db.getAllFromIndex(db_name, "id");
}

export async function setRessource(data = {}, db_name) {
  const db = await initDB();

  if (db_name === CART_STORE_NAME) {
    const res = await db.getFromIndex(db_name, "name", "cart");
    let product = res.products.filter((item) => item.title === data.title);
    if (product.length > 0) {
      res.products = res.products.map((item) => {
        if (item.title === data.title) {
          item.quantity = item.quantity + 1;
        }
        return item;
      });
      res.total = res.total + data.price;
    } else {
      res.products.push(data);
      res.total = res.total + data.price;
    }

    const tx = db.transaction(db_name, "readwrite");
    tx.store.clear();
    tx.store.put(res);
    await tx.done;
  } else {
    const tx = db.transaction(db_name, "readwrite");
    tx.store.put(data);
    await tx.done;
  }

  return db_name === CART_STORE_NAME
    ? db.getFromIndex(db_name, "name", "cart")
    : db.getFromIndex(db_name, "id", data.id);
}

export async function unsetRessource(id, db_name) {
  const db = await initDB();

  if (db_name === CART_STORE_NAME) {
    const res = await db.getFromIndex(db_name, "name", "cart");
    let data = res.products.filter((item) => item.id === id);
    let product = data[0];
    if (data.length > 0) {
      if (product.quantity === 1) {
        //if only one remain remove from store
        res.products = res.products.filter((item) => item.id !== id);
      } else {
        //else reduce the quantity available
        res.products = res.products.map((item) => {
          if (item.id === id) {
            item.quantity = item.quantity - 1;
          }
          return item;
        });
        res.total = res.total - product.price;
      }

      //make a transaction to save
      const tx = db.transaction(db_name, "readwrite");
      tx.store.clear();
      tx.store.put(res);
      await tx.done;
    } else {
      await db.delete(db_name, id);
    }
  }

  return db_name === CART_STORE_NAME
    ? db.getFromIndex(db_name, "name", "cart")
    : db.getAllFromIndex(db_name, "id");
}

export async function deleteRessource(id) {
  const db = await initDB();

  const res = await db.getFromIndex(CART_STORE_NAME, "name", "cart");
  let data = res.products.filter((item) => item.id === id);
  let product = data[0];
  if (data.length > 0) {
    //remove item from store from store
    res.products = res.products.filter((item) => item.id !== id);
    res.total = res.total - product.price * product.quantity;

    //make a transaction to save
    const tx = db.transaction(CART_STORE_NAME, "readwrite");
    tx.store.clear();
    tx.store.put(res);
    await tx.done;
  }

  return db.getFromIndex(CART_STORE_NAME, "name", "cart");
}
