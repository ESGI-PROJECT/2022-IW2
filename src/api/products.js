import { createRequest } from "./api.js"
import { setCart } from './../idbHelper';

const request = createRequest();

export function getProducts() {
  return request.get("/products")
    .then(({ data }) => data)
    .catch(console.error);
}

export function getProduct(productId) {
  return request.get(`/products/${productId}`)
    .then(({ data }) => data)
    .catch(console.error);
}

export function saveCart(product){
  setCart(product);
}