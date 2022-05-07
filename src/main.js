import page from "page";
import checkConnectivity from "network-latency";
import {getLocalCart, getRessource, getRessources, setLocalCart, setRessource, setRessources} from './idbHelper';
import { getProducts, getProduct } from "./api/products"
import {getApiCart, setApiCart} from "./api/cart";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");
  const AppHome = main.querySelector('app-home');
  const AppProduct = main.querySelector('app-product');
  const AppCart = main.querySelector('app-cart');

  checkConnectivity({
    interval: 3000,
    threshold: 2000
  });

  let NETWORK_STATE = true;

  document.addEventListener('connection-changed', async ({ detail: state }) => {
    if (NETWORK_STATE !== state) {
      AppCart.networkState = state;
      AppHome.networkState = state;
      AppProduct.networkState = state;
    }

    // Offline to Online => update cart api with local cart data
    if (!NETWORK_STATE && state) {
      const localCart = await getLocalCart();
      await setApiCart(localCart);
    }

    NETWORK_STATE = state;
    if (NETWORK_STATE) {
      document.documentElement
        .style.setProperty('--app-bg-color', 'royalblue');
    } else {
      document.documentElement
        .style.setProperty('--app-bg-color', '#6e6f72');
    }
  });
  
  page('*', (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;

    skeleton.removeAttribute('hidden');

    next();
  });

  page('/', async () => {
    await import("./views/app-home");
    
    let storedProducts = [];
    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setRessources(products);
    } else {
      storedProducts = await getRessources();
    }

    AppHome.products = storedProducts;
    AppHome.active = true;
    AppHome.networkState = NETWORK_STATE;

    skeleton.setAttribute('hidden', true);
  });

  page('/product/:id', async ({ params }) => {
    await import('./views/app-product');

    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(product);
    } else {
      storedProduct = await getRessource(params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;
    AppProduct.networkState = NETWORK_STATE;

    skeleton.setAttribute('hidden', true);
  });

  page('/cart', async () => {
    await import('./views/app-cart');

    let cart;
    console.log(NETWORK_STATE);
    if (NETWORK_STATE) {
      console.log("online");
      cart = await getApiCart();
      await setLocalCart(cart);
    } else {
      console.log("offline");
      cart = await getLocalCart();
    }

    AppCart.cart = cart;
    AppCart.active = true;
    AppCart.networkState = NETWORK_STATE;

    skeleton.setAttribute('hidden', true);
  })

  page();
})(document.querySelector("#app"));