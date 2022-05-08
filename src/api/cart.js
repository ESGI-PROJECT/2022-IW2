import { createRequest } from "./api.js"

const request = createRequest();

export function addProduct(productId) {
  console.log(productId)
  // return request.post(`/my-cart/${productId}`)
  //   .then(console.log(productId))
  //   .catch(console.error);
}

