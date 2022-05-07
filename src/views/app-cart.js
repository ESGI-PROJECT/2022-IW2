import { html } from 'lit';
import { Base } from '../Base';
import {addProductToCart, getLocalCart, removeProductFromCart} from "../idbHelper";
import {setApiCart} from "../api/cart";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = {};
    this.networkState = false;
  }
  static get properties() {
    return {
      cart: { type: Object },
      networkState: { type: Boolean }
    };
  }

  async updateCart() {
    const cart = await getLocalCart();
    this.cart = cart;

    // Update API if connected to internet
    if (this.networkState) {
      setApiCart(cart);
    }

    // Update LitElement
    this.requestUpdate();
  }

  async addProduct(product) {
    await addProductToCart(product);
    this.updateCart();
  }

  async removeProduct(productId) {
    await removeProductFromCart(productId);
    this.updateCart();
  }

  render() {
    return html `
      <div>
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
      </div>
    `;
  }
}
customElements.define('app-cart', AppCart);
