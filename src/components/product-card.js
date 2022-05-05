import {LitElement, html, css} from 'lit';
import {Base} from '../Base';
import {getRessource, setRessource} from "../idbHelper";


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

    async addToCart() {
        const {id} = this.product;
        const item = await getRessource('Cart', id);

        if (item) {
            const data = {...item, quantity: item.quantity + 1}
            await setRessource('Cart', data);
        } else {
            const data = {...this.product, quantity: 1}
            await setRessource('Cart', data);
        }
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
                </a>
                <main>
                    <h1>${this.product.title}</h1>
                    <p>${this.product.description}</p>
                    <button class="btn btn-blue" @click="${this.addToCart}">+ Add to cart</button>
                </main>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
