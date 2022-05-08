import { html } from 'lit';
import { Base } from '../Base';

export class AppCart extends Base {
  constructor() {
    super();
    this.cart = {};
    this.networkState = true;
  }

  static get properties() {
    return {
      products: { type: Array },
      cart: { type: Object },
      networkState: { type: Boolean }
    };
  }
  
  render() {
    console.log("dans cart view");
    console.log(this.cart.products);
    return this.cart.products.map(product => html`
      <product-card
        .product="${product}"
      ></product-card> 
    `)
  }
}
customElements.define('app-cart', AppCart);
