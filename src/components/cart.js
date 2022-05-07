import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import {
    getOfflineCart,
    deleteItemOfflineCart,
    addToOfflineCart,
    removeQuantityFromOfflineCart,
    addQuantityFromOfflineCart
} from "../idbHelper";
import { addCart, getCart, removeCartItem } from "../api/cart";
import { addToCart } from "../methods"
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

export class Cart extends Base {
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

    async removeItem(id) {
        // Either way, we need to delete the item in the indexedDB
        await deleteItemOfflineCart(id);
        if(NETWORK_STATE) {
            // If connection is stable, we delete the item with the API
            const deletedItemIndex = this.cart.items.findIndex(item => item.id === id);
            this.cart.items.splice(deletedItemIndex, 1);
            await addCart([...this.cart.items]);
            this.cart = await getCart();
        } else {
            // If the connection isn't good enough, we request the offline cart
            this.cart = await getOfflineCart();
        }
    }

    async addQuantity(item) {
        item.quantity += 1;
        await addQuantityFromOfflineCart(item);
        await this.addToCart(item);
        this.cart = await getCart();
    }

    async removeQuantity(item) {
        if(NETWORK_STATE) {
            if((item.quantity -1) === 0) {
                const itemToDelete = this.cart.items.findIndex(cartItem => cartItem.id === item.id);
                this.cart.items.splice(itemToDelete, 1);
                await addCart([...this.cart.items]);
                this.cart = await getCart();
            } else {
                item.quantity -= 1;
                await this.addToCart(item);
                this.cart = await getCart();
            }
        }
        await removeQuantityFromOfflineCart(item);
    }

    async addToCart(product) {
        if(NETWORK_STATE) {
            await addCart([...this.cart.items]);
        }
        await addToOfflineCart(product);
    }

    render() {
        if (this.cart.items && this.cart.items.length > 0) {
            return this.cart.items.map(item => html`
                <div>
                    <div style="display: flex;">
                        <figure>
                            <div style="background-image: url(${item.image})"></div>
                            <img
                                    alt="${item.title}"
                                    src="http://localhost:9000/image/620/${item.image}"
                                    loading="lazy"
                                    width="120" height="120">
                        </figure>
                        <div style="display: flex; flex-direction: column; padding: 0.5rem;">
                            <div style="margin-bottom: 1rem;">
                                <p>${item.description}</p>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <b>Quantity : ${item?.quantity}</b>
                                <div>
                                    <button @click="${() => this.removeQuantity(item)}" class="buttonQuantity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             class="bi bi-chevron-left" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                        </svg>
                                    </button>
                                    <button @click="${() => this.addQuantity(item)}" class="buttonQuantity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             class="bi bi-chevron-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button @click="${() => this.removeItem(item.id)}" class="buttonDelete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else {
            return html`
                <div>No item yet</div>
            `
        }
    }
}

customElements.define('cart-jesus', Cart);
