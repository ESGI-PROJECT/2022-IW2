import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

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

  render() {
    return html`
      <p>
        There is your cart
      </p>
    `;
  }
}
customElements.define('app-cart', AppCart);
