import { openDB } from "idb";
import { setTotal } from "./api/cart";

export function initDB() {
    return openDB("Nozama shop 🛍", 1, {
        upgrade(db) {
            const products = db.createObjectStore("Products", {
                keyPath: "id"
            });

            products.createIndex("id", "id");
            products.createIndex("category", "category");

            const cart = db.createObjectStore("Cart", {
                keyPath: "id"
            });

            cart.createIndex("id", "id");
            cart.put({ id: 1, products: [], total: 0 });
        }
    });
}

export async function setRessources(store, data = []) {
    const db = await initDB();
    const tx = db.transaction(store, 'readwrite');
    data.forEach(item => {
        tx.store.put(item);
    });
    await tx.done;
    return db.getAllFromIndex(store, 'id');
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

export async function getRessources(store) {
    const db = await initDB();
    return db.getAllFromIndex(store, "id");
}

export async function getRessource(store, id) {
    const db = await initDB();
    return db.getFromIndex(store, "id", Number(id));
}

export async function unsetRessource(store, id) {
    const db = await initDB();
    await db.delete(store, id);
}