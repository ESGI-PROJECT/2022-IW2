import { LitElement, html, css } from 'lit';
import { setCart, setTotal } from '../api/api';
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
    <section class="product">
        <header>
            <figure>
                <div class="placeholder ${this.loaded ? 'fade' : ''}"
                    style="background-image: url(http://localhost:9000/image/24/xxxxxxxxxxxxxxxxxxxxx)"></div>
                <img alt="${this.product.title}" src="http://localhost:9000/image/620/${this.product.image}" loading="lazy"
                    width="1280" height="720">
            </figure>
        </header>
        <main>
            <h1>${this.product.title}</h1>
            <p>${this.product.price} €</p>
        </main>
        <button @click="${() => this._quantityChange(-1)}">-</button>
        <span>
            ${this.quantity = this.product.quantity}
        </span>
        <button @click="${() => this._quantityChange(1)}"> +</button>
        <button @click="${this._removeToCart}"> Remove</button>
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