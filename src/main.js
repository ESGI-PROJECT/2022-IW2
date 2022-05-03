import page from "page";
import { getProducts, getProduct } from "./api/products"


(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  const AppHome = main.querySelector('app-home');
  const AppProduct = main.querySelector('app-product');
  
  page('*', (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;

    skeleton.removeAttribute('hidden');

    next();
  });

  page('/', async () => {
    await import("./views/app-home");
    const products = await getProducts();
    AppHome.products = products;
    AppHome.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page('/product/:id', async ({ params }) => {
    await import('./views/app-product');
    const product = await getProduct(params.id);

    AppProduct.product = product;
    AppProduct.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page();
})(document.querySelector("#app"));