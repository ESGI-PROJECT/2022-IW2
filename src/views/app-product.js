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


export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = true;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean },
    };
  }

  async _handleClick() {
    if (NETWORK_STATE) {
      await setRessourceProduct(`${this.product.id}`)
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
      <section class="product">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : '' }" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
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
          <button @click="${this._handleClick}">Add to cart</button>
        </main>
      </section>
    `;
  }
}
customElements.define('app-product', AppProduct);
