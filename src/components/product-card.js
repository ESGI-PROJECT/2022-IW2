import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addProduct } from "../api/cart"
import checkConnectivity from "network-latency";

checkConnectivity({
  interval: 3000,
  threshold: 2000
});

let NETWORK_STATE = true;

document.addEventListener('connection-changed', ({ detail: state }) => {
  NETWORK_STATE = state;
});


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
    if (NETWORK_STATE) {
      await addProduct(`${this.product.id}`)
    }else {
      if (localStorage.getItem('cart') === null) {
        localStorage.setItem('cart', []);
      }

      let cart = localStorage.getItem('cart');

      cart.push(`${this.product.id}`);
      localStorage.setItem('cart', cart);
    }
  }

  render() {
    return html`
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
      <button @click="${this._handleClick}">Add to cart</button>

    `;
  }
}
customElements.define('product-card', ProductCard);