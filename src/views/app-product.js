import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import {getRessourceCart, setRessourceCart} from "../idbHelper";
import {setCart} from "../api/cart";

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
        </main>
        <footer>
          <button @click="${this._addToCart}">🛒</button>
        </footer>
      </section>`;
  }

  async _addToCart(e) {
    let cart = await getRessourceCart();
    let exists = cart.products.find(product => {
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
    cart.total = Math.round(cart.total * 100) / 100;
    await setRessourceCart(cart);
    await setCart(cart);
  }
}
customElements.define('app-product', AppProduct);
