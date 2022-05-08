import { LitElement, html, css } from 'lit';
import { setRessource, getRessource } from '../idbHelper';
import { Base } from '../Base';
import { setCart } from '../api/cart';

export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = true;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean },
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
          <p>${this.product.description}</p>
        </main>
        <button class="add-cart" @click="${this._addToCart}">Add to cart</button>
      </section>
    `;
  }

  _addToCart() {
    let cart = getRessource('Cart', 1);

    if (cart.products.find((product) => product.id == this.product.id)) {
      cart.products.find((product) => product.id == this.product.id).quantity++;
    } else {
      this.product.quantity = 1;
      cart.products.push(this.product);
    }
    setRessource("Cart", cart);
    setCart(cart)
  }
}
customElements.define('app-product', AppProduct);
