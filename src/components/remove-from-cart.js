import { html } from "lit";
import { Base } from "../Base";
import { getCart, setCart } from "../api/cart";

export class RemoveFromCart extends Base {
    constructor() {
        super();
    
        this.product = {};
    }
    static get properties() {
        return {
        product: { type: Object },
        };
    }

    async removeProductFromCart() {
        const storedCart = await getCart();
        if (storedCart.products.length > 0) {
            storedCart.products = storedCart.products.filter(product => product.id !== this.product.id);
            storedCart.total = Number(storedCart.total) - Number(this.product.price);
            this.product = {};
            setCart(storedCart);
        }
    }
        
    render() {
        return html`
        <button class="remove-from-cart" @click="${this.removeProductFromCart}">Remove from cart</button>
        `;
    }
}
customElements.define('remove-from-cart', RemoveFromCart);