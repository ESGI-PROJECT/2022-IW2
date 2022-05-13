import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import { clearCart } from "../idbHelper";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = [];
    this.totalPrice = 0;
    this.location = "";
  }
  static get properties() {
    return {
      cart: { type: Array },
      totalPrice: { type: Number },
    };
  }

  resetCart() {
    clearCart();
  }

  render() {
    let productsCart = null;
    productsCart = this.cart.map(
      (product) =>
        html`
          <product-card
            .product="${product}"
            .location="${this.location}"
          ></product-card>
        `
    );

    if (this.cart.length === 0) {
      return html`
        <section class="cart">
          <h1>Your cart is empty</h1>
        </section>
      `;
    } else {
      return html`
        <section class="cart">
          <h1>Your cart with ${String(this.cart.length)} items</h1>
          <span>Total price: ${this.totalPrice}</span>
          <button
            style="display: flex; margin: 10px 0"
            @click="${this.resetCart}"
          >
            reset cart
          </button>
          ${productsCart}
        </section>
      `;
    }
  }
}
customElements.define("app-cart", AppCart);
