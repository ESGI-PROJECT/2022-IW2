import { createRequest } from "./api.js"

const request = createRequest();

export function getProductsCart() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}


export function addProductCart(data,total){
   
    return request.post("/cart",{
        items: data,
        total: total
    })
    .then(({ data }) => data)
    .catch(console.error);
}

