import { createRequest } from "./api.js";

const request = createRequest();

export function getProducts() {
  return request
    .get("/products")
    .then(({ data }) => data)
    .catch(console.error);
}

export function setProduct(productId, product) {
  return request
    .patch(`/products/${productId}`, product)
    .then(({ data }) => data)
    .catch(console.error);
}

export function getProduct(productId) {
  return request
    .get(`/products/${productId}`)
    .then(({ data }) => data)
    .catch(console.error);
}
