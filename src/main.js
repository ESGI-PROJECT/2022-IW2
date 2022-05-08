import page from "page";
import checkConnectivity from "network-latency";
import { getRessource, getRessources, setRessource, setRessources } from './idbHelper';
import { getProducts, getProduct } from "./api/products";
import { getCart, setCart } from "./api/cart";


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

      getRessource('Cart', 1).then((cart) => {
        setCart(cart)
      }).catch(() => { })

    } else {
      document.documentElement
        .style.setProperty('--app-bg-color', '#6e6f72');
    }
  });

  const AppHome = main.querySelector('app-home');
  const AppCart = main.querySelector('app-cart');
  const AppProduct = main.querySelector('app-product');

  page('*', (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;

    skeleton.removeAttribute('hidden');

    getRessource('Cart', 1).then((cart) => {
      setCart(cart)
    }).catch(() => { })

    next();
  });

  page('/', async () => {
    await import("./views/app-home");

    let storedProducts = [];
    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setRessources("Products", products);
    } else {
      storedProducts = await getRessources("Products");
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
      storedProduct = await setRessource("Products", product);
    } else {
      storedProduct = await getRessource("Products", params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page('/cart', async () => {
    await import('./views/app-cart');

    let cart = {};
    if (NETWORK_STATE) {
      const addedProducts = await getCart();
      cart = await setRessource("Cart", addedProducts);
    } else {
      cart = await getRessource("Cart", 1);
    }

    console.log(cart);

    AppCart.products = cart.products;
    AppCart.total = cart.total;
    AppCart.active = true;


    skeleton.setAttribute('hidden', true);
  });

  page();
})(document.querySelector("#app"));