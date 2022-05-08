import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import "../components/cart-item";

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
            <div class="products" @reloadcart=${this._reloadCartListener}>
                <div style='position: sticky;top: 56px;z-index: 10;background: #fff;padding: 10px 0; margin-top: 30px'>
                    <h1>Panier</h1>
                    <span style="display: flex; justify-content: space-between;align-items: flex-end;margin-top:20px">
                        <span>${this.products.reduce((acc, product) => { return acc += product.quantity },
                0)}
                            article(s)</span>
                        <h2>${this.total} €</h2>
                    </span>
                </div>
                ${this.products.length ? this.products.map(product => html`<cart-item .product="${product}"></cart-item>`)
                   : html`<p style="text-align: center; margin-top: 20px;">Panier vide :'(</p>`}
            </div>`;
    }

    _reloadCartListener({ detail }) {
        this.total = detail.total;
        this.products = detail.products;
    }
}
customElements.define('app-cart', AppCart);
