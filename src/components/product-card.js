import { LitElement, html, css } from 'lit';
import { getRessource, setRessource } from '../idbHelper';
import { Base } from '../Base';
import { setCart } from '../api/cart';

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
      <a href="/product/${this.product.id}">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}"
              style="background-image: url(http://localhost:9000/image/24/xxxxxxxxxxxxxxxxxxxxx})"></div>
            <img alt="${this.product.title}" src="http://localhost:9000/image/620/${this.product.image}" loading="lazy"
              width="1280" height="720">
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
        </main>
      </a>
      <button class="add-cart" @click="${this._addToCart}">Add to cart</button>
    </div>
    `;
  }

  async _addToCart() {
    let cart = await getRessource('Cart', 1);

    if (cart.products.find((product) => product.id == this.product.id)) {
      cart.products.find((product) => product.id == this.product.id).quantity++;
    } else {
      this.product.quantity = 1;
      cart.products.push(this.product);
    }
    setRessource("Cart", cart);
    setCart(cart);
  }

}
customElements.define('product-card', ProductCard);
