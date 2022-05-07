import {LitElement, html, css, render} from 'lit';
import { Base } from '../Base';
import {getRessourceCart, setRessourceCart} from "../idbHelper";
import {setCart} from "../api/cart";

export class AppCart extends Base {
  constructor() {
    super();

    this.cart = {};
    this.loaded = true;
  }
  static get properties() {
    return {
      cart: { type: Object },
      loaded: { type: Boolean },
    };
  }

  render() {
    return html`
      <h1>Cart</h1>
      <h2>Total : $${this.cart.total}</h2>
        <table class="content-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${this.cart.products.map(
              (product) =>
              html`
                <tr>
                  <td><img src="${product.image}" width="50px"/></td>
                  <td>${product.title}</td>
                  <td>${product.price}</td>
                  <td><input type="number" min="1" @change="${(e) => this._changeQuantity(product.id, e.target.value)}" value="${product.quantity}" style="width: 50px"></td>
                  <td><button @click="${() => this._deleteFromCart(product.id)}">❌</button></td>
                </tr>
              `
            )}
          </tbody>
        </table>`;
  }

  async _changeQuantity(id, quantity) {
    const cart = await getRessourceCart();
    cart.products.find((product) => {
      if (product.id === id) {
        let diff = quantity - product.quantity;
        product.quantity += diff;

        if (product.quantity <= 0) {
          cart.total -= product.price * product.quantity;
          cart.total = Math.round(cart.total * 100) / 100;
          cart.products = cart.products.filter(product => product.id !== id);
        }

        cart.total += product.price * diff;
        cart.total = Math.round(cart.total * 100) / 100;
        return false;
      }
    });

    await setRessourceCart(cart);
    await setCart(cart);
    this.cart = cart;
  }

  async _deleteFromCart(id) {
    let cart = await getRessourceCart();
    cart.products.find(product => {
      if (product.id === id) {
        cart.total -= product.price * product.quantity;
        cart.total = Math.round(cart.total * 100) / 100;
        return true;
      }
    });

    cart.products = cart.products.filter(product => product.id !== id);

    await setRessourceCart(cart);
    await setCart(cart);
    this.cart = cart;

    return this.cart
  }
}
customElements.define('app-cart', AppCart);
