import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getOfflineCart } from "../idbHelper";
import { getCart } from "../api/cart";
import checkConnectivity from "network-latency";

checkConnectivity({
    interval: 3000,
    threshold: 2000
});

let NETWORK_STATE = true;

document.addEventListener('connection-changed', connectionChanged);

function connectionChanged(e) {
    NETWORK_STATE = e.detail;
}

export class CartTotalPrice extends Base {
    constructor() {
        super();

        this.networkState = null;
        this.cart = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        if (NETWORK_STATE) {
            this.cart = await getCart();
        } else {
            this.cart = await getOfflineCart();
        }
        console.log(this.cart)
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
        removeEventListener('connection-changed', connectionChanged);
    }

    static get properties() {
        return {
            cart: { type: Array }
        }
    }

    render() {
        if (NETWORK_STATE) {
            return html`
                <div>Total price : <b>${Math.floor(this.cart.total)} €</b></div>
            `
        } else {
            return html`
                <div>Total price : <b>${this.cart.reduce((acc, sum) => {
                    acc += sum.price * sum.quantity;
                    return Math.floor(acc);
                }, 0)}</b> €
            </div>
            `
        }
    }
}

customElements.define('cart-total-price', CartTotalPrice);
