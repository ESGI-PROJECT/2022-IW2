import page from "page";
import checkConnectivity from "network-latency";
import {
  CART_STORE_NAME,
  getCardProduct,
  getRessource,
  getRessources,
  PRODUCT_STORE_NAME,
  setRessource,
  setRessources,
} from "./idbHelper";
import { getProducts, getProduct, setProduct } from "./api/products";
import { getCart, setCart } from "./api/cart";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    interval: 3000,
    threshold: 2000,
  });

  let NETWORK_STATE = true;

  document.addEventListener("connection-changed", async ({ detail: state }) => {
    NETWORK_STATE = state;
    if (NETWORK_STATE) {
      document.documentElement.style.setProperty("--app-bg-color", "royalblue");
      /*update the json server cart on connection changed to true*/
      const cart = await getRessources(CART_STORE_NAME);
      //update the available quantity at the server as per item purchase
      setCart(cart);
    } else {
      document.documentElement.style.setProperty("--app-bg-color", "#6e6f72");
    }
  });

  const AppHome = main.querySelector("app-home");
  const AppProduct = main.querySelector("app-product");

  const AppCart = main.querySelector("app-cart");
  const AppCartProduct = main.querySelector("app-cart-product");

  page("*", (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;
    AppCartProduct.active = false;

    skeleton.removeAttribute("hidden");

    next();
  });

  page("/", async () => {
    await import("./views/app-home");

    let storedProducts = [];
    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setRessources(products, PRODUCT_STORE_NAME);
    } else {
      storedProducts = await getRessources(PRODUCT_STORE_NAME);
    }

    AppHome.products = storedProducts;
    AppHome.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page("/product/:id", async ({ params }) => {
    await import("./views/app-product");

    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(product, PRODUCT_STORE_NAME);
    } else {
      storedProduct = await getRessource(params.id, PRODUCT_STORE_NAME);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute("hidden", true);
  });

  //cart
  page("/cart", async () => {
    await import("./views/app-cart");
    let cart = [];

    if (NETWORK_STATE) {
      cart = await getCart();
    } else {
      cart = await getRessources(CART_STORE_NAME);
    }

    AppCart.products = cart.products;
    AppCart.active = true;
    skeleton.setAttribute("hidden", true);
  });

  //cart product
  page("/cart/product/:id", async ({ params }) => {
    await import("./views/app-cart-product");
    let cart = {};

    if (NETWORK_STATE) {
      cart = await getCart();
    } else {
      cart = await getRessources(CART_STORE_NAME);
    }

    AppCartProduct.product = getCardProduct(cart, Number(params.id))[0];
    AppCartProduct.active = true;
    skeleton.setAttribute("hidden", true);
  });

  page();
})(document.querySelector("#app"));
