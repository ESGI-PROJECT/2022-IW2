import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-card";

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
    console.log(this.products)
    return html`
    <h1>My Cart</h1>
    ${ this.products.map(product => html`
    <product-card .product="${product}"></product-card>`)
    }`
  }
}

customElements.define('app-cart', AppCart);
