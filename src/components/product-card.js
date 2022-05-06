import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getRessourceCart, setRessourceCart } from './../idbHelper';
import { setCart, getCart } from "./../api/cart"

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
    this.networkState = true;

  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
      networkState: { type: Boolean }
    }
  }
  firstUpdated() {
    this.querySelector('img').addEventListener('load', () => {
      this.loaded = true;
    });
  }
  render() {
    return html`
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: http://localhost:9000/image/24/url(${this.product.image})"></div>
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
        <p><button data-itemid="${this.product.id}"  @click="${this._increment}" >Add To Cart</button></p>

    `;
  }

  async _increment(e) {

    let ressourceCart = await getRessourceCart();

    // add product and his quantity
    let findItemExist = ressourceCart.items.find(item => {
      if (item.id == this.product.id) {
        item.quantity++
        return true;
      }
    });

    if (!findItemExist) {
      this.product.quantity = 1;
      ressourceCart.items.push(this.product);
    }

    // add total price
    ressourceCart.total += this.product.price;
    await setRessourceCart(ressourceCart);
    if (this.networkState) await setCart(ressourceCart);

  }
}
customElements.define('product-card', ProductCard);