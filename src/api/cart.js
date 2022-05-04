import { createRequest } from "./api.js"

const request = createRequest();


export function addCartProduct(data){
  return request.post("/cart", {data})
    .then(({ data }) => data)
    .catch(console.error);
}

export function getCartProducts() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}