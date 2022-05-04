import page from "page";
import checkConnectivity from "network-latency";
import {getCartItems, getRessource, getRessources, setRessource, setRessources} from './idbHelper';
import { getProducts, getProduct } from "./api/products"
import {getCartProducts} from "./api/cart";


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

    skeleton.setAttribute('hidden', true);
  });

  page('/cart', async () => {
    await import("./views/app-cart");

    let storedProductsIds = [];
    if (NETWORK_STATE) {
      // const products = await getProducts();
      storedProductsIds = await getCartItems();
    } else {
      storedProductsIds = await getCartItems();
    }

    const storedProducts = await Promise.all(
        storedProductsIds.map(
            (cart_item) => getRessource(cart_item.product_id)
        )
    )

    AppCart.active = true;
    AppCart.products = storedProducts
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

    skeleton.setAttribute('hidden', true);
  });

  page();
})(document.querySelector("#app"));