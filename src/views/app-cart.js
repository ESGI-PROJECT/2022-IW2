import { html } from "lit";
import { Base } from "../Base";
import "../components/cart-product";
import { toDollars } from "../utils";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = { products: [], totalPrice: 0 };
    this.loaded = false;
    this.handleCartUpdate = this.handleCartUpdate.bind(this);
  }

  static get properties() {
    return {
      cart: { type: Object },
    };
  }

  handleCartUpdate(cart) {
    this.cart = cart;
  }

  render() {
    return this.cart.products.length
      ? html`
          <div id="cart">
            <div id="products">
              ${this.cart.products.map(
                (cartProduct) =>
                  html` <cart-product .cartProduct="${cartProduct}" .handleCartUpdate="${this.handleCartUpdate}"></card-product>`
              )}
            </div>
            <div id="total-price">
              <span>Total price</span>
              <span>${toDollars(this.cart.totalPrice)}</span>
            </div>
          </div>
        `
      : html`<div id="cart-empty">Your cart is empty 🤔</div>`;
  }
}

customElements.define("app-cart", AppCart);
