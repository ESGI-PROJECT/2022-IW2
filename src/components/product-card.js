import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getProductsCart, addProductCart } from '../api/cart';
export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
    }
  }
  firstUpdated() {
    this.querySelector('img').addEventListener('load', () => {
      this.loaded = true;
    });
  }

  async _handleClick() {
    let array = [];
    let total = 0;
    let cart = await getProductsCart();
   
    let found = cart.items.find(element => element.id == this.product.id);

   
    if(typeof(found) == "undefined"){
      this.product.quantity = 1;
      array.push(...cart.items,this.product);
      for (let item of array){
        total += item.price * item.quantity;
      }
      addProductCart(array,total);
    }else{
      cart.items[cart.items.findIndex(element => element.id === this.product.id)].quantity += 1;
      for (let item of cart.items){
        total += item.price * item.quantity;
      }
      addProductCart(cart.items,total);
    }

   
  }
  
  render() {
    return html`
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9001/image/24/${this.product.image})"></div>
            <img
              alt="${this.product.title}"
              src="http://localhost:9001/image/620/${this.product.image}"
              loading="lazy"
              width="1280" height="720">
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
          <button @click="${this._handleClick}">Add to cart</button>
        </main>
  </a>
    `;
  }
}
customElements.define('product-card', ProductCard);
