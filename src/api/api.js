import axios from 'redaxios';

export function createRequest() {
  return axios.create({
    baseURL: "https://fakestoreapi.com"
  });
}