import checkConnectivity from "network-latency";
import page from "page";
import { createCart, getCart } from "./api/cart";
import { getProduct, getProducts } from "./api/products";
import {
  getLocalCart,
  getLocalProduct,
  getLocalProducts,
  setLocalCart,
  setLocalProduct,
  setLocalProducts,
} from "./idbHelper";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    interval: 3000,
    threshold: 2000,
  });

  let NETWORK_STATE = true;

  document.addEventListener("connection-changed", ({ detail: state }) => {
    NETWORK_STATE = state;
    if (NETWORK_STATE) {
      document.documentElement.style.setProperty("--app-color-blue", "#4169e1");
    } else {
      document.documentElement.style.setProperty("--app-color-blue", "#cccccc");
    }
  });

  const AppHome = main.querySelector("app-home");
  const AppProduct = main.querySelector("app-product");
  const AppCart = main.querySelector("app-cart");

  page("*", (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;

    skeleton.removeAttribute("hidden");

    next();
  });

  page("/", async () => {
    await import("./views/app-home");

    let storedProducts = [];

    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setLocalProducts(products);
    } else {
      storedProducts = await getLocalProducts();
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
      storedProduct = await setLocalProduct(product);
    } else {
      storedProduct = await getLocalProduct(params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page("/cart", async () => {
    await import("./views/app-cart");

    let storedCart = await getLocalCart();

    if (NETWORK_STATE) {
      await createCart(storedCart);

      const cart = await getCart();
      storedCart = await setLocalCart(cart);
    }

    AppCart.cart = storedCart;
    AppCart.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page();
})(document.querySelector("#app"));
