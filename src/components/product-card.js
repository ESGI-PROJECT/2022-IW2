import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getCartIDB, setCartIDB } from '../idbHelper';
import { setCart } from '../api/cart';

export class ProductCard extends Base {
  constructor() {
    super();
    this.product = {};
    this.loaded = false;
    this.networkState = true;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
      networkState: { type: Boolean }
    }
  }
  firstUpdated() {
    this.querySelector('img').addEventListener('load', () => {
      this.loaded = true;
    });
  }

  async onAddToCart(e) {

    const cart = await getCartIDB();

    const productInCartIndex = cart.products.findIndex((product) => product.id == this.product.id);

    if (productInCartIndex !== -1) {
      cart.products[productInCartIndex].quantity++;
    } else {
      this.product.quantity = 1;
      cart.products.push(this.product);
    }

    cart.amount += this.product.price;

    if (this.networkState) await setCart(cart);

    await setCartIDB(cart);
  }

  render() {
    return html`
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : ''}" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
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
  <button @click="${this.onAddToCart}">Ajouter au panier</button>
    `;
  }
}
customElements.define('product-card', ProductCard);
