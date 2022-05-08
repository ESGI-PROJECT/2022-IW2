import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

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
      <br>
      <h3>Total panier : ${this.cart.total}</h3>
      
    `;
  }
}
customElements.define('app-cart', AppCart);