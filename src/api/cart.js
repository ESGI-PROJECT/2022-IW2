import {createRequest} from "./api.js"

const request = createRequest();


export function updateCart(data) {
    return request.post("/cart", data)
        .then(({data}) => data)
        .catch(console.error);
}