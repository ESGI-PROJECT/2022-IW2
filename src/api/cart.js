import { createRequest } from "./api.js";

const request = createRequest();

export function getCart() {
  return request
    .get("/cart")
    .then(({ data }) => data.body)
    .catch(console.error);
}

export function createCart(cart) {
  return request.post("/cart", { body: cart }).catch(console.error);
}
