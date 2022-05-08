import { createRequest } from "./api.js"

const request = createRequest();

export function getCart() {
    return request.get("/cart")
        .then(({ data }) => data)
        .catch(console.error);
}

export function setCart(cart) {
    return request.post(`/products/${productId}`)
        .then(({ data }) => data)
        .catch(console.error);
}