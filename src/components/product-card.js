import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import {getRessource, setRessource} from "../idbHelper";
import {setCart} from "../api/carts";

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
  render() {
    return html`
    <div class="card">
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
            <img
              alt="${this.product.title}"
              src="http://localhost:9000/image/620/${this.product.image}"
              loading="lazy"
              width="1280" height="720">
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
        </main>
     </a>
     <button @click="${this._addToCart}" class="add-cart">Add to cart</button>
     </div>
    `;
  }

  async _addToCart(e) {
    let cart = await getRessource('Carts',"cart");
    console.log(cart.products)
    let exists =  cart.products.find(product => {
      if (product.id === this.product.id) {
        product.quantity++;
        return true;
      }
    });
    if (!exists) {
      this.product.quantity = 1;
      cart.products.push(this.product);
    }
    cart.total += this.product.price;
    cart.total = cart.total._calculTotal ;
    await setRessource('Carts',cart);
    await setCart(cart);
  }

  _calculTotal() {
    Math.round(cart.total * 100) / 100
  }
}
customElements.define('product-card', ProductCard);
