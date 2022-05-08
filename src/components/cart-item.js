import { LitElement, html, css } from 'lit';
import { setCart, setTotal } from '../api/cart';
import { Base } from '../Base';
import { getRessource, setRessource } from '../idbHelper';

export class CartItem extends Base {
    constructor() {
        super();

        this.product = {};
        this.loaded = true;
    }
    static get properties() {
        return {
            product: { type: Object },
            loaded: { type: Boolean },
            quantity: { type: Number },
        };
    }

    render() {
        return html`
    <section class="product-cart">
        <main>
            <img alt="${this.product.title}" src="http://localhost:9000/image/620/${this.product.image}" loading="lazy"
                width="100" height="100">
            <h1>${this.product.title}</h1>
        </main>
        <footer>
            <p>${this.product.price} €</p>
            <div>
                <button @click="${() => this._quantityChange(-1)}">-</button>
                <span>
                    ${this.quantity = this.product.quantity}
                </span>
                <button @click="${() => this._quantityChange(1)}"> +</button>
            </div>
            <svg @click="${this._removeToCart}" xmlns="http://www.w3.org/2000/svg" fill="#ff0000" viewBox="0 0 30 30"
                width="50px" height="50px" preserveAspectRatio="xMaxYMin meet">
                <path
                    d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
            </svg>
        </footer>
    </section>
    `;
    }

    async _removeToCart() {
        let cart = await getRessource('Cart', 1);
        cart.products = cart.products.filter((product) => product.id != this.product.id);
        cart = setTotal(cart);
        setRessource("Cart", cart);
        setCart(cart);

        this.dispatchEvent(new CustomEvent('reloadcart', {
            detail: cart,
            bubbles: true,
            composed: true
        }));
    }

    async _quantityChange(e) {
        if (this.product.quantity + e > 0) {
            let cart = await getRessource('Cart', 1);
            this.product.quantity += e;
            this.quantity = cart.products.find((product) => product.id == this.product.id).quantity = this.product.quantity;
            cart = setTotal(cart);
            setRessource('Cart', cart);
            setCart(cart);

            this.dispatchEvent(new CustomEvent('reloadcart', {
                detail: cart,
                bubbles: true,
                composed: true
            }));
        }
    }
}
customElements.define('cart-item', CartItem);
