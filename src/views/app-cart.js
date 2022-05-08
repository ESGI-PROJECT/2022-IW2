import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import "../components/cart";

export class AppCart extends Base {
    constructor() {
        super();

        this.products = [];
        this.quantity = 0;
        this.total = 0;
    }
    static get properties() {
        return {
            products: { type: Array },
            total: { type: Number },
            quantity: { type: Number },
        };
    }
    render() {
        return html`
            <h1>Panier</h1>
            <div class="products" @reloadcart=${this._reloadCartListener}>
                <p>Total : ${this.total} € -- <small>${this.products.reduce((acc, product)=> { return acc += product.quantity },
                        0)}
                        article(s)</small></p>
                ${this.products.length ? this.products.map(product => html`<cart-item .product="${product}"></cart-item>`) 
                : html`<p style="text-align: center; margin-top: 20px;">Panier vide :'(</p>`}
            </div>`;
    }

    _reloadCartListener({detail}) {
        this.total = detail.total;
        this.products = detail.products;
    }
}
customElements.define('app-cart', AppCart);