import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addToCart, getCart } from '../idbHelper';

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
        <button @click="${this._addToCart}">Add to cart</button>
        <button @click="${this._getCart}">Get cart</button>
        <p><button @click="${this._increment}">Click Me!</button></p>
  </a>
    `;
  }

  _increment(e) {
    console.log('has been clicked')
    this.count++;
  }

  async _addToCart(e) {
    return await addToCart(this.product);
  }

  async _getCart(e) {
    return await getCart();
  }

}
customElements.define('product-card', ProductCard);
