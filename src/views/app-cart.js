import { html } from 'lit';
import { setCart } from '../api/cart';
import { Base } from '../Base';
import "../components/product-card";
import "../components/remove-from-cart";

export class AppCart extends Base {
  constructor() {
    super();

    this.storedCart = {};

    this.loaded = false;
  }
  static get properties() {
    return {
      storedCart: { type: Object },
      loaded: { type: Boolean, state: true },
    };
  }
  loadImg() {
    this.loaded = true;
  }
  resetCart() {
    let cart = {products: [], total: 0};
    this.storedCart = cart;
    setCart(cart);
  }
  render() {
    return html`
      <button class="reset" @click="${this.resetCart}">Reset my cart</button>
      ${this.storedCart.products && this.storedCart.products.map(product => html`
        <div class="card">
          <header>
            <figure>
              <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${product.image})"></div>
              <img
                alt="${product.title}"
                src="http://localhost:9000/image/620/${product.image}"
                loading="lazy"
                width="1280" height="720"
                @load="${this.loadImg}">
            </figure>
          </header>
          <main>
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <p>${product.price}€</p>
            <remove-from-cart .product="${product}"></remove-from-cart>
          </main>
        </div>
      `)}
      <div class="total">
        <p>Total: ${this.storedCart.total}€</p>
      </div>
    `
  }
}
customElements.define('app-cart', AppCart);
