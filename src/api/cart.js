import { createRequest } from "./api.js"

const request = createRequest();

export async function getCart() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}

export async function setProductInShopApi(shop) {
    return request.post(`/cart`,shop)
    .then(({ data }) => data)
    .catch(console.error);
}

