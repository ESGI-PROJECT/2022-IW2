import {openDB} from "idb";

export function initDB() {
    return openDB("Nozama shop 🛍", 1, {
        upgrade(db) {
            const store = db.createObjectStore("Products", {
                keyPath: "id"
            });
            store.createIndex("id", "id");
            store.createIndex("category", "category");

            const cartStore = db.createObjectStore('Cart', {
                keyPath: 'id'
            })
            cartStore.createIndex("id", "id");
        }
    });
}

export async function setRessources(store, data = []) {
    const db = await initDB();
    const tx = db.transaction(store, 'readwrite');
    data.forEach(item => tx.store.put(item));
    await tx.done;
    return db.getAllFromIndex(store, 'id');
}

export async function setRessource(store, data = {}) {
    const db = await initDB();
    const tx = db.transaction(store, 'readwrite');
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