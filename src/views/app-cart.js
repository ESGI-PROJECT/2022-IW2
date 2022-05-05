import {html} from 'lit';
import {Base} from '../Base';
import "../components/cart-product-card";

export class AppCart extends Base {
    constructor() {
        super();
        this.products = [];
    }

    static get properties() {
        return {
            products: {type: Array},
        };
    }

    render() {
        return html`
            <h1>My Cart</h1>
            ${this.products.map(product => html`
                <cart-product-card .product="${product}"></cart-product-card>`)
            }`
    }
}

customElements.define('app-cart', AppCart);
