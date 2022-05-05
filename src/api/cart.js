import { createRequest } from "./api";

const res = createRequest();

export const getCartContent = () => {
    return res.get("/cart")
        .then(({ data }) => data)
        .catch(console.error);
}

export const removeCartItem = (id) => {
    return res.delete(`/cart/${id}`, {})
        .then(({ data }) => data)
        .catch(console.error);
}

export const addCart = (item) => {
    return res.post(`/cart/items`, {
        item
    })
        .then(({ data }) => data)
        .catch(console.error);
}

