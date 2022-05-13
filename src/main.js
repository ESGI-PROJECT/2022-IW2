import page from "page";
import checkConnectivity from "network-latency";
import {
  getCartKeys,
  getCartValue,
  getRessource,
  getRessources,
  setCartValue,
  setRessource,
  setRessources,
} from "./idbHelper";
import { getProducts, getProduct, getCart } from "./api/products";
import { AppCart } from "./views/app-cart";
import { PRODUCT_STORE_NAME, CART_STORE_NAME } from "./idbHelper";

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
      document.documentElement.style.setProperty("--app-bg-color", "royalblue");
    } else {
      document.documentElement.style.setProperty("--app-bg-color", "#6e6f72");
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
      storedProducts = await setRessources(products);
    } else {
      storedProducts = await getRessources(PRODUCT_STORE_NAME);
    }

    AppHome.products = storedProducts;
    AppHome.active = true;
    AppHome.location = "home";

    skeleton.setAttribute("hidden", true);
  });

  page("/cart", async () => {
    await import("./views/app-cart");

    let storedCart = [];
    let storedTotalPrice = 0;
    if (NETWORK_STATE) {
      // const cart = await getCart();
      // check if articles exist before trying to add some obj, if not, add key "articles"
      getCartKeys()
        .then((res) => {
          if (!res.includes("articles")) setCartValue("articles", []);
          if (!res.includes("total")) setCartValue("total", 0);
        })
        .catch((err) => console.error(err));
      storedCart = await getCartValue("articles");
      storedTotalPrice = await getCartValue("total");
      console.log(
        "%cmain.js line:84 storedTotalPrice",
        "color: #007acc;",
        storedTotalPrice
      );
      // // } else {
      // storedCart = await getRessources(CART_STORE_NAME);
    }

    AppCart.cart = storedCart;
    AppCart.totalPrice = storedTotalPrice.toFixed(2);
    AppCart.location = "cart";
    AppCart.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page("/product/:id", async ({ params }) => {
    await import("./views/app-product");

    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(product);
    } else {
      storedProduct = await getRessource(params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute("hidden", true);
  });

  page();
})(document.querySelector("#app"));
