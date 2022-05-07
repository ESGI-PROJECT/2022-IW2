import { createRequest } from "./api.js"

const request = createRequest();

export function getApiCart() {
    return request.get("/cart")
        .then(({ data }) => data)
        .catch(console.error);
}

export function setApiCart(cart) {
    return request.put(`/cart`, cart)
        .then(({ data }) => data)
        .catch(console.error);
}

