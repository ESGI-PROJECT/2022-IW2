import { html } from 'lit';
import { Base } from '../Base';
import {addProductToCart, getCart, removeProductFromCart} from "../idbHelper";

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

  async addProduct(product) {
    const updatedProduct = await addProductToCart(product);
    this.updateCart();
  }

  async removeProduct(productId) {
    const updatedProduct = await removeProductFromCart(productId);
    this.updateCart();
  }

  render() {
    return html `
      <h1>Your cart</h1>
      <ul>
        ${this.cart.products != undefined && this.cart.products.map(product => html `
          <li>
              <p>x${product.quantity} ${product.title}</p>
              <button @click="${() => this.addProduct(product)}">add</button>
              <button @click="${() => this.removeProduct(product.id)}">remove</button>
          </li>
          `)}
      </ul>
    `;
  }
}
customElements.define('app-cart', AppCart);
