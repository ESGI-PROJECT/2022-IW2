import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addProductToCart } from '../idbHelper';

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

  addToCart() {
    addProductToCart(this.product);
  }

  render() {
    return html`
    <div class="card">
      <a href="/product/${this.product.id}">
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
        <button @click="${this.addToCart}">Add to cart</button>
      </div>
    `;
  }
}
customElements.define('product-card', ProductCard);
