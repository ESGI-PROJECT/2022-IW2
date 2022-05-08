import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-shop";

export class AppDashbaordPanier extends Base {
  constructor() {
    super();
    this.storedShop = {};
  }
  static get properties() {
    return {
      storedShop: { type: Object },
    };
  }


  render() {
    return html`
      <h1>Total : ${this.storedShop.total}</h2>
        <div>
          ${this.storedShop.list_products?.map(
            (product) =>
            html`
              <product-shop
                .product="${product}"
              ></product-shop>
            `
          )}
        </div>
    `;
  }
}
customElements.define('app-dashboard-panier', AppDashbaordPanier);
