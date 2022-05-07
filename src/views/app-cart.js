import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-cart";
import {getCart} from "../idbHelper";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = {};
  }
  static get properties() {
    return {
      cart: { type: Object },
    };
  }

  async updateCart() {
    const cart = await getCart();
    this.cart = cart;
    this.requestUpdate();
  }

  shouldUpdate(_changedProperties) {
    console.log("should update cart");
    console.log(_changedProperties);
    return super.shouldUpdate(_changedProperties);
  }


  render() {
    return html`
      <h1>Your cart</h1>
      <ul>
        ${this.cart.products != undefined && this.cart.products.map(product => html `
          <product-cart 
              .updateCart="${this.updateCart}"
              .product="${product}"></product-cart>`)}
      </ul>
    `;
  }
}
customElements.define('app-cart', AppCart);
