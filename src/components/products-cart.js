import { LitElement, html, css } from 'lit';
import { deleteProductCart } from '../api/cart';
import { Base } from '../Base';

export class ProductsCart extends Base {
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
      <a href="/cart" class="card">
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
          <div class="card-footer">
          <p>Quantité : ${this.product.quantity}</p>
          </div>
        </main>
  </a>
    `;
  }
}
customElements.define('products-cart', ProductsCart);
