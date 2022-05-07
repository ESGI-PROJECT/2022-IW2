import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-card";

export class AppHome extends Base {
  constructor() {
    super();

    this.products = [];
    this.networkState = false;
  }
  static get properties() {
    return {
      products: { type: Array },
      networkState: { type: Boolean },
    };
  }
  render() {
    return this.products.map(product => html`
      <product-card
        .product="${product}"
        .networkState="${this.networkState}"
      ></product-card> 
    `)
  }
}
customElements.define('app-home', AppHome);
