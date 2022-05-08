import { createRequest } from "./api.js"

const request = createRequest();

export function getCart() {
  return request.get("/chart")
    .then(({ data }) => data)
    .catch(console.error);
}

