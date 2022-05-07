import { html } from 'lit';
import { Base } from '../Base';
import "../components/cart";
import { getCart } from "../api/cart";

export class AppCart extends Base {
    static get properties() {
        return {
            cart: { type: Array },
            networkState: {
                type: Boolean
            }
        }
    }

    constructor() {
        super();

        this.networkState = null;
        this.cart = [];
    }

    render() {
        return html`
            <cart-jesus .cart=${this.cart} .networkState="${this.networkState}" style="display: flex; flex-wrap: wrap; justify-content: space-around;"/>
        `
    }
}

customElements.define('app-cart', AppCart);
