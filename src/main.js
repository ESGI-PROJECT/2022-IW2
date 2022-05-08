import page from "page";
import checkConnectivity from "network-latency";
import { getRessource, getRessources, setRessource, setRessources,getShop,setProductInShop} from './idbHelper';
import { getProducts, getProduct } from "./api/products"
import { getCart, setProductInShopApi } from "./api/cart"


(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    interval: 3000,
    threshold: 2000
  });

  function calculTotal(list){
    return list.reduce((sum, i) => {
      return sum + (i.price * i.quantity)
    }, 0)
  }

  async function getDataShop(){
    return await getShop() ?? {
      list_products:[],
      total:0
    }
  }

  async function eventSyncShop(){
    let event = new CustomEvent("syncShop")
    document.dispatchEvent(event)
  }



  

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
  const AppDashbaordPanier = main.querySelector('app-dashboard-panier');
  
  page('*', async (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppDashbaordPanier.active = false;

    let SHOP = await getDataShop()
    skeleton.removeAttribute('hidden');

    document.addEventListener("addProduct", async (event) => {
      event.preventDefault()
      let product = {...event.detail,quantity:1}
      if(SHOP.list_products.some(item => item.id === product.id)){
        let index = SHOP.list_products.findIndex(item => item.id === product.id)
        SHOP.list_products[index].quantity++
      } else{
          SHOP.list_products.push(product)
      }
      SHOP.total = calculTotal(SHOP.list_products);
      SHOP = await setProductInShop(SHOP);
      if(NETWORK_STATE) await setProductInShopApi(SHOP)
      
      await eventSyncShop()
  } )

    document.addEventListener("removeProduct", async (event) => {

      event.preventDefault()
      let id_product = event.detail
      if(SHOP.list_products.some(item => item.id === id_product)){
        SHOP.list_products = SHOP.list_products.filter(item => item.id != id_product);
        SHOP.total = calculTotal(SHOP.list_products);
        SHOP = await setProductInShop(SHOP);
        if(NETWORK_STATE) await setProductInShopApi(SHOP)

      } else{
        console.error("Le produit n'existe pas ")
      }
        await eventSyncShop()
    } )

    document.addEventListener("removeQuantity", async (event) => {
      event.preventDefault()
      let id_product = event.detail
      if(SHOP.list_products.some(item => item.id === id_product)){
        SHOP.list_products = SHOP.list_products.filter((item)=>{
          if(item.id === id_product){
              item.quantity = item.quantity - 1
              if(item.quantity > 0) return item
              return false
          }
          return item
        })
        SHOP.total = calculTotal(SHOP.list_products);
        SHOP = await setProductInShop(SHOP);
        if(NETWORK_STATE) await setProductInShopApi(SHOP)
      } else{
        console.error("Le produit n'existe pas ")
      }
      await eventSyncShop()
    })

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

  page('/panier', async () => {
    await import('./views/app-dashboard-panier');

    let storedShop = await getDataShop()

    
    if (NETWORK_STATE) {
      await setProductInShopApi(storedShop)
    }

    document.addEventListener("syncShop", async (event) => {
      event.preventDefault()
      AppDashbaordPanier.storedShop = await getDataShop()
    })

    AppDashbaordPanier.storedShop = storedShop;
    AppDashbaordPanier.active = true;

    skeleton.setAttribute('hidden', true);
  });

  page();
})(document.querySelector("#app"));