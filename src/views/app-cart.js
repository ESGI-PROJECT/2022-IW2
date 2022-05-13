import { LitElement, html, css } from "lit";
import { Base } from "../Base";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = [];
    this.totalPrice = 0;
  }
  static get properties() {
    return {
      cart: { type: Array },
      totalPrice: { type: Number },
    };
  }

  render() {
    return html`
      <section class="cart">
        <h1>Your cart</h1>
        <h2>Total price: ${this.totalPrice}</h2>
      </section>
    `;
  }
}
customElements.define("app-cart", AppCart);
