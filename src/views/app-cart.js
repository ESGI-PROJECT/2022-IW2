import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addProductToCart, removeProductFromCart } from '../idbHelper';

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
    console.log(this.cart);
    return html`
      <h1>Your cart</h1>
      <ul>
        ${this.cart.products != undefined && this.cart.products.map(product => 
            html `<product-cart .product="${product}"></product-cart>`
        )}
      </ul>
    `;
  }
}
customElements.define('app-cart', AppCart);
