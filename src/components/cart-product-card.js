import {LitElement, html, css} from 'lit';
import {Base} from '../Base';
import {getRessource, setRessource} from "../idbHelper";
import product from "./product";


export class ProductCard extends Base {
    constructor() {
        super();

        this.product = {};
        this.loaded = false;
    }

    static get properties() {
        return {
            product: {type: Object},
            loaded: {type: Boolean, state: true},
        }
    }

    firstUpdated() {
        this.querySelector('img').addEventListener('load', () => {
            this.loaded = true;
        });
    }

    async updateProduct() {
        const data = {...this.product}
        await setRessource('Cart', data);

        this.requestUpdate()
    }

    async addToCart() {
        this.product.quantity = this.product.quantity + 1
        await this.updateProduct()
    }

    async removeFromCart() {
        if (this.product.quantity <= 1)
            return

        this.product.quantity = this.product.quantity - 1
        await this.updateProduct()
    }

    render() {
        return html`
            <div class="card">
                <main style="display: flex; align-items: center">
                    <div style="flex-basis: 20%">
                        <div class="placeholder ${this.loaded ? 'fade' : ''}"
                             style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
                        <img
                                alt="${this.product.title}"
                                src="http://localhost:9000/image/620/${this.product.image}"
                                loading="lazy"
                                width="200" height="720">
                    </div>
                    <div style="flex-basis: 50%">
                        <p>${this.product.title}</p>
                        <h6>Total: ${this.product.price * this.product.quantity}€</h6>
                    </div>
                    <div style="flex-basis: 30%">
                        <h6>You have ${this.product.quantity} items</h6>
                        <button class="btn btn-blue" @click="${this.addToCart}">+</button>
                        <button class="btn btn-red" @click="${this.removeFromCart}">-</button>
                    </div>
                </main>
            </div>
        `;
    }
}

customElements.define('cart-product-card', ProductCard);
