import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

import { addToCart, getCartItem } from '../idbHelper';


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

    this.querySelector('.add-to-cart-btn')
        .addEventListener('click',() => this.addToCart())

  }

  async addToCart() {
    const {id: product_id} = this.product;
    const item = await getCartItem(product_id);

    if (item){
      const data = { product_id, quantity: item.quantity+1 }
      await addToCart(data);
    }else {
      const data = { product_id, quantity: 1 }
      await addToCart(data);
    }
  }

  render() {
      return html`
          <div class="card">
              <a href="/product/${this.product.id}" >
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
                  <button class="btn add-to-cart-btn">+ Add to cart</button>
              </main>
          </div>
      `;
  }
}
customElements.define('product-card', ProductCard);
