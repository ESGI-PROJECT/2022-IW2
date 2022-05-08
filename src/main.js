import page from "page";
import checkConnectivity from "network-latency";
import { getRessource, getRessources, setRessource, setRessources, unsetRessource } from './idbHelper';
import { getProducts, getProduct } from "./api/products"


(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    interval: 3000,
    threshold: 2000
  });

  let NETWORK_STATE = true;

  document.addEventListener('connection-changed', ({ detail: state }) => {
    NETWORK_STATE = state;
    if (NETWORK_STATE) {
      document.documentElement
        .style.setProperty('--app-bg-color', 'royalblue');
    } else {
      document.documentElement
        .style.setProperty('--app-bg-color', '#6e6f72');
    }
  });

  const AppHome = main.querySelector('app-home');
  const AppProduct = main.querySelector('app-product');
  const AppCart = main.querySelector('app-cart');
  let productsStoreName = "Products";
  let cartStoreName = "Cart";

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
      storedProducts = await setRessources(productsStoreName, products);
    } else {
      storedProducts = await getRessources(productsStoreName);
    }

    AppHome.products = storedProducts;
    AppHome.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page('/product/:id', async ({ params }) => {
    await import('./views/app-product');
    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(productsStoreName, product);
    } else {
      storedProduct = await getRessource(productsStoreName, params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page('/add-:id', async ({ params }) => {
    await import('./views/app-product');
    let storedProducts = [];
    let storedCart = [];
    
    if (NETWORK_STATE) {
      const addedProduct = await getProduct(params.id);
      await setRessource(cartStoreName, addedProduct);
      storedProducts = await getRessources(productsStoreName);
      storedCart = await getRessources(cartStoreName);
    } else {
      storedProducts = await getRessources(productsStoreName);
    }

    AppHome.products = storedProducts;
    AppHome.active = true;
    AppCart.cart = storedCart;
    skeleton.setAttribute('hidden', true);
  });

  page('/cart', async () => {
    await import('./views/app-cart');
    let storedCart = [];
    if (NETWORK_STATE) {
      const cart = await getRessources(cartStoreName);
      storedCart = await setRessources(cartStoreName, cart);
    } else {
      storedCart = await getRessources(cartStoreName);
    }

    AppCart.cart = storedCart;
    AppCart.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page('/cart/delete-:id', async ({ params }) => {
    await import('./views/app-cart');

    let storedItem = {};
    if (NETWORK_STATE) {
      const deletedProduct = await unsetRessource(cartStoreName, params.id);
      await setRessources(cartStoreName, deletedProduct);
      storedItem = await getRessources(cartStoreName);
    } else {
      storedItem = await getRessources(cartStoreName);
    }
    AppCart.cart = storedItem;
    AppCart.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page();
})(document.querySelector("#app"));