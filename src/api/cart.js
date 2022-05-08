import { createRequest } from "./api.js"

const request = createRequest();

export function getCart() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}

export function setCart(cart) {
  return request.post("/cart", cart)
    .then(({ data }) => data)
    .catch(console.error);
}

export function setTotal(cart) {
  cart.total = (Math.round((
    cart.products.reduce(
      (acc, product) => { return acc += product.price * product.quantity }, 0)
    + Number.EPSILON) * 100) / 100).toFixed(2);

  return cart;
}