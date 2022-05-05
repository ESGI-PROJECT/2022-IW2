import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getCart, removeFromCart } from "../idbHelper";
import { getCartContent } from "../api/cart";

export class Cart extends Base {
    constructor() {
        super();

        this.cart = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        this.cart = await getCartContent();
    }

    static get properties() {
        return {
            cart: { type: Array },
        }
    }

    async removeItem(id) {
        await removeFromCart(id);
        const deletedItemIndex = this.cart.items.findIndex(item => item.id === id);
        this.cart.items.splice(deletedItemIndex, 1);
        this.cart = await getCart();
    }

    render() {
        if (this.cart.items && this.cart.items.length > 0) {
            return this.cart.items.map(item => html`
                <div>
                    <div style="display: flex; flex-direction: column">
                        <figure>
                            <div style="background-image: url(${item.image})"></div>
                            <img
                                    alt="${item.title}"
                                    src="http://localhost:9000/image/620/${item.image}"
                                    loading="lazy"
                                    width="200" height="200">
                        </figure>
                        <div>
                            <button @click="${() => this.removeItem(item.id)}">Remove Item</button>
                        </div>
                    </div>
                    <div>
                        <p>${item.description}</p>
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
