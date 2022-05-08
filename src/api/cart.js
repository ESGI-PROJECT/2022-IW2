import { createRequest } from "./api.js"
import {setCartRessource, setCartRessources, unsetCartRessource} from "../idbHelper";

const request = createRequest();

export function getCartProducts() {
  return request.get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}

export async function setCartProduct(data) {
  let cartProducts = await getCartProducts();
  let updatedCartProducts = cartProducts;
  data.quantity = 1;

  if (cartProducts.length) {
    let added = false;
    cartProducts.forEach( cartProduct => {
      if(cartProduct.id === data.id) {
        let cartProductIndex = cartProducts.findIndex((product => product.id === cartProduct.id));
        updatedCartProducts[cartProductIndex].quantity++;

        added = true;

      }
    })

    if(!added) {
      updatedCartProducts.push(data);
    }

  } else {
    updatedCartProducts = [data];
  }

  await setCartRessources( updatedCartProducts);

  return request.post("/cart", updatedCartProducts)
    .then((result) => console.log(result))
    .catch(console.error);
}

export async function removeCartProduct(product, index) {
  let cartProducts = await getCartProducts();
  cartProducts.splice(index, 1);
  console.log(index);
  await unsetCartRessource(index);

  return request.post("/cart", cartProducts)
    .then((result) => console.log(result))
    .catch(console.error);
}

export async function updateCartProduct(product, index) {
  let cartProducts = await getCartProducts();

  cartProducts[index] = product;
  console.log(index);
  await setCartRessource(product, index);

  return request.post("/cart", cartProducts)
    .then((result) => console.log(result))
    .catch(console.error);
}
