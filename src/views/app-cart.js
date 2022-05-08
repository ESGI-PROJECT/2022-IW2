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
        return this.products.map(product => html`
    <h1>${JSON.stringify(product)}</h1>
  `)
    }
}
customElements.define('app-cart', AppCart);
