import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

export class AppCart extends Base {
  constructor() {
    super();

    this.products = {};
  }
  static get properties() {
    return {
      products: { type: Array }
    };
  }

  render() {
    return this.products.map(product => html`
      <p>
      ${product.title}
      <b>- ${product.price}</b>
      </p>
      <hr/>
    `)
  };
}
customElements.define('app-cart', AppCart);
