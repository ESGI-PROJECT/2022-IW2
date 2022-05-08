import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

export class AppCart extends Base {
  constructor() {
    super();

    this.products = [];

  }
  static get properties() {
    
    return {
        products: { type: Array },
    };

  }

  render() {
    return html `<h1>Cart</h1>`;
  }
}
customElements.define('app-cart', AppCart);
