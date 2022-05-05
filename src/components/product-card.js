import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { setCart } from "../idbHelper";
import { addCart } from "../api/cart";

export class ProductCard extends Base {
    constructor() {
        super();

        this.product = {};

        this.loaded = false;
    }

    static get properties() {
        return {
            product: { type: Object },
            loaded: { type: Boolean, state: true },
        }
    }

    firstUpdated() {
        this.querySelector('img').addEventListener('load', () => {
            this.loaded = true;
        });
    }

    async addToCart() {
        await addCart(this.product);
        // await setCart(this.product);
    }

    render() {
        return html`
            <div class="card">
                <a href="/product/${this.product.id}">
                    <header>
                        <figure>
                            <div class="placeholder ${this.loaded ? 'fade' : ''}"
                                 style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
                            <img
                                    alt="${this.product.title}"
                                    src="http://localhost:9000/image/620/${this.product.image}"
                                    loading="lazy"
                                    width="1280" height="720">
                        </figure>
                    </header>
                    <main>
                        <h1>${this.product.title}</h1>
                        <p>${this.product.description}</p>
                    </main>
                </a>
                <div style="display: flex; justify-content: center; margin: 1rem 0;">
                    <button @click="${() => this.addToCart()}"
                            style="padding: 1rem; background-color: #5ff5c4; color: black; font-weight: bold; border-radius: 1rem; border: none; cursor: pointer">
                        Add to cart
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
