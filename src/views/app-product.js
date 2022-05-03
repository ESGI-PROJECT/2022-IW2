import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import '../components/iron-ajax'

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
      <!-- <iron-ajax
        url="https://fakestoreapi.com/products/3"
        @get-data=${this.plop}></iron-ajax> -->

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
        </main>
      </section>
    `;
  }
}
customElements.define('app-product', AppProduct);
