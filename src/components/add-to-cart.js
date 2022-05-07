import { html } from "lit";
import { Base } from "../Base";
import { getCart, setCart } from "../api/cart";

export class AddToCart extends Base {
    constructor() {
        super();
    
        this.product = {};
    }
    static get properties() {
        return {
        product: { type: Object },
        };
    }

    async addProductToCart() {
        let cart = {products: [], total: 0};
        const storedCart = await getCart();
        console.log(storedCart);
        if (storedCart.products.length > 0) {
            storedCart.products.forEach(product => {
                cart.products.push(product);
                cart.total += product.price;
            });
        }
        cart.products.push(this.product);
        cart.total = cart.total + this.product.price;

        setCart(cart);
    }
        
    render() {
        return html`
        <button class="add-to-cart" @click="${this.addProductToCart}">Add to cart</button>
        `;
    }
}
customElements.define('add-to-cart', AddToCart);