import { html } from 'lit';
import { Base } from '../Base';
import "../components/cart";

export class AppCart extends Base {
    constructor() {
        super();

        this.cart = [];
    }

    static get properties() {
        return {
            cart: { type: Array },
        };
    }

    render() {
        return html`
            <cart-jesus .cart=${this.cart} style="display: flex; flex-wrap: wrap; justify-content: space-around;"/>
        `
    }
}

customElements.define('app-cart', AppCart);
