import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { getRessourceCart, setRessourceCart } from '../idbHelper';
import { setCart} from '../api/cart';

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
      <h1>DETAILS:</h1>
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? 'fade' : '' }" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
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
          <button @click="${this._addToCart}">
          Add to Cart
        </button>
        </main>
      </section>
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
customElements.define('app-product', AppProduct);
