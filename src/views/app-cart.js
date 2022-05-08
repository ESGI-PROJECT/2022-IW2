import {html} from 'lit';
import {Base} from '../Base';
import "../components/cart-item";

export class AppCart extends Base {
  constructor() {
    super();
    this.carts = [];
  }


  static get properties() {
    
    return {
      carts: { type: Array },

    };
  }


  render() {
    return  html`
    <section>
        <h1 class="title">Panier : ${this.carts.total}</h1>
        <div>
        ${this.carts.products.map(cart => html`
        <cart-item
            .cart="${cart}"
        ></cart-item>
        `)}
        </div>
    </section>
    `;
  }


}
customElements.define('app-cart', AppCart);
