import { html } from 'lit';
import { Base } from '../Base';
import { removeCartProduct, updateCartProduct } from '../api/cart';

export class CartProductCard extends Base {
  constructor() {
    super();

    this.cartProduct = {};
    this.cartProductIndex = undefined;

    this.loaded = false;
  }
  static get properties() {
    return {
      cartProduct: { type: Object },
      cartProductIndex: { type: Number },
      loaded: { type: Boolean, state: true },
    }
  }
  firstUpdated() {
    this.querySelector('img').addEventListener('load', () => {
      this.loaded = true;
    });

    this.querySelector('#increment-' + this.cartProduct.id).addEventListener('click', () => {
      this.cartProduct.quantity++;
      this.querySelector('#input-' + this.cartProduct.id).value = this.cartProduct.quantity;

      if (this.cartProduct.quantity === 0) {
        removeCartProduct(this.cartProduct, this.cartProductIndex);
      } else {
        updateCartProduct(this.cartProduct, this.cartProductIndex);
      }
    });

    this.querySelector('#decrement-' + this.cartProduct.id).addEventListener('click', () => {
      this.cartProduct.quantity--;
      this.querySelector('#input-' + this.cartProduct.id).value = this.cartProduct.quantity;

      if (this.cartProduct.quantity === 0) {
        removeCartProduct(this.cartProduct, this.cartProductIndex);
      } else {
        updateCartProduct(this.cartProduct, this.cartProductIndex);
      }
    });

    this.querySelector('#input-' + this.cartProduct.id).addEventListener('input', (e) => {
      this.cartProduct.quantity = e.target.value;
    });

    this.querySelector('#remove-' + this.cartProduct.id).addEventListener('click', (e) => {
      removeCartProduct(this.cartProduct, this.cartProductIndex);
    });
  }
  render() {
    return html`
      <div class="cart-card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${this.cartProduct.image})"></div>
            <img
              alt="${this.cartProduct.title}"
              src="http://localhost:9000/image/620/${this.cartProduct.image}"
              loading="lazy"
              width="80">
          </figure>
        </header>
        <main>
          <h1>${this.cartProduct.title}</h1>
          <button style="width: 30px; height: 30px" id="decrement-${this.cartProduct.id}">-</button>
          <input style="width: 30px; height: 30px" id="input-${this.cartProduct.id}" value="${this.cartProduct.quantity}"/>
          <button style="width: 30px; height: 30px" id="increment-${this.cartProduct.id}">+</button>
          <button style="height: 30px" id="remove-${this.cartProduct.id}">remove</button>
        </main>
      </a>
    `;
  }
}
customElements.define('cart-product-card', CartProductCard);
