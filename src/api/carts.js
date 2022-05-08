import { createRequest } from "./api.js"

const request = createRequest();

export function getCart() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}


export function setCart(carts) {
    return request.post("/cart", carts)
        .then(({ data }) => data)
        .catch(console.error);
}