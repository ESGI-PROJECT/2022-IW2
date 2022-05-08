import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import "../components/products-cart";

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
    return this.products.map(product => html`
    <products-cart
      .product="${product}"
    ></products-cart> 
  `)
  }
}
customElements.define('app-cart', AppCart);
