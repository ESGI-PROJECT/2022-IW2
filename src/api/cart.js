import { createRequest } from "./api";

const res = createRequest();

export const getCart = () => {
    return res.get("/cart")
        .then(({ data }) => data)
        .catch(console.error);
}

export const removeCartItem = (id) => {
    return res.delete(`/cart`, {})
        .then(({ data }) => data)
        .catch(console.error);
}

export const addCart = (items) => {
    return res.post(`/cart`, {
        items: items,
        total: items.reduce((acc, sum) => {
            acc += (sum.price) * sum.quantity;
            return acc;
        }, 0)
    })
        .then(({ data }) => data)
        .catch(console.error);
}

