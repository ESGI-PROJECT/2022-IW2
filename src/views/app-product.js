import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = true;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean }
    };
  }


  _addInShop(e) {
    e.preventDefault()
    let event = new CustomEvent("addProduct",{detail:this.product})
    document.dispatchEvent(event)
  }


  render() {
    return html`
      <section class="product">
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
          <button class="add_shop" @click="${this._addInShop}" > ADD </button>
        </main>
      </section>
    `;
  }


}
customElements.define('app-product', AppProduct);
