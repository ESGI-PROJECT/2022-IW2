import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getRessourceCart, setRessourceCart } from '../idbHelper';
import { setCart,getCart } from '../api/cart';

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
  render() {
    return html`
    <div class="card">
      <a href="/product/${this.product.id}">
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
          <p>${this.product.price}</p>
        </main>
      </a>
      <button @click="${this._addToCart}">
        Add to Cart
      </button>
    </div>  
    `;
  }

  async _addToCart(e) {

    let panier = await getRessourceCart();

    let allElement = panier.products.find(element => {
      if(element.id == this.product.id){
        element.quantity++;
        return true;
      }
    });
    if (!allElement) {
      this.product.quantity = 1;
      panier.products.push(this.product);
    }

    panier.total += this.product.price;
    await setRessourceCart(panier);
    await setCart(panier);
  }

}
customElements.define('product-card', ProductCard);
